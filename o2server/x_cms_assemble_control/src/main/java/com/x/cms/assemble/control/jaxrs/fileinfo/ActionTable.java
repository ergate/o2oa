package com.x.cms.assemble.control.jaxrs.fileinfo;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.tika.Tika;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import java.io.ByteArrayOutputStream;
import org.jodconverter.core.document.DefaultDocumentFormatRegistry;
import org.jodconverter.local.JodConverter;
import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.config.Configure;
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy;
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
import com.x.cms.assemble.control.ThisApplication;
import com.x.cms.assemble.control.factory.FileInfoFactory;
import com.x.cms.assemble.control.LibreOfficeUtil;

/**
 * 根据通用表格模板生成表格文件
 * @author sword
 */
public class ActionTable extends BaseAction {

	private static  Logger logger = LoggerFactory.getLogger( ActionTable.class );
	protected ActionResult<Wo> execute( HttpServletRequest request, EffectivePerson effectivePerson, 
										String id, String templateFlag, JsonElement jsonElement ) throws Exception {
		logger.info("execute action 'ActionTable'......");
		logger.debug("receive id:{}, receive templateFlag:{}, jsonElement:{}.", id, templateFlag,jsonElement);
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
			// 文档是否存在
			Document document = emc.find(id, Document.class);
			if (null == document) {
				throw new ExceptionDocumentNotExists(id);
			}
			// 文档的确权
			if (!business.isDocumentReader(effectivePerson, document)) {
				throw new ExceptionAccessDenied(effectivePerson);
			}
			// 取得模板文件
			StorageMapping mapping = ThisApplication.context().storageMappings().get(FileInfo.class, templateInfo.getStorage());
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
			String templateFileName = templateInfo.getName();
			String templatePath = root + File.separator +  UUID.randomUUID().toString()+"."+FilenameUtils.getExtension(templateFileName);; // 完整文件路径
			try {
				saveFile(templatePath,bytes);
			} catch (Exception e) {
				Exception exception = new ExceptionTemplateSave(e, "将模板文件写入到本地文件时发生异常.");
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}
			// 根据模板生成目标文件
			Wi wi = this.convertToWrapIn( jsonElement, Wi.class );
			String targetFilename = wi.getTemplate()+"：【"+wi.getProject_id()+"】"+wi.getProject_name()+".docx";
			String targetPath = root + File.separator + targetFilename;
			try{
				makeTable(templatePath ,targetPath, wi);
			}catch (IOException e) {
				Exception exception = new ExceptionContractMake(e, "生成目标文件失败.");
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}finally{
				// 清理模板文件
				File file = new File(templatePath);
				if (file.exists()) {
					file.delete();
					logger.info("清除服务器临时文件：" + templatePath);
				}
			}
			// 读取目标文件
			File file = new File(targetPath);

			// 转成PDF文件
			byte[] attachment_pdf = null;
			try(ByteArrayOutputStream out = new ByteArrayOutputStream()){
				boolean res = LibreOfficeUtil.convertOffice2PDFSync(file, out);
				if(res) {
					attachment_pdf = out.toByteArray();
				}
			}
			if (null == attachment_pdf) {
				throw new ExceptionConvertError();
			}

			String filename_pdf = FilenameUtils.getBaseName(targetFilename) + ".pdf";
			// 根据目标文档ID获取当前附件列表
			FileInfoFactory fileInfoFactory = business.getFileInfoFactory();
			List<String> ids = fileInfoFactory.listAttachmentByDocument( id );// 获取指定文档的所有附件列表
			List<FileInfo> fileInfoList = emc.list( FileInfo.class, ids );// 查询ID IN ids 的所有文件或者附件信息列表

			wo.setId(updateAttachment(effectivePerson, document, fileInfoList, attachment_pdf,
						filename_pdf,wi.getSite(),id));
			wo.setName(filename_pdf);
			// 清除服务器临时文件
			if (file.exists()) {
				file.delete();
				logger.info("清除服务器临时文件：" + targetPath);
			}
		}
				
		result.setData(wo);
		logger.info("action 'ActionTable' execute completed!");
		return result;	
	}

    private void makeTable(String templatePath, String targetFilename, Wi wi) throws Exception {
        	
		Map<String, Object> datas = new HashMap<String, Object>();
		String targetPath=targetFilename;

		LoopRowTableRenderPolicy policy = new LoopRowTableRenderPolicy();

		Configure config = Configure.builder().bind("table", policy).build(); 
		datas.put("table", wi.getTargetFileArg().getDatatable());
		datas.put("creatorUnit", wi.getTargetFileArg().getCreatorUnit());
		datas.put("creatorPerson", wi.getTargetFileArg().getCreatorPerson());
		datas.put("date", wi.getTargetFileArg().getDate());
		datas.put("total", wi.getTargetFileArg().getTotal());
					
		XWPFTemplate template = XWPFTemplate.compile(templatePath, config).render(datas);
		template.writeToFile(targetPath);

    }

	private String updateAttachment(EffectivePerson effectivePerson, Document document,
			List<FileInfo> fileInfoList, byte[] attachment_pdf, String filename_pdf, String site,
			String id) throws Exception {
		FileInfo attachment = new FileInfo();
		Boolean updateFlg = false;
		logger.info("附件信息：" +fileInfoList.toString());	
		logger.info("site:"+site);
		logger.info("flg:"+ListTools.isNotEmpty(fileInfoList));
		if (ListTools.isNotEmpty(fileInfoList)) { // 存在附件
			for (FileInfo fileInfo : fileInfoList) {
				logger.info("oldSite:{}, newSite:{}.", fileInfo.getSite(), site);
				if (fileInfo.getSite().equals(site)) {// 是目标文件，更新
					String old_attId = fileInfo.getId();
					attachment = fileInfoServiceAdv.get(old_attId);
					if (null == attachment) {
						throw new ExceptionFileInfoNotExists(old_attId);
					}

					FileTools.verifyConstraint(attachment_pdf.length, filename_pdf, null);

					StorageMapping mapping_old = ThisApplication.context().storageMappings().get(FileInfo.class,
							attachment.getStorage());

					attachment = this.tableAttachment(mapping_old, attachment, document,
							filename_pdf, effectivePerson, site);

					attachment.setType((new Tika()).detect(attachment_pdf, filename_pdf));
					logger.debug("filename:{}, file type:{}.", attachment.getName(), attachment.getType());
					if (Config.query().getExtractImage() && ExtractTextTools.supportImage(attachment.getName())
							&& ExtractTextTools.available(attachment_pdf)) {
						attachment.setText(ExtractTextTools.image(attachment_pdf));
						logger.debug("filename:{}, file type:{}, text:{}.", attachment.getName(), attachment.getType(),
								attachment.getText());
					}

					// 文件存储
					attachment.updateContent(mapping_old, attachment_pdf, filename_pdf);
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

			FileTools.verifyConstraint(attachment_pdf.length, filename_pdf, null);

			attachment = this.tableAttachment(mapping_new, null, document, filename_pdf,
					effectivePerson,
					site);

			attachment.setType((new Tika()).detect(attachment_pdf, filename_pdf));
			logger.info("filename:{}, file type:{}.", attachment.getName(), attachment.getType());
			if (Config.query().getExtractImage() && ExtractTextTools.supportImage(attachment.getName())
					&& ExtractTextTools.available(attachment_pdf)) {
				attachment.setText(ExtractTextTools.image(attachment_pdf));
				logger.info("filename:{}, file type:{}, text:{}.", attachment.getName(), attachment.getType(),
						attachment.getText());
			}

			attachment.saveContent(mapping_new, attachment_pdf, filename_pdf);
			attachment = fileInfoServiceAdv.saveAttachment(id, attachment);

			CacheManager.notify(FileInfo.class);
			CacheManager.notify(Document.class);

		}
		return attachment.getId();
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
		
		@FieldDescribe("附件控件框")
		private String site;

		@FieldDescribe("项目编号")
		private String project_id;

		@FieldDescribe("项目名称")
		private String project_name;

		@FieldDescribe("模板名称")
		private String template;

		@FieldDescribe("目标文件参数")
		private TargetFileArg targetFileArg;

		public void setProject_id(String project_id) {
			this.project_id = project_id;
		}

		public void setProject_name(String project_name) {
			this.project_name = project_name;
		}

		public void setSite(String site) {
			this.site = site;
		}

		public void setTemplate(String template) {
			this.template = template;
		}

		public void setTargetFileArg(TargetFileArg targetFileArg) {
			this.targetFileArg = targetFileArg;
		}

		public String getProject_id() {
			return project_id;
		}

		public String getProject_name() {
			return project_name;
		}

		public String getSite() {
			return site;
		}

		public String getTemplate() {
			return template;
		}
		public TargetFileArg getTargetFileArg() {
			return targetFileArg;
		}

	}
	public static class TargetFileArg  {

		@FieldDescribe("制表单位")
		private String creatorUnit;

		@FieldDescribe("制表人")
		private String creatorPerson;		

		@FieldDescribe("制表日期")
		private String date;
		
		@FieldDescribe("合计")
		private String total;

		@FieldDescribe("数据表格")
		private List<Datatable> datatable;

		public String getCreatorUnit() {
			return creatorUnit;
		}

		public void setCreatorUnit(String creatorUnit) {
			this.creatorUnit = creatorUnit;
		}

		public String getCreatorPerson() {
			return creatorPerson;
		}

		public void setCreatorPerson(String creatorPerson) {
			this.creatorPerson = creatorPerson;
		}

		public String getDate() {
			return date;
		}

		public void setDate(String date) {
			this.date = date;
		}
		
		public String getTotal() {
			return total;
		}

		public void setTotal(String total) {
			this.total = total;
		}

		public List<Datatable> getDatatable() {
			return datatable;
		}

		public void setDatatable(List<Datatable> datatable) {
			this.datatable = datatable;
		}	
	}

	public static class Datatable  {
		
		@FieldDescribe("序号")
		private String no;

		@FieldDescribe("培训名称")
		private String project_name;

		@FieldDescribe("课程名称")
		private String course_name;
		
		@FieldDescribe("教师姓名")
		private String teacher_name;
		
		@FieldDescribe("职称")
		private String teacher_title;
		
		@FieldDescribe("单位")
		private String teacher_unit;

		@FieldDescribe("标准")
		private String courseStandard;
		
		@FieldDescribe("学时")
		private String course_hours;
		
		@FieldDescribe("金额")
		private String course_fees;
		
		@FieldDescribe("备注")
		private String coursedescription;

		public String getNo() {
			return no;
		}

		public void setNo(String no) {
			this.no = no;
		}

		public String getProject_name() {
			return project_name;
		}

		public void setProject_name(String project_name) {
			this.project_name = project_name;
		}

		public String getCourse_name() {
			return course_name;
		}

		public void setCourse_name(String course_name) {
			this.course_name = course_name;
		}

		public String getTeacher_name() {
			return teacher_name;
		}

		public void setTeacher_name(String teacher_name) {
			this.teacher_name = teacher_name;
		}

		public String getTeacher_title() {
			return teacher_title;
		}

		public void setTeacher_title(String teacher_title) {
			this.teacher_title = teacher_title;
		}

		public String getTeacher_unit() {
			return teacher_unit;
		}

		public void setTeacher_unit(String teacher_unit) {
			this.teacher_unit = teacher_unit;
		}

		public String getCourseStandard() {
			return courseStandard;
		}

		public void setCourseStandard(String courseStandard) {
			this.courseStandard = courseStandard;
		}

		public String getCourse_hours() {
			return course_hours;
		}

		public void setCourse_hours(String course_hours) {
			this.course_hours = course_hours;
		}

		public String getCourse_fees() {
			return course_fees;
		}

		public void setCourse_fees(String course_fees) {
			this.course_fees = course_fees;
		}

		public String getCoursedescription() {
			return coursedescription;
		}

		public void setCoursedescription(String coursedescription) {
			this.coursedescription = coursedescription;
		}
	}


	private FileInfo tableAttachment( StorageMapping mapping, FileInfo attachment, Document document, String name, EffectivePerson effectivePerson, String site) throws Exception {
		if ( attachment == null ) {
			attachment = new FileInfo();
		}

		String fileName = UUID.randomUUID().toString();
		String extension = FilenameUtils.getExtension( name );
		if ( StringUtils.isNotEmpty(extension)) {
			fileName = fileName + "." + extension;
		}else{
			throw new Exception("file extension is empty.");
		}
		if( name.indexOf( "\\" ) >0 ){
			name = StringUtils.substringAfterLast( name, "\\");
		}
		if( name.indexOf( "/" ) >0 ){
			name = StringUtils.substringAfterLast( name, "/");
		}
		attachment.setCreateTime( new Date() );
		attachment.setLastUpdateTime( new Date() );
		attachment.setExtension( extension );
		attachment.setName( name );
		attachment.setFileName( fileName );
		attachment.setStorage( mapping.getName() );
		attachment.setAppId( document.getAppId() );
		attachment.setCategoryId( document.getCategoryId() );
		attachment.setDocumentId( document.getId() );
		attachment.setCreatorUid( effectivePerson.getDistinguishedName() );
		attachment.setSite( site );
		attachment.setFileHost( "" );
		attachment.setFileType("ATTACHMENT");
		attachment.setFileExtType( getExtType( extension ) );
		attachment.setFilePath( "" );
		return attachment;
	}
	

	private String getExtType( String ext ){
		String type = "OTHER";
		if( "jpg".equalsIgnoreCase( ext ) ){ type = "PICTURE";
		} else if("jpeg".equalsIgnoreCase( ext ) ){ type = "PICTURE";
		} else if("png".equalsIgnoreCase( ext ) ){ type = "PICTURE";
		} else if("tif".equalsIgnoreCase( ext ) ){ type = "PICTURE";
		} else if("bmp".equalsIgnoreCase( ext ) ){ type = "PICTURE";
		} else if("gif".equalsIgnoreCase( ext ) ){ type = "PICTURE";
		} else if("xls".equalsIgnoreCase( ext ) ){ type = "EXCEL";
		} else if("xlsx".equalsIgnoreCase( ext ) ){ type = "EXCEL";
		} else if("doc".equalsIgnoreCase( ext ) ){ type = "WORD";
		} else if("docx".equalsIgnoreCase( ext ) ){ type = "WORD";
		} else if("ppt".equalsIgnoreCase( ext ) ){ type = "PPT";
		} else if("pptx".equalsIgnoreCase( ext ) ){ type = "PPT";
		} else if("zip".equalsIgnoreCase( ext ) ){ type = "ZIP";
		} else if("rar".equalsIgnoreCase( ext ) ){ type = "ZIP";
		} else if("txt".equalsIgnoreCase( ext ) ){ type = "TXT";
		} else if("pdf".equalsIgnoreCase( ext ) ){ type = "PDF";
		}
		return type;
	}

	public static class Wo extends WoId {
		
		@FieldDescribe("文件名")
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}

	 
}
