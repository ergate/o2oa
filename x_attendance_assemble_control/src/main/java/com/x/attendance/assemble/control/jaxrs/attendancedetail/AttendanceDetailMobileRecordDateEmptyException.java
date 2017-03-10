package com.x.attendance.assemble.control.jaxrs.attendancedetail;

import com.x.base.core.exception.PromptException;

class AttendanceDetailMobileRecordDateEmptyException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	AttendanceDetailMobileRecordDateEmptyException() {
		super("员工手机打卡信息中打卡日期不能为空，格式: yyyy-mm-dd." );
	}
}
