package com.x.cms.assemble.control.jaxrs.fileinfo;

import com.x.base.core.project.exception.PromptException;

class ExceptionTemplateSave extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public ExceptionTemplateSave( Throwable e, String message ) {
		super("保存模板文件时发生异常！message:" + message, e );
	}
}
