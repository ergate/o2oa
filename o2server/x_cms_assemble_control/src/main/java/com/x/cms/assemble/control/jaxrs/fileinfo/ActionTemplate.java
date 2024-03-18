package com.x.cms.assemble.control.jaxrs.fileinfo;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.tika.Tika;

import java.io.File;
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
 * 根据合同模板生成合同文件
 * @author sword
 */
public class ActionTemplate extends BaseAction {

	private static  Logger logger = LoggerFactory.getLogger( ActionTemplate.class );
	protected ActionResult<Wo> execute( HttpServletRequest request, EffectivePerson effectivePerson, 
										String id, String templateFlag, JsonElement jsonElement ) throws Exception {
		logger.info("execute action 'ActionTemplate'......");
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
			// 合同文档是否存在
			Document document = emc.find(id, Document.class);
			if (null == document) {
				throw new ExceptionDocumentNotExists(id);
			}
			// 合同文档的确权
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
			String fileName = templateInfo.getName();
			String filePath = root + File.separator +  UUID.randomUUID().toString()+"."+FilenameUtils.getExtension(fileName);; // 完整文件路径
			try {
				saveFile(filePath,bytes);
			} catch (Exception e) {
				Exception exception = new ExceptionTemplateSave(e, "将模板文件写入到本地文件时发生异常.");
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}
			// 根据模板生成合同文件
			Wi wi = this.convertToWrapIn( jsonElement, Wi.class );
			String contractFilename = "合同：【"+wi.getProject_id()+"】"+wi.getProject_name()+".docx";
			String contractPath = root + File.separator + contractFilename;
			try{
				makeContract(filePath ,contractPath, wi);
			}catch (IOException e) {
				Exception exception = new ExceptionContractMake(e, "生成合同文件失败.");
				result.error(exception);
				logger.error(e, effectivePerson, request, null);
			}finally{
				// 清理模板文件
				File file = new File(filePath);
				if (file.exists()) {
					file.delete();
					logger.info("清除服务器临时文件：" + filePath);
				}
			}
			// 读取合同文件
			File file = new File(contractPath);

			// 转成PDF文件
			byte[] contract_pdf = null;
			try(ByteArrayOutputStream out = new ByteArrayOutputStream()){
				boolean res = LibreOfficeUtil.convertOffice2PDFSync(file, out);
				if(res) {
					// 添加水印
					LibreOfficeUtil.addWatermarkToPdf(out, "南开大学非学历教育",0.3f); 
					contract_pdf = out.toByteArray();
				}
				// FileUtils.forceDelete(docFile);
			}
			if (null == contract_pdf) {
				throw new ExceptionConvertError();
			}

			// byte[] contract = new byte[(int) file.length()];
			// try {
			// 		FileInputStream fis = new FileInputStream(file);
			// 		fis.read(contract);
			// 		fis.close();
			// 		logger.info("文件内容已读取到字节数组中，字节数组长度：" + contract.length);
			// 	} catch (IOException e) {
			// 		Exception exception = new ExceptionContractRead(e, "读取生成的合同文件发生错误.");
			// 		result.error(exception);
			// 		logger.error(e, effectivePerson, request, null);
			// 	};
			// byte[] contract_pdf = DocumentTools.toPdf(contractFilename, contract, "");
			String contractFilename_pdf = FilenameUtils.getBaseName(contractFilename) + ".pdf";
			// 根据合同文档ID获取当前附件列表
			FileInfoFactory fileInfoFactory = business.getFileInfoFactory();
			List<String> ids = fileInfoFactory.listAttachmentByDocument( id );// 获取指定文档的所有附件列表
			List<FileInfo> fileInfoList = emc.list( FileInfo.class, ids );// 查询ID IN ids 的所有文件或者附件信息列表

			wo.setId(updateCertificate(effectivePerson, document, fileInfoList, contract_pdf,
						contractFilename_pdf,wi.getSite(),id));
			// 清除服务器临时文件
			if (file.exists()) {
				file.delete();
				logger.info("清除服务器临时文件：" + contractPath);
			}
		}
				
		result.setData(wo);
		logger.info("action 'ActionTemplate' execute completed!");
		return result;	
	}

    private void makeContract(String templatePath, String contractFilename, Wi wi) throws Exception {
        	
		Map<String, Object> datas = new HashMap<String, Object>();
		String contractPath=contractFilename;

		if (wi.getTemplate().equals("南开大学标准培训合同")) {
			// text
			Configure config = Configure.builder().useSpringEL().build(); 
			datas.put("contract_id", wi.getContractArg().getContract_id());
			datas.put("client", wi.getContractArg().getClient());
			datas.put("client_addr", wi.getContractArg().getClient_addr());
			datas.put("client_contacts", wi.getContractArg().getClient_contacts());
			datas.put("client_phone", wi.getContractArg().getClient_phone());
			datas.put("client_fax", wi.getContractArg().getClient_fax());
			datas.put("college", wi.getContractArg().getCollege());
			datas.put("college_addr", wi.getContractArg().getCollege_addr());
			datas.put("college_contacts", wi.getContractArg().getCollege_contacts());
			datas.put("college_phone", wi.getContractArg().getCollege_phone());
			datas.put("college_fax", wi.getContractArg().getCollege_fax());
			datas.put("signing_time", wi.getContractArg().getSigning_time());
			datas.put("signing_location", wi.getContractArg().getSigning_location());
			datas.put("project_name", wi.getContractArg().getProject_name());
			datas.put("openingTime", wi.getContractArg().getOpeningTime());
			datas.put("endingTime", wi.getContractArg().getEndingTime());
			datas.put("trainAddress", wi.getContractArg().getTrainAddress());
			datas.put("traineesNumber", wi.getContractArg().getTraineesNumber());
			datas.put("unitPrice", wi.getContractArg().getUnitPrice());
			datas.put("totalTuition", wi.getContractArg().getTotalTuition());
			datas.put("totalTuitionCN", wi.getContractArg().getTotalTuitionCN());
			datas.put("cost1", wi.getContractArg().getCost1());
			datas.put("cost2", wi.getContractArg().getCost2());
			datas.put("cost3", wi.getContractArg().getCost3());
			datas.put("accommodation", wi.getContractArg().getAccommodation());
			datas.put("accommodationCN", wi.getContractArg().getAccommodationCN());
			datas.put("meals", wi.getContractArg().getMeals());
			datas.put("mealsCN", wi.getContractArg().getMealsCN());
			datas.put("paymentDate1", wi.getContractArg().getPaymentDate1());
			datas.put("rate", wi.getContractArg().getRate());
			datas.put("paymentDate2", wi.getContractArg().getPaymentDate2());
			datas.put("paymentDate3", wi.getContractArg().getPaymentDate3());
			datas.put("copies1", wi.getContractArg().getCopies1());
			datas.put("copies2", wi.getContractArg().getCopies2());
			logger.info("datas：" +datas.toString());	
			XWPFTemplate.compile(templatePath,config)
				.render(datas)
				.writeToFile(contractPath);	
		}
		if (wi.getTemplate().equals("中国建设银行股份有限公司服务订单")) {
			LoopRowTableRenderPolicy policy = new LoopRowTableRenderPolicy();

			Configure config = Configure.builder().bind("timetable", policy).useSpringEL().build(); 
			datas.put("timetable", wi.getContractArg().getTimetable());
			datas.put("contract_id", wi.getContractArg().getContract_id());
			datas.put("client", wi.getContractArg().getClient());
			datas.put("project_name", wi.getContractArg().getProject_name());
			datas.put("openingTime", wi.getContractArg().getOpeningTime());
			datas.put("endingTime", wi.getContractArg().getEndingTime());
			datas.put("trainAddress", wi.getContractArg().getTrainAddress());
			datas.put("traineesNumber", wi.getContractArg().getTraineesNumber());
			datas.put("tuition", wi.getContractArg().getTuition());
			datas.put("accommodation", wi.getContractArg().getAccommodation());
			datas.put("totalTuition", wi.getContractArg().getTotalTuition());
			datas.put("others", wi.getContractArg().getOthers());
			datas.put("college_contacts", wi.getContractArg().getCollege_contacts());
			datas.put("client_contacts", wi.getContractArg().getClient_contacts());
			datas.put("signing_time", wi.getContractArg().getSigning_time());
			datas.put("signing_location", wi.getContractArg().getSigning_location());
			datas.put("college", wi.getContractArg().getCollege());
			datas.put("client_unit", wi.getContractArg().getClient_unit());
			logger.info("datas：" +datas.toString());				
			XWPFTemplate template = XWPFTemplate.compile(templatePath, config).render(datas);
			template.writeToFile(contractPath);
		}

    }

	private String updateCertificate(EffectivePerson effectivePerson, Document document,
			List<FileInfo> fileInfoList, byte[] contract_pdf, String contractFilename_pdf, String site,
			String id) throws Exception {
		FileInfo attachment = new FileInfo();
		Boolean updateFlg = false;
		logger.info("附件信息：" +fileInfoList.toString());	
		logger.info("site:"+site);
		logger.info("flg:"+ListTools.isNotEmpty(fileInfoList));
		if (ListTools.isNotEmpty(fileInfoList)) { // 存在附件
			for (FileInfo fileInfo : fileInfoList) {
				logger.info("oldSite:{}, newSite:{}.", fileInfo.getSite(), site);
				if (fileInfo.getSite().equals(site)) {// 是合同文件，更新
					String old_attId = fileInfo.getId();
					attachment = fileInfoServiceAdv.get(old_attId);
					if (null == attachment) {
						throw new ExceptionFileInfoNotExists(old_attId);
					}

					FileTools.verifyConstraint(contract_pdf.length, contractFilename_pdf, null);

					StorageMapping mapping_old = ThisApplication.context().storageMappings().get(FileInfo.class,
							attachment.getStorage());

					attachment = this.concreteAttachment(mapping_old, attachment, document,
							contractFilename_pdf, effectivePerson, site);

					attachment.setType((new Tika()).detect(contract_pdf, contractFilename_pdf));
					logger.debug("filename:{}, file type:{}.", attachment.getName(), attachment.getType());
					if (Config.query().getExtractImage() && ExtractTextTools.supportImage(attachment.getName())
							&& ExtractTextTools.available(contract_pdf)) {
						attachment.setText(ExtractTextTools.image(contract_pdf));
						logger.debug("filename:{}, file type:{}, text:{}.", attachment.getName(), attachment.getType(),
								attachment.getText());
					}

					// 文件存储
					attachment.updateContent(mapping_old, contract_pdf, contractFilename_pdf);
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

			FileTools.verifyConstraint(contract_pdf.length, contractFilename_pdf, null);

			attachment = this.concreteAttachment(mapping_new, null, document, contractFilename_pdf,
					effectivePerson,
					site);

			attachment.setType((new Tika()).detect(contract_pdf, contractFilename_pdf));
			logger.info("filename:{}, file type:{}.", attachment.getName(), attachment.getType());
			if (Config.query().getExtractImage() && ExtractTextTools.supportImage(attachment.getName())
					&& ExtractTextTools.available(contract_pdf)) {
				attachment.setText(ExtractTextTools.image(contract_pdf));
				logger.info("filename:{}, file type:{}, text:{}.", attachment.getName(), attachment.getType(),
						attachment.getText());
			}

			attachment.saveContent(mapping_new, contract_pdf, contractFilename_pdf);
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

		@FieldDescribe("合同文件生成参数")
		private ContractArg contractArg;

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

		public void setContractArg(ContractArg contractArg) {
			this.contractArg = contractArg;
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
		public ContractArg getContractArg() {
			return contractArg;
		}

	}
	public static class ContractArg  {

		@FieldDescribe("甲方名称")
		private String client;

		@FieldDescribe("主办部门或总分支机构")
		private String client_unit;		

		@FieldDescribe("甲方地址")
		private String client_addr;

		@FieldDescribe("甲方联系人")
		private String client_contacts;

		@FieldDescribe("甲方电话")
		private String client_phone;

		@FieldDescribe("甲方传真")
		private String client_fax;

		@FieldDescribe("乙方名称")
		private String college;

		@FieldDescribe("乙方地址")
		private String college_addr;

		@FieldDescribe("乙方联系人")
		private String college_contacts;

		@FieldDescribe("乙方电话")
		private String college_phone;

		@FieldDescribe("乙方传真")
		private String college_fax;

		@FieldDescribe("签约时间")
		private String signing_time;

		@FieldDescribe("签约地点")
		private String signing_location;

		@FieldDescribe("项目名称")
		private String project_name;

		@FieldDescribe("开始时间")
		private String openingTime;

		@FieldDescribe("结束时间")
		private String endingTime;

		@FieldDescribe("培训地点")
		private String trainAddress;

		@FieldDescribe("培训人数")
		private String traineesNumber;

		@FieldDescribe("人员单价")
		private String unitPrice;

		@FieldDescribe("培训费总额")
		private String totalTuition;

		@FieldDescribe("培训费总额大写")
		private String totalTuitionCN;

		@FieldDescribe("其他服务1")
		private String cost1;

		@FieldDescribe("其他服务2")
		private String cost2;

		@FieldDescribe("其他服务3")
		private String cost3;

		@FieldDescribe("住宿费")
		private String accommodation;

		@FieldDescribe("住宿费大写")
		private String accommodationCN;

		@FieldDescribe("餐费")
		private String meals;

		@FieldDescribe("餐费大写")
		private String mealsCN;

		@FieldDescribe("培训费预付期限")
		private String paymentDate1;

		@FieldDescribe("培训费预付比例")
		private String rate;

		@FieldDescribe("培训费尾款支付期限")
		private String paymentDate2;

		@FieldDescribe("后勤保障费用支付期限")
		private String paymentDate3;

		@FieldDescribe("合同总份数")
		private String copies1;

		@FieldDescribe("各方合同份数")
		private String copies2;

		@FieldDescribe("订单编号")
		private String contract_id;

		@FieldDescribe("培训费")
		private String tuition;
		
		@FieldDescribe("其他约定")
		private String others;
		
		@FieldDescribe("课表")
		private List<Timetable> timetable;

		public String getClient() {
			return client;
		}

		public void setClient(String client) {
			this.client = client;
		}

		public String getClient_unit() {
			return client_unit;
		}

		public void setClient_unit(String client_unit) {
			this.client_unit = client_unit;
		}		

		public String getClient_addr() {
			return client_addr;
		}

		public void setClient_addr(String client_addr) {
			this.client_addr = client_addr;
		}

		public String getClient_contacts() {
			return client_contacts;
		}

		public void setClient_contacts(String client_contacts) {
			this.client_contacts = client_contacts;
		}

		public String getClient_phone() {
			return client_phone;
		}

		public void setClient_phone(String client_phone) {
			this.client_phone = client_phone;
		}

		public String getClient_fax() {
			return client_fax;
		}

		public void setClient_fax(String client_fax) {
			this.client_fax = client_fax;
		}

		public String getCollege() {
			return college;
		}

		public void setCollege(String college) {
			this.college = college;
		}

		public String getCollege_addr() {
			return college_addr;
		}

		public void setCollege_addr(String college_addr) {
			this.college_addr = college_addr;
		}

		public String getCollege_contacts() {
			return college_contacts;
		}

		public void setCollege_contacts(String college_contacts) {
			this.college_contacts = college_contacts;
		}

		public String getCollege_phone() {
			return college_phone;
		}

		public void setCollege_phone(String college_phone) {
			this.college_phone = college_phone;
		}

		public String getCollege_fax() {
			return college_fax;
		}

		public void setCollege_fax(String college_fax) {
			this.college_fax = college_fax;
		}

		public String getSigning_time() {
			return signing_time;
		}

		public void setSigning_time(String signing_time) {
			this.signing_time = signing_time;
		}

		public String getSigning_location() {
			return signing_location;
		}

		public void setSigning_location(String signing_location) {
			this.signing_location = signing_location;
		}

		public String getProject_name() {
			return project_name;
		}

		public void setProject_name(String project_name) {
			this.project_name = project_name;
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

		public String getTrainAddress() {
			return trainAddress;
		}

		public void setTrainAddress(String trainAddress) {
			this.trainAddress = trainAddress;
		}

		public String getTraineesNumber() {
			return traineesNumber;
		}

		public void setTraineesNumber(String traineesNumber) {
			this.traineesNumber = traineesNumber;
		}

		public String getUnitPrice() {
			return unitPrice;
		}

		public void setUnitPrice(String unitPrice) {
			this.unitPrice = unitPrice;
		}

		public String getTotalTuition() {
			return totalTuition;
		}

		public void setTotalTuition(String totalTuition) {
			this.totalTuition = totalTuition;
		}

		public String getTotalTuitionCN() {
			return totalTuitionCN;
		}

		public void setTotalTuitionCN(String totalTuitionCN) {
			this.totalTuitionCN = totalTuitionCN;
		}

		public String getCost1() {
			return cost1;
		}

		public void setCost1(String cost1) {
			this.cost1 = cost1;
		}

		public String getCost2() {
			return cost2;
		}

		public void setCost2(String cost2) {
			this.cost2 = cost2;
		}

		public String getCost3() {
			return cost3;
		}

		public void setCost3(String cost3) {
			this.cost3 = cost3;
		}

		public String getAccommodation() {
			return accommodation;
		}

		public void setAccommodation(String accommodation) {
			this.accommodation = accommodation;
		}

		public String getAccommodationCN() {
			return accommodationCN;
		}

		public void setAccommodationCN(String accommodationCN) {
			this.accommodationCN = accommodationCN;
		}

		public String getMeals() {
			return meals;
		}

		public void setMeals(String meals) {
			this.meals = meals;
		}

		public String getMealsCN() {
			return mealsCN;
		}

		public void setMealsCN(String mealsCN) {
			this.mealsCN = mealsCN;
		}

		public String getPaymentDate1() {
			return paymentDate1;
		}

		public void setPaymentDate1(String paymentDate1) {
			this.paymentDate1 = paymentDate1;
		}

		public String getRate() {
			return rate;
		}

		public void setRate(String rate) {
			this.rate = rate;
		}

		public String getPaymentDate2() {
			return paymentDate2;
		}

		public void setPaymentDate2(String paymentDate2) {
			this.paymentDate2 = paymentDate2;
		}

		public String getPaymentDate3() {
			return paymentDate3;
		}

		public void setPaymentDate3(String paymentDate3) {
			this.paymentDate3 = paymentDate3;
		}

		public String getCopies1() {
			return copies1;
		}

		public void setCopies1(String copies1) {
			this.copies1 = copies1;
		}

		public String getCopies2() {
			return copies2;
		}

		public void setCopies2(String copies2) {
			this.copies2 = copies2;
		}

		public String getContract_id() {
			return contract_id;
		}

		public void setContract_id(String contract_id) {
			this.contract_id = contract_id;
		}

		public String getTuition() {
			return tuition;
		}

		public void setTuition(String tuition) {
			this.tuition = tuition;
		}

		public String getOthers() {
			return others;
		}

		public void setOthers(String others) {
			this.others = others;
		}

		public List<Timetable> getTimetable() {
			return timetable;
		}

		public void setTimetable(List<Timetable> timetable) {
			this.timetable = timetable;
		}		



	}

	public static class Timetable  {
		
		@FieldDescribe("日期")
		private String course_date;

		@FieldDescribe("时间")
		private String course_time;

		@FieldDescribe("课程")
		private String course_name;
		
		@FieldDescribe("授课教师")
		private String teacher_name;
		
		@FieldDescribe("职务")
		private String teacher_position;
		
		@FieldDescribe("授课教师简介")
		private String teacher_profile;

		public String getCourse_date() {
			return course_date;
		}

		public void setCourse_date(String course_date) {
			this.course_date = course_date;
		}

		public String getCourse_time() {
			return course_time;
		}

		public void setCourse_time(String course_time) {
			this.course_time = course_time;
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

		public String getTeacher_position() {
			return teacher_position;
		}

		public void setTeacher_position(String teacher_position) {
			this.teacher_position = teacher_position;
		}

		public String getTeacher_profile() {
			return teacher_profile;
		}

		public void setTeacher_profile(String teacher_profile) {
			this.teacher_profile = teacher_profile;
		}
	}


	private FileInfo concreteAttachment( StorageMapping mapping, FileInfo attachment, Document document, String name, EffectivePerson effectivePerson, String site) throws Exception {
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

	}

	 
}
