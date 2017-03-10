package com.x.processplatform.assemble.surface.jaxrs.applicationdict;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import com.google.gson.JsonElement;
import com.x.base.core.bean.BeanCopyTools;
import com.x.base.core.bean.BeanCopyToolsBuilder;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.entity.item.ItemConverter;
import com.x.base.core.entity.item.ItemType;
import com.x.processplatform.assemble.surface.Business;
import com.x.processplatform.assemble.surface.wrapout.element.WrapOutApplicationDict;
import com.x.processplatform.core.entity.element.ApplicationDict;
import com.x.processplatform.core.entity.element.ApplicationDictItem;
import com.x.processplatform.core.entity.element.ApplicationDictLobItem;

abstract class ActionBase {

	static BeanCopyTools<ApplicationDict, WrapOutApplicationDict> copier = BeanCopyToolsBuilder
			.create(ApplicationDict.class, WrapOutApplicationDict.class, null, WrapOutApplicationDict.Excludes);

	JsonElement get(Business business, ApplicationDict applicationDict, String... paths) throws Exception {
		List<ApplicationDictItem> list = business.applicationDictItem()
				.listWithApplicationDictWithPath(applicationDict.getId(), paths);
		for (ApplicationDictItem o : list) {
			if (o.isLobItem()) {
				/** 装载lob字段内容 */
				ApplicationDictLobItem lob = business.entityManagerContainer().find(o.getLobItem(),
						ApplicationDictLobItem.class);
				if (null != lob) {
					o.setStringLobValue(lob.getData());
				}
			}
		}
		ItemConverter<ApplicationDictItem> converter = new ItemConverter<>(ApplicationDictItem.class);
		JsonElement jsonElement = converter.assemble(list, paths.length);
		return jsonElement;
	}

	void update(Business business, ApplicationDict applicationDict, JsonElement jsonElement, String... paths)
			throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		ItemConverter<ApplicationDictItem> converter = new ItemConverter<>(ApplicationDictItem.class);
		List<ApplicationDictItem> exists = business.applicationDictItem()
				.listWithApplicationDictWithPath(applicationDict.getId(), paths);
		if (exists.isEmpty()) {
			throw new Exception("applicationDict{id:" + applicationDict + "} on path:" + StringUtils.join(paths, ".")
					+ " is not existed.");
		}
		emc.beginTransaction(ApplicationDictItem.class);
		emc.beginTransaction(ApplicationDictLobItem.class);
		List<ApplicationDictItem> currents = converter.disassemble(jsonElement, paths);
		List<ApplicationDictItem> removes = converter.subtract(exists, currents);
		List<ApplicationDictItem> adds = converter.subtract(currents, exists);
		for (ApplicationDictItem o : removes) {
			if (o.isLobItem()) {
				ApplicationDictLobItem lob = emc.find(o.getLobItem(), ApplicationDictLobItem.class);
				if (null != lob) {
					emc.remove(lob);
				}
			}
			emc.remove(o);
		}
		for (ApplicationDictItem o : adds) {
			o.setApplicationDict(applicationDict.getId());
			o.setDistributeFactor(applicationDict.getDistributeFactor());
			o.setApplication(applicationDict.getApplication());
			if (o.isLobItem()) {
				ApplicationDictLobItem lob = this.concreteApplicationDictLobItem(o);
				emc.persist(lob);
			}
			emc.persist(o);
		}
	}

	void create(Business business, ApplicationDict applicationDict, JsonElement jsonElement, String... paths)
			throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		String[] parentPaths = new String[] { "", "", "", "", "", "", "", "" };
		String[] cursorPaths = new String[] { "", "", "", "", "", "", "", "" };
		for (int i = 0; i < paths.length - 1; i++) {
			parentPaths[i] = paths[i];
			cursorPaths[i] = paths[i];
		}
		cursorPaths[paths.length - 1] = paths[paths.length - 1];
		ApplicationDictItem parent = business.applicationDictItem().getWithApplicationDictWithPath(
				applicationDict.getId(), parentPaths[0], parentPaths[1], parentPaths[2], parentPaths[3], parentPaths[4],
				parentPaths[5], parentPaths[6], parentPaths[7]);
		if (null == parent) {
			throw new Exception("parent not existed.");
		}
		ApplicationDictItem cursor = business.applicationDictItem().getWithApplicationDictWithPath(
				applicationDict.getId(), cursorPaths[0], cursorPaths[1], cursorPaths[2], cursorPaths[3], cursorPaths[4],
				cursorPaths[5], cursorPaths[6], cursorPaths[7]);
		ItemConverter<ApplicationDictItem> converter = new ItemConverter<>(ApplicationDictItem.class);
		emc.beginTransaction(ApplicationDictItem.class);
		if ((null != cursor) && cursor.getItemType().equals(ItemType.a)) {
			/* 向数组里面添加一个成员对象 */
			Integer index = business.applicationDictItem()
					.getArrayLastIndexWithApplicationDictWithPath(applicationDict.getId(), paths);
			/* 新的路径开始 */
			String[] ps = new String[paths.length + 1];
			for (int i = 0; i < paths.length; i++) {
				ps[i] = paths[i];
			}
			ps[paths.length] = Integer.toString(index + 1);
			List<ApplicationDictItem> adds = converter.disassemble(jsonElement, ps);
			for (ApplicationDictItem o : adds) {
				o.setApplicationDict(applicationDict.getId());
				o.setDistributeFactor(applicationDict.getDistributeFactor());
				o.setApplication(applicationDict.getApplication());
				if (o.isLobItem()) {
					ApplicationDictLobItem lob = this.concreteApplicationDictLobItem(o);
					emc.persist(lob);
				}
				emc.persist(o);
			}
		} else if ((cursor == null) && parent.getItemType().equals(ItemType.o)) {
			/* 向parent对象添加一个属性值 */
			List<ApplicationDictItem> adds = converter.disassemble(jsonElement, paths);
			for (ApplicationDictItem o : adds) {
				o.setApplicationDict(applicationDict.getId());
				o.setDistributeFactor(applicationDict.getDistributeFactor());
				o.setApplication(applicationDict.getApplication());
				if (o.isLobItem()) {
					ApplicationDictLobItem lob = new ApplicationDictLobItem();
					lob.setData(o.getStringLobValue());
					lob.setDistributeFactor(o.getDistributeFactor());
					o.setLobItem(lob.getId());
					emc.persist(lob);
				}
				emc.persist(o);
			}
		} else {
			throw new Exception("unexpected post with applicationDict{id:" + applicationDict + "} path:"
					+ StringUtils.join(paths, ".") + "json:" + jsonElement);
		}
	}

	void delete(Business business, ApplicationDict applicationDict, String... paths) throws Exception {
		EntityManagerContainer emc = business.entityManagerContainer();
		List<ApplicationDictItem> exists = business.applicationDictItem()
				.listWithApplicationDictWithPath(applicationDict.getId(), paths);
		if (exists.isEmpty()) {
			throw new Exception("applicationDict{id:" + applicationDict + "} on path:" + StringUtils.join(paths, ".")
					+ " is not existed.");
		}
		emc.beginTransaction(ApplicationDictItem.class);
		for (ApplicationDictItem o : exists) {
			if (o.isLobItem()) {
				ApplicationDictLobItem lob = emc.find(o.getLobItem(), ApplicationDictLobItem.class);
				if (null != lob) {
					emc.remove(lob);
				}
			}
			emc.remove(o);
		}
		if (NumberUtils.isNumber(paths[paths.length - 1])) {
			int position = paths.length - 1;
			for (ApplicationDictItem o : business.applicationDictItem()
					.listWithApplicationDictWithPathWithAfterLocation(applicationDict.getId(),
							NumberUtils.toInt(paths[position]), paths)) {
				o.path(Integer.toString(o.pathLocation(position) - 1), position);
			}
		}
	}

	private ApplicationDictLobItem concreteApplicationDictLobItem(ApplicationDictItem o) {
		/** 创建关联的ApplicationDictLobItem */
		ApplicationDictLobItem lob = new ApplicationDictLobItem();
		lob.setData(o.getStringLobValue());
		lob.setDistributeFactor(o.getDistributeFactor());
		o.setLobItem(lob.getId());
		return lob;
	}
}
