package com.x.cms.assemble.control.jaxrs.script;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.cache.ApplicationCache;
import com.x.base.core.project.cache.Cache;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.cms.assemble.control.Business;
import com.x.cms.core.entity.AppInfo;
import com.x.cms.core.entity.element.Script;

import net.sf.ehcache.Element;

class ActionGetScriptNestedImported extends BaseAction {

//	private static Logger logger = LoggerFactory.getLogger(ScriptAction.class);

//	@SuppressWarnings("deprecation")
	ActionResult<Wo> execute(HttpServletRequest request, EffectivePerson effectivePerson, String uniqueName,
			String flag) throws Exception {
		ActionResult<Wo> result = new ActionResult<>();
		Wo wrap = null;
		Boolean check = true;

		if (check) {
			try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {

				Cache.CacheKey cacheKey = new Cache.CacheKey( this.getClass(), uniqueName, flag );
				Optional<?> optional = CacheManager.get(cacheCategory, cacheKey );

				if (optional.isPresent()) {
					wrap = (Wo) optional.get();
				} else {
					Business business = new Business(emc);
					AppInfo appInfo = business.getAppInfoFactory().flag(flag);
					if (null == appInfo) {
						throw new Exception("appInfo{'flag':" + flag + "} not existed.");
					}
					List<Script> list = new ArrayList<>();
					for (Script o : business.getScriptFactory()
							.listScriptNestedWithAppInfoWithUniqueName(appInfo.getId(), uniqueName)) {
						list.add(o);
					}
					StringBuffer buffer = new StringBuffer();
					List<String> imported = new ArrayList<>();
					for (Script o : list) {
						buffer.append(o.getText());
						buffer.append(System.lineSeparator());
						imported.add(o.getId());
						imported.add(o.getName());
						imported.add(o.getAlias());
					}
					wrap = new Wo();
					wrap.setImportedList(imported);
					wrap.setText(buffer.toString());
					CacheManager.put(cacheCategory, cacheKey, wrap );
				}
			} catch (Throwable th) {
				th.printStackTrace();
				result.error(th);
			}
			result.setData(wrap);
		}
		return result;
	}

	public class Wi extends GsonPropertyObject {

		@FieldDescribe("导入的脚本ID.")
		private List<String> importedList;

		public List<String> getImportedList() {
			return importedList;
		}

		public void setImportedList(List<String> importedList) {
			this.importedList = importedList;
		}

	}

	public static class Wo extends GsonPropertyObject {

		private String text;

		private List<String> importedList;

		public List<String> getImportedList() {
			return importedList;
		}

		public void setImportedList(List<String> importedList) {
			this.importedList = importedList;
		}

		public String getText() {
			return text;
		}

		public void setText(String text) {
			this.text = text;
		}
	}
}
