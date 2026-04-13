package com.x.cms.assemble.control.jaxrs.fileinfo;

import com.x.base.core.project.exception.PromptException;

class ExceptionCertificateSave extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public ExceptionCertificateSave( Throwable e, String message ) {
		super("保存证书文件时发生异常！message:" + message, e );
	}
}
