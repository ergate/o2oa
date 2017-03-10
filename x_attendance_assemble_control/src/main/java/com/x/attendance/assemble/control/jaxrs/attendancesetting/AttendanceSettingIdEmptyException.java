package com.x.attendance.assemble.control.jaxrs.attendancesetting;

import com.x.base.core.exception.PromptException;

class AttendanceSettingIdEmptyException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	AttendanceSettingIdEmptyException() {
		super("查询操作传入的参数Id为空，无法进行查询操作.");
	}
}
