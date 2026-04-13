package com.x.cms.assemble.control.jaxrs.fileinfo;

import com.x.base.core.project.exception.PromptException;

class ExceptionContractRead extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public ExceptionContractRead( Throwable e, String message ) {
		super("读取生成的合同文件时发生异常！message:" + message, e );
	}
}
