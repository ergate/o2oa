package com.x.cms.assemble.control.jaxrs.fileinfo;

import com.x.base.core.project.exception.PromptException;

class ExceptionCertificateMake extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public ExceptionCertificateMake( Throwable e, String message ) {
		super("生成证书文件失败！message:" + message, e );
	}
}
