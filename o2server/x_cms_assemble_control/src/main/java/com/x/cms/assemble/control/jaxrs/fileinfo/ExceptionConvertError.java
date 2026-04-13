package com.x.cms.assemble.control.jaxrs.fileinfo;
import com.x.base.core.project.exception.PromptException;

class ExceptionConvertError extends PromptException {

	private static final long serialVersionUID = 7237855733312562652L;

	ExceptionConvertError() {
		super("转换失败.");
	}
}
