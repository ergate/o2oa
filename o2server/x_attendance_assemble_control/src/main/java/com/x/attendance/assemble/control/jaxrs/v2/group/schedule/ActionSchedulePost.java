package com.x.attendance.assemble.control.jaxrs.v2.group.schedule;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.x.attendance.assemble.control.Business;
import com.x.attendance.assemble.control.jaxrs.v2.ExceptionEmptyParameter;
import com.x.attendance.assemble.control.jaxrs.v2.ExceptionWithMessage;
import com.x.attendance.entity.v2.AttendanceV2GroupSchedule;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.entity.JpaObject;
import com.x.base.core.entity.annotation.CheckPersistType;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.bean.WrapCopier;
import com.x.base.core.project.bean.WrapCopierFactory;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.jaxrs.WrapBoolean;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;

public class ActionSchedulePost extends BaseAction {

  private static final Logger LOGGER = LoggerFactory.getLogger(ActionSchedulePost.class);

  ActionResult<Wo> execute(JsonElement jsonElement) throws Exception {
    ActionResult<Wo> result = new ActionResult<>();
    Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
    if (StringUtils.isEmpty(wi.getGroupId())) {
      throw new ExceptionEmptyParameter("groupId");
    }
    if (StringUtils.isEmpty(wi.getMonth())) {
      throw new ExceptionEmptyParameter("month");
    }
    if (!isValidMonthString(wi.getMonth())) {
      throw new ExceptionWithMessage("月份格式不正确！");
    }
    if (wi.getSchedule() == null || wi.getSchedule().isEmpty()) {
      throw new ExceptionEmptyParameter("schedule");
    }
    try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
      Business business = new Business(emc);
      List<AttendanceV2GroupSchedule> list = business.getAttendanceV2ManagerFactory().listGroupSchedule(wi.getGroupId(),
          wi.getMonth(), null, null);
      if (list != null && !list.isEmpty()) {
        List<String> deleteIds = new ArrayList<>();
        for (AttendanceV2GroupSchedule s : list) {
          deleteIds.add(s.getId());
        }
        emc.beginTransaction(AttendanceV2GroupSchedule.class);
        emc.delete(AttendanceV2GroupSchedule.class, deleteIds);
        emc.commit();
      }
      for (Entry<String, List<ScheduleWi>> entry : wi.getSchedule().entrySet()) {
        String dn = entry.getKey();
        List<ScheduleWi> scheduleWis = entry.getValue();
        if (scheduleWis != null && !scheduleWis.isEmpty()) {
          for (ScheduleWi sWi : scheduleWis) {
            sWi.setId(null);
            AttendanceV2GroupSchedule s = ScheduleWi.copier.copy(sWi);
            s.setUserId(dn);
            s.setGroupId(wi.getGroupId());
            s.setScheduleMonthString(wi.getMonth());
            emc.beginTransaction(AttendanceV2GroupSchedule.class);
            emc.persist(s, CheckPersistType.all);
            emc.commit();
          }
        }
      }
      Wo wo = new Wo();
      wo.setValue(true);
      result.setData(wo);
    }
    return result;
  }

  public static class Wo extends WrapBoolean {

    private static final long serialVersionUID = -1141112618965753768L;

  }

  public static class Wi extends GsonPropertyObject {

    private static final long serialVersionUID = 4366904799875578729L;

    @FieldDescribe("考勤组 id")
    private String groupId;

    @FieldDescribe("月份: yyyy-MM")
    private String month;

    @FieldDescribe("排班数据，key 是人员 DN， value 是AttendanceV2GroupSchedule 对象列表.")
    private Map<String, List<ScheduleWi>> schedule;

    public Map<String, List<ScheduleWi>> getSchedule() {
      return schedule;
    }

    public void setSchedule(Map<String, List<ScheduleWi>> schedule) {
      this.schedule = schedule;
    }

    public String getGroupId() {
      return groupId;
    }

    public void setGroupId(String groupId) {
      this.groupId = groupId;
    }

    public String getMonth() {
      return month;
    }

    public void setMonth(String month) {
      this.month = month;
    }

  }

  public static class ScheduleWi extends AttendanceV2GroupSchedule {

    private static final long serialVersionUID = 7669884231289610482L;

    static WrapCopier<ScheduleWi, AttendanceV2GroupSchedule> copier = WrapCopierFactory.wi(ScheduleWi.class,
        AttendanceV2GroupSchedule.class, null,
        JpaObject.FieldsUnmodify);

  }

}
