package com.x.cms.assemble.control.jaxrs.categoryinfo;

import com.x.base.core.exception.PromptException;

class GetDepartmentNameByIdentityException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	GetDepartmentNameByIdentityException( Throwable e, String identity ) {
		super("系统在根据用户身份信息查询所属部门名称时发生异常。Identity:" + identity );
	}
}
