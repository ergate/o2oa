package com.x.cms.assemble.control.jaxrs.fileinfo;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.pdfbox.io.MemoryUsageSetting;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.tika.Tika;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;

import com.deepoove.poi.XWPFTemplate;
import com.google.gson.JsonElement;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.entity.StorageType;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.config.StorageMapping;
import com.x.base.core.project.config.Config;
import com.x.base.core.project.config.Cms;
import com.x.base.core.project.exception.ExceptionAccessDenied;
import com.x.base.core.project.exception.ExceptionStorageMappingNotExist;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.WoFile;
import com.x.base.core.project.jaxrs.WoId;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.DocumentTools;
import com.x.base.core.project.tools.ExtractTextTools;
import com.x.base.core.project.tools.FileTools;
import com.x.base.core.project.tools.ListTools;
import com.x.cms.core.entity.FileInfo;
import com.x.cms.core.entity.Document;
import com.x.cms.assemble.control.Business;
import com.x.cms.assemble.control.LibreOfficeUtil;
import com.x.cms.assemble.control.ThisApplication;
import com.x.cms.assemble.control.factory.FileInfoFactory;

/**
 * 根据模板生成证书文件
 * 
 * @author sword
 */
public class ActionCertificate extends BaseAction {

	private static Logger logger = LoggerFactory.getLogger(ActionCertificate.class);

	protected ActionResult<Wo> execute(HttpServletRequest request, EffectivePerson effectivePerson,
			String templateFlag, JsonElement jsonElement) throws Exception {
		logger.info("execute action 'ActionCertificate'......");
		logger.debug("receive templateFlag:{}, jsonElement:{}.", templateFlag, jsonElement);
		Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
		ActionResult<Wo> result = new ActionResult<>();
		Wo wo = new Wo();
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			Business business = new Business(emc);
			// 根据参数中的模板附件标志获取模板的附件信息
			FileInfo templateInfo = emc.find(templateFlag, FileInfo.class);
			// 模板文件是否存在
			if (null == templateInfo) {
				throw new ExceptionTemplateInfoNotExists(templateFlag);
			}
			// 模板所属的文档是否存在（用来获取模板的附件文件）
			Document template = emc.find(templateInfo.getDocumentId(), Document.class);
			if (null == template) {
				throw new ExceptionDocumentNotExists(templateInfo.getDocumentId());
			}

			// 学员信息文档是否存在
			Document studentDocument = emc.find(wi.getStudentDocumentID(), Document.class);
			if (null == studentDocument) {
				throw new ExceptionDocumentNotExists(wi.getStudentDocumentID());
			}
			// 学员信息文档的确权
			if (!business.isDocumentReader(effectivePerson, studentDocument)) {
				throw new ExceptionAccessDenied(effectivePerson);
			}
			// 取得模板文件
			StorageMapping mapping = ThisApplication.context().storageMappings().get(FileInfo.class,
					templateInfo.getStorage());
			byte[] bytes;
			Optional<Cms.DocExtensionEvent> event = Config.cms().getExtensionEvents()
					.getDocAttachmentDownloadEvents().bind(template.getAppId(), template.getCategoryId());
			if (event.isPresent()) {
				bytes = this.extensionService(effectivePerson, templateInfo, event.get());
			} else {
				bytes = templateInfo.readContent(mapping);
			}
			// 将模板文件保存在当前目录下
			Path root = Config.path_local_temp(true);
			String fileName = templateInfo.getName();
			String filePath = root + File.separator + UUID.randomUUID().toString() + "."
					+ FilenameUtils.getExtension(fileName); // 完整文件路径
			try {
				saveFile(filePath,bytes);
			} catch (Exception e) {
				Exception exception = new ExceptionTemplateSave(e, "将模板文件写入到本地文件时发生异常.");
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}

			CommonArg commonArg = new CommonArg();
			commonArg.setProject_name(wi.getProject_name());
			commonArg.setCheckinfo(wi.getCheckinfo());
			commonArg.setDate(wi.getSigning_time());
			commonArg.setOpeningTime(wi.getOpeningTime());
			commonArg.setEndingTime(wi.getEndingTime());
			commonArg.setCreatorUnitName(wi.getCreatorUnitName());
			commonArg.setActualHours(wi.getActualHours());
			// 根据证书文档ID获取当前附件列表
			FileInfoFactory fileInfoFactory = business.getFileInfoFactory();
			List<String> ids = fileInfoFactory.listAttachmentByDocument(wi.getStudentDocumentID());// 获取指定文档的所有附件列表
			List<FileInfo> fileInfoList = emc.list(FileInfo.class, ids);// 查询ID IN ids 的所有文件或者附件信息列表
			List<String> certificateList = new ArrayList<>();
			// 根据模板生成证书文件
			for (CertificateArg certificateArg : wi.getCertificateArgList()) {
				String prefix;
				if (certificateArg.getSite().contains("_nobg")){
					prefix = "证书(无背景)：";
				}else{
					prefix = "证书(有背景)：";
				}
				String certificateFilename = prefix + "【" + certificateArg.getCertificate_id() + "】"
						+ certificateArg.getStudent_name() + ".docx";
				String certificatePath = root + File.separator + certificateFilename;
				try {
					makeCertificate(filePath, certificatePath, certificateArg, commonArg);
				} catch (IOException e) {
					Exception exception = new ExceptionCertificateMake(e, "生成证书文件失败.");
					result.error(exception);
					logger.error(e, effectivePerson, request, null);
				}
				// 读取证书文件
				File certificateFile = new File(certificatePath);

				// 转成PDF文件
				byte[] certificate_pdf = null;
				try(ByteArrayOutputStream out = new ByteArrayOutputStream()){
					boolean res = LibreOfficeUtil.convertOffice2PDFSync(certificateFile, out);
					if(res) {
						certificate_pdf = out.toByteArray();
					}
					// FileUtils.forceDelete(docFile);
				}
				if (null == certificate_pdf) {
					throw new ExceptionConvertError();
				}				
				// byte[] certificate = new byte[(int) certificateFile.length()];
				// try {
				// 	FileInputStream fis = new FileInputStream(certificateFile);
				// 	fis.read(certificate);
				// 	fis.close();
				// 	logger.info("文件内容已读取到字节数组中，字节数组长度：" + certificate.length);
				// } catch (IOException e) {
				// 	Exception exception = new ExceptionCertificateRead(e, "读取生成的证书文件发生错误.");
				// 	result.error(exception);
				// 	logger.error(e, effectivePerson, request, null);
				// }
				// byte[] certificate_pdf = DocumentTools.toPdf(certificateFilename, certificate, "");
				String certificateFilename_pdf = FilenameUtils.getBaseName(certificateFilename) + ".pdf";
				try {
					saveFile(root + File.separator + certificateFilename_pdf,certificate_pdf);
				} catch (Exception e) {
					Exception exception = new ExceptionCertificateSave(e, "将文件写入到本地文件时发生异常.");
					result.error(exception);
					logger.error(e, effectivePerson, request, null);
				}
				logger.debug("子文件的附件信息：" +fileInfoList.toString());	
				wo.setId(updateCertificate(effectivePerson, studentDocument, fileInfoList, certificate_pdf,
						certificateFilename_pdf,certificateArg.getSite(),wi.getStudentDocumentID()));
				if (certificateFile.exists()) {
					certificateFile.delete();
					logger.info("清除服务器临时文件：" + certificatePath);
				}						

				certificateList.add(root + File.separator + certificateFilename_pdf);					

			}
			// 清理模板文件
			File file = new File(filePath);
			if (file.exists()) {
				file.delete();
				logger.info("清除服务器临时文件：" + filePath);
			}
			if (wi.getId().equals("")==false){
				Document document;
				// 发证记录文档是否存在
				document = emc.find(wi.getId(), Document.class);
				if (null == document) {
					throw new ExceptionDocumentNotExists(wi.getId());
				}
				// 发证记录的确权
				if (!business.isDocumentReader(effectivePerson, document)) {
					throw new ExceptionAccessDenied(effectivePerson);
				}
				PDFMergerUtility pdfMerger = new PDFMergerUtility();
				List<String> certificateids = fileInfoFactory.listAttachmentByDocument(wi.getId());// 获取指定文档的所有附件列表
				List<FileInfo> certificatefileInfoList = emc.list(FileInfo.class, certificateids);
				for (String pdfFile : certificateList) {
					pdfMerger.addSource(new File(pdfFile));
				}
				String certificateids_pj="证书(打印)：【"+wi.getProject_id()+"】"+ wi.getProject_name()+"_结业证书.pdf";
				String certificateids_pj_path = root + File.separator + certificateids_pj;
				pdfMerger.setDestinationFileName(certificateids_pj_path);
				pdfMerger.mergeDocuments(MemoryUsageSetting.setupMainMemoryOnly());
				for (String pdfFile : certificateList) {
					file = new File(pdfFile);
					if (file.exists()) {
						file.delete();
						logger.info("清除服务器临时文件：" + filePath);
					}
				}
				File certificateFile = new File(certificateids_pj_path);
				byte[] certificate = new byte[(int) certificateFile.length()];
				try {
					FileInputStream fis = new FileInputStream(certificateFile);
					fis.read(certificate);
					fis.close();
					logger.info("文件内容已读取到字节数组中，字节数组长度：" + certificate.length);
				} catch (IOException e) {
					Exception exception = new ExceptionCertificateRead(e, "读取生成的证书文件发生错误.");
					result.error(exception);
					logger.error(e, effectivePerson, request, null);
				}
				logger.info("主文件的附件信息：" +certificatefileInfoList.toString());	
				wo.setId(updateCertificate(effectivePerson, document, certificatefileInfoList, certificate,
						certificateids_pj,wi.getSite(),wi.getId()));
				if (certificateFile.exists()) {
					certificateFile.delete();
					logger.info("清除服务器临时文件：" + certificateids_pj_path);
				}	
			}

		}

		result.setData(wo);
		logger.info("action 'ActionCertificate' execute completed!");
		return result;
	}

	private String updateCertificate(EffectivePerson effectivePerson, Document document,
			List<FileInfo> fileInfoList, byte[] certificate_pdf, String certificateFilename_pdf, String site,
			String id) throws Exception {
		FileInfo attachment = new FileInfo();
		Boolean updateFlg = false;
		logger.debug("附件信息：" +fileInfoList.toString());	
		logger.info("site:"+site);
		logger.info("flg:"+ListTools.isNotEmpty(fileInfoList));
		if (ListTools.isNotEmpty(fileInfoList)) { // 存在附件
			for (FileInfo fileInfo : fileInfoList) {
				logger.info("oldSite:{}, newSite:{}.", fileInfo.getSite(), site);
				if (fileInfo.getSite().equals(site)) {// 是证书文件，更新
					String old_attId = fileInfo.getId();
					attachment = fileInfoServiceAdv.get(old_attId);
					if (null == attachment) {
						throw new ExceptionFileInfoNotExists(old_attId);
					}

					FileTools.verifyConstraint(certificate_pdf.length, certificateFilename_pdf, null);

					StorageMapping mapping_old = ThisApplication.context().storageMappings().get(FileInfo.class,
							attachment.getStorage());

					attachment = this.concreteAttachment(mapping_old, attachment, document,
							certificateFilename_pdf, effectivePerson, site);

					attachment.setType((new Tika()).detect(certificate_pdf, certificateFilename_pdf));
					logger.debug("filename:{}, file type:{}.", attachment.getName(), attachment.getType());
					if (Config.query().getExtractImage() && ExtractTextTools.supportImage(attachment.getName())
							&& ExtractTextTools.available(certificate_pdf)) {
						attachment.setText(ExtractTextTools.image(certificate_pdf));
						logger.debug("filename:{}, file type:{}, text:{}.", attachment.getName(), attachment.getType(),
								attachment.getText());
					}

					// 文件存储
					attachment.updateContent(mapping_old, certificate_pdf, certificateFilename_pdf);
					// 完成替换逻辑
					attachment = fileInfoServiceAdv.updateAttachment(id, old_attId, attachment, mapping_old);

					CacheManager.notify(FileInfo.class);
					CacheManager.notify(Document.class);
					updateFlg = true;// 更新标志
				}
			}
		}
		if (updateFlg) {

		} else {// 不存在附件,添加
			StorageMapping mapping_new = ThisApplication.context().storageMappings().random(FileInfo.class);
			if (mapping_new == null) {
				throw new ExceptionStorageMappingNotExist(StorageType.cms.name());
			}

			FileTools.verifyConstraint(certificate_pdf.length, certificateFilename_pdf, null);

			attachment = this.concreteAttachment(mapping_new, null, document, certificateFilename_pdf,
					effectivePerson,
					site);

			attachment.setType((new Tika()).detect(certificate_pdf, certificateFilename_pdf));
			logger.info("filename:{}, file type:{}.", attachment.getName(), attachment.getType());
			if (Config.query().getExtractImage() && ExtractTextTools.supportImage(attachment.getName())
					&& ExtractTextTools.available(certificate_pdf)) {
				attachment.setText(ExtractTextTools.image(certificate_pdf));
				logger.info("filename:{}, file type:{}, text:{}.", attachment.getName(), attachment.getType(),
						attachment.getText());
			}

			attachment.saveContent(mapping_new, certificate_pdf, certificateFilename_pdf);
			attachment = fileInfoServiceAdv.saveAttachment(id, attachment);

			CacheManager.notify(FileInfo.class);
			CacheManager.notify(Document.class);

		}

		return attachment.getId();
	}

	private void makeCertificate(String templatePath, String certificateFilename, CertificateArg certificateArg,
			CommonArg commonArg) throws Exception {

		Map<String, Object> datas = new HashMap<String, Object>();
		String certificatePath = certificateFilename;

		// text
		datas.put("student_name", certificateArg.getStudent_name());
		datas.put("gender", certificateArg.getGender());
		datas.put("idcard", certificateArg.getIdcard());
		datas.put("mobile", certificateArg.getMobile());
		datas.put("unit", certificateArg.getUnit());
		datas.put("actualTrainingHours", certificateArg.getActualTrainingHours());
		datas.put("rate", certificateArg.getRate());
		datas.put("certificate_id", certificateArg.getCertificate_id());
		datas.put("date", commonArg.getDate());
		datas.put("checkinfo", commonArg.getCheckinfo());
		datas.put("project_name", commonArg.getProject_name());
		datas.put("actualHours", commonArg.getActualHours());
		datas.put("creatorUnitName", commonArg.getCreatorUnitName());
		datas.put("endingTime", commonArg.getEndingTime());
		datas.put("openingTime", commonArg.getOpeningTime());

		XWPFTemplate.compile(templatePath)
				.render(datas)
				.writeToFile(certificatePath);
	}

	private void saveFile(String filePath,byte[] bytes) throws Exception{
		OutputStream output = null;
		File file = new File(filePath);
		if (file.exists()) {
			file.delete();
			logger.info("删除旧文件，创建新文件......");
		}			
		file.createNewFile();
		try {
			logger.info("准备开始保存文件到本地：" + filePath);
			output = new FileOutputStream(filePath);
			output.write(bytes);
			output.flush();
			logger.info("保存文件到本地成功完成！");
		} catch (Exception e) {
			Exception exception = new ExceptionTemplateSave(e,
				"将文件写入到本地文件时发生异常. FileName:" + filePath);
			throw exception;
		} finally {
			logger.info("关闭输出流......");
			output.close();
		}
	}
	public static class Wi extends GsonPropertyObject {

		private static final long serialVersionUID = 8167538341492974963L;

		@FieldDescribe("文档ID")
		private String id;

		@FieldDescribe("附件控件框")
		private String site;

		@FieldDescribe("项目名称")
		private String project_name;

		@FieldDescribe("项目编号")
		private String project_id;

		@FieldDescribe("发证日期")
		private String signing_time;

		@FieldDescribe("查验")
		private String checkinfo;

		@FieldDescribe("开班时间")
		private String openingTime;

		@FieldDescribe("结业时间")
		private String endingTime;

		@FieldDescribe("办学单位")
		private String creatorUnitName;

		@FieldDescribe("学时")
		private String actualHours;

		@FieldDescribe("学员信息文件ID")
		private String studentDocumentID;

		@FieldDescribe("证书文件生成参数")
		private List<CertificateArg> certificateArgList;

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getSite() {
			return site;
		}

		public void setSite(String site) {
			this.site = site;
		}

		public String getProject_name() {
			return project_name;
		}

		public void setProject_name(String project_name) {
			this.project_name = project_name;
		}

		public String getProject_id() {
			return project_id;
		}

		public void setProject_id(String project_id) {
			this.project_id = project_id;
		}

		public String getSigning_time() {
			return signing_time;
		}

		public void setSigning_time(String signing_time) {
			this.signing_time = signing_time;
		}

		public String getCheckinfo() {
			return checkinfo;
		}

		public void setCheckinfo(String checkinfo) {
			this.checkinfo = checkinfo;
		}

		public String getOpeningTime() {
			return openingTime;
		}

		public void setOpeningTime(String openingTime) {
			this.openingTime = openingTime;
		}

		public String getEndingTime() {
			return endingTime;
		}

		public void setEndingTime(String endingTime) {
			this.endingTime = endingTime;
		}

		public String getCreatorUnitName() {
			return creatorUnitName;
		}

		public void setCreatorUnitName(String creatorUnitName) {
			this.creatorUnitName = creatorUnitName;
		}

		public String getActualHours() {
			return actualHours;
		}

		public void setActualHours(String actualHours) {
			this.actualHours = actualHours;
		}

		public String getStudentDocumentID() {
			return studentDocumentID;
		}

		public void setStudentDocumentID(String studentDocumentID) {
			this.studentDocumentID = studentDocumentID;
		}

		public List<CertificateArg> getCertificateArgList() {
			return certificateArgList;
		}

		public void setCertificateArgList(List<CertificateArg> certificateArgList) {
			this.certificateArgList = certificateArgList;
		}

		

	}

	public static class CertificateArg {

		@FieldDescribe("附件控件框")
		private String site;

		@FieldDescribe("学员姓名")
		private String student_name;

		@FieldDescribe("性别")
		private String gender;

		@FieldDescribe("身份证号")
		private String idcard;

		@FieldDescribe("手机号")
		private String mobile;

		@FieldDescribe("所属单位")
		private String unit;

		@FieldDescribe("实际出勤课时")
		private String actualTrainingHours;

		@FieldDescribe("出勤率")
		private String rate;

		@FieldDescribe("证书编号")
		private String certificate_id;

		public String getSite() {
			return site;
		}

		public void setSite(String site) {
			this.site = site;
		}

		public String getStudent_name() {
			return student_name;
		}

		public void setStudent_name(String student_name) {
			this.student_name = student_name;
		}

		public String getGender() {
			return gender;
		}

		public void setGender(String gender) {
			this.gender = gender;
		}

		public String getIdcard() {
			return idcard;
		}

		public void setIdcard(String idcard) {
			this.idcard = idcard;
		}

		public String getMobile() {
			return mobile;
		}

		public void setMobile(String mobile) {
			this.mobile = mobile;
		}

		public String getUnit() {
			return unit;
		}

		public void setUnit(String unit) {
			this.unit = unit;
		}

		public String getActualTrainingHours() {
			return actualTrainingHours;
		}

		public void setActualTrainingHours(String actualTrainingHours) {
			this.actualTrainingHours = actualTrainingHours;
		}

		public String getRate() {
			return rate;
		}

		public void setRate(String rate) {
			this.rate = rate;
		}

		public String getCertificate_id() {
			return certificate_id;
		}

		public void setCertificate_id(String certificate_id) {
			this.certificate_id = certificate_id;
		}

	}

	private FileInfo concreteAttachment(StorageMapping mapping, FileInfo attachment, Document document, String name,
			EffectivePerson effectivePerson, String site) throws Exception {
		if (attachment == null) {
			attachment = new FileInfo();
		}

		String fileName = UUID.randomUUID().toString();
		String extension = FilenameUtils.getExtension(name);
		if (StringUtils.isNotEmpty(extension)) {
			fileName = fileName + "." + extension;
		} else {
			throw new Exception("file extension is empty.");
		}
		if (name.indexOf("\\") > 0) {
			name = StringUtils.substringAfterLast(name, "\\");
		}
		if (name.indexOf("/") > 0) {
			name = StringUtils.substringAfterLast(name, "/");
		}
		attachment.setCreateTime(new Date());
		attachment.setLastUpdateTime(new Date());
		attachment.setExtension(extension);
		attachment.setName(name);
		attachment.setFileName(fileName);
		attachment.setStorage(mapping.getName());
		attachment.setAppId(document.getAppId());
		attachment.setCategoryId(document.getCategoryId());
		attachment.setDocumentId(document.getId());
		attachment.setCreatorUid(effectivePerson.getDistinguishedName());
		attachment.setSite(site);
		attachment.setFileHost("");
		attachment.setFileType("ATTACHMENT");
		attachment.setFileExtType(getExtType(extension));
		attachment.setFilePath("");
		return attachment;
	}

	private String getExtType(String ext) {
		String type = "OTHER";
		if ("jpg".equalsIgnoreCase(ext)) {
			type = "PICTURE";
		} else if ("jpeg".equalsIgnoreCase(ext)) {
			type = "PICTURE";
		} else if ("png".equalsIgnoreCase(ext)) {
			type = "PICTURE";
		} else if ("tif".equalsIgnoreCase(ext)) {
			type = "PICTURE";
		} else if ("bmp".equalsIgnoreCase(ext)) {
			type = "PICTURE";
		} else if ("gif".equalsIgnoreCase(ext)) {
			type = "PICTURE";
		} else if ("xls".equalsIgnoreCase(ext)) {
			type = "EXCEL";
		} else if ("xlsx".equalsIgnoreCase(ext)) {
			type = "EXCEL";
		} else if ("doc".equalsIgnoreCase(ext)) {
			type = "WORD";
		} else if ("docx".equalsIgnoreCase(ext)) {
			type = "WORD";
		} else if ("ppt".equalsIgnoreCase(ext)) {
			type = "PPT";
		} else if ("pptx".equalsIgnoreCase(ext)) {
			type = "PPT";
		} else if ("zip".equalsIgnoreCase(ext)) {
			type = "ZIP";
		} else if ("rar".equalsIgnoreCase(ext)) {
			type = "ZIP";
		} else if ("txt".equalsIgnoreCase(ext)) {
			type = "TXT";
		} else if ("pdf".equalsIgnoreCase(ext)) {
			type = "PDF";
		}
		return type;
	}

	public static class Wo extends WoId {

	}

	private static class CommonArg {

		@FieldDescribe("项目名称")
		private String project_name;

		@FieldDescribe("发证日期")
		private String date;

		@FieldDescribe("查验")
		private String checkinfo;

		@FieldDescribe("开班时间")
		private String openingTime;

		@FieldDescribe("结业时间")
		private String endingTime;

		@FieldDescribe("办学单位")
		private String creatorUnitName;

		@FieldDescribe("学时")
		private String actualHours;

		public String getProject_name() {
			return project_name;
		}

		public void setProject_name(String project_name) {
			this.project_name = project_name;
		}

		public String getDate() {
			return date;
		}

		public void setDate(String date) {
			this.date = date;
		}

		public String getCheckinfo() {
			return checkinfo;
		}

		public void setCheckinfo(String checkinfo) {
			this.checkinfo = checkinfo;
		}

		public String getOpeningTime() {
			return openingTime;
		}

		public void setOpeningTime(String openingTime) {
			this.openingTime = openingTime;
		}

		public String getEndingTime() {
			return endingTime;
		}

		public void setEndingTime(String endingTime) {
			this.endingTime = endingTime;
		}

		public String getCreatorUnitName() {
			return creatorUnitName;
		}

		public void setCreatorUnitName(String creatorUnitName) {
			this.creatorUnitName = creatorUnitName;
		}

		public String getActualHours() {
			return actualHours;
		}

		public void setActualHours(String actualHours) {
			this.actualHours = actualHours;
		}


	}

}
