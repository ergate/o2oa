package com.x.organization.assemble.authentication.jaxrs.authentication;

import com.x.base.core.project.exception.LanguagePromptException;

class ExceptionSystemStopped extends LanguagePromptException {

	private static final long serialVersionUID = 5964136244982487893L;

	static final String MESSAGE = "接南开大学终身教育管理办公室通知，本系统自2026年10月1日0时起，停止使用。如有疑问请与南开大学终身教育管理办公室联系。";

	ExceptionSystemStopped() {
		super(MESSAGE);
	}
}
