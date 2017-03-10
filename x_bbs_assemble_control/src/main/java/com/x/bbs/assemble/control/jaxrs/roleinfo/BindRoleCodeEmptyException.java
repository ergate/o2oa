package com.x.bbs.assemble.control.jaxrs.roleinfo;

import com.x.base.core.exception.PromptException;

class BindRoleCodeEmptyException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	BindRoleCodeEmptyException() {
		super("绑定的角色编码为空， 无法进行查询." );
	}
}
