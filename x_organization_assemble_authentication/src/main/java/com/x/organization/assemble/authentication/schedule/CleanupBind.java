package com.x.organization.assemble.authentication.schedule;

import java.util.Calendar;
import java.util.List;
import java.util.TimerTask;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.logger.Logger;
import com.x.base.core.logger.LoggerFactory;
import com.x.organization.core.entity.Bind;
import com.x.organization.core.entity.Bind_;

public class CleanupBind extends TimerTask {

	private static Logger logger = LoggerFactory.getLogger(CleanupBind.class);

	public void run() {
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			this.removeExpired(emc);
		} catch (Exception e) {
			logger.error(e);
		}
	}

	private void removeExpired(EntityManagerContainer emc) throws Exception {
		EntityManager em = emc.get(Bind.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<Bind> root = cq.from(Bind.class);
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MINUTE, -15);
		Predicate p = cb.not(cb.greaterThan(root.get(Bind_.createTime), cal.getTime()));
		cq.select(root.get(Bind_.id)).where(p);
		List<String> list = em.createQuery(cq).getResultList();
		for (String id : list) {
			Bind o = emc.find(id, Bind.class);
			if (null != o) {
				emc.beginTransaction(Bind.class);
				emc.remove(o);
				emc.commit();
			}
		}
	}

}
