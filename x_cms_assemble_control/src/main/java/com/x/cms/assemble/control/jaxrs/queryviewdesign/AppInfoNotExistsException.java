package com.x.cms.assemble.control.jaxrs.queryviewdesign;

import com.x.base.core.exception.PromptException;

class AppInfoNotExistsException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	AppInfoNotExistsException( String id ) {
		super("应用栏目信息不存在，无法继续进行操作。Id:" + id );
	}
}
