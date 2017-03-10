package com.x.organization.assemble.personal.jaxrs.reset;

import com.x.base.core.exception.PromptException;

public class DisableCollectException extends PromptException {

	private static final long serialVersionUID = 6351023802034208595L;

	public DisableCollectException() {
		super("系统没有启用节点连接.");
	}
}
