package com.x.okr.assemble.control.jaxrs.mind;

import com.x.okr.assemble.control.service.OkrCenterWorkQueryService;
import com.x.okr.assemble.control.service.OkrUserInfoService;
import com.x.okr.assemble.control.service.OkrWorkBaseInfoQueryService;
import com.x.okr.assemble.control.service.OkrWorkPersonService;

public class ExcuteBase {
	
	protected OkrCenterWorkQueryService okrCenterWorkInfoService = new OkrCenterWorkQueryService();
	protected OkrWorkBaseInfoQueryService okrWorkBaseInfoService = new OkrWorkBaseInfoQueryService();
	protected OkrWorkPersonService okrWorkPersonService = new OkrWorkPersonService();
	protected OkrUserInfoService okrUserInfoService = new OkrUserInfoService();

	
	
}
