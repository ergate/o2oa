package com.x.bbs.assemble.control.jaxrs.roleinfo;

import com.x.base.core.exception.PromptException;

class RoleITypeInvalidException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	RoleITypeInvalidException( String type ) {
		super("角色类别不合法，无法保存角色信息.Type:" + type );
	}
}
