package com.x.teamwork.assemble.control.jaxrs.global;

import com.x.base.core.project.cache.ApplicationCache;
import com.x.base.core.project.jaxrs.StandardJaxrsAction;
import com.x.teamwork.assemble.control.service.DynamicPersistService;
import com.x.teamwork.assemble.control.service.PriorityPersistService;
import com.x.teamwork.assemble.control.service.PriorityQueryService;
import com.x.teamwork.assemble.control.service.SystemConfigQueryService;
import com.x.teamwork.core.entity.Priority;

import net.sf.ehcache.Ehcache;

public class BaseAction extends StandardJaxrsAction {

	protected Ehcache priorityCache = ApplicationCache.instance().getCache( Priority.class );
	
	protected 	PriorityQueryService priorityQueryService = new PriorityQueryService();
	
	protected 	PriorityPersistService priorityPersistService = new PriorityPersistService();
	
	protected 	DynamicPersistService dynamicPersistService = new DynamicPersistService();
	
	protected 	SystemConfigQueryService systemConfigQueryService = new SystemConfigQueryService();
	
}
