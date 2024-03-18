package com.x.cms.assemble.control.jaxrs.fileinfo;

import com.x.base.core.project.exception.PromptException;

class ExceptionCertificateRead extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public ExceptionCertificateRead( Throwable e, String message ) {
		super("读取生成的证书文件时发生异常！message:" + message, e );
	}
}
