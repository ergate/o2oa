package com.x.cms.assemble.control.jaxrs.fileinfo;

import com.x.base.core.project.exception.LanguagePromptException;

class ExceptionTemplateInfoNotExists extends LanguagePromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	ExceptionTemplateInfoNotExists( String id ) {
		super("指定的模板文件不存在:{}.", id );
	}
}
