/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.attendance.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Double;
import java.lang.Long;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.attendance.entity.StatisticPersonForMonth.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:07:18 CST 2017")
public class StatisticPersonForMonth_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<StatisticPersonForMonth,Long> abNormalDutyCount;
    public static volatile SingularAttribute<StatisticPersonForMonth,Double> absenceDayCount;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> companyName;
    public static volatile SingularAttribute<StatisticPersonForMonth,Date> createTime;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> employeeName;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> id;
    public static volatile SingularAttribute<StatisticPersonForMonth,Long> lackOfTimeCount;
    public static volatile SingularAttribute<StatisticPersonForMonth,Long> lateTimes;
    public static volatile SingularAttribute<StatisticPersonForMonth,Long> leaveEarlyTimes;
    public static volatile SingularAttribute<StatisticPersonForMonth,Long> offDutyTimes;
    public static volatile SingularAttribute<StatisticPersonForMonth,Double> onDutyDayCount;
    public static volatile SingularAttribute<StatisticPersonForMonth,Long> onDutyTimes;
    public static volatile SingularAttribute<StatisticPersonForMonth,Double> onSelfHolidayCount;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> organizationName;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> sequence;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> statisticMonth;
    public static volatile SingularAttribute<StatisticPersonForMonth,String> statisticYear;
    public static volatile SingularAttribute<StatisticPersonForMonth,Date> updateTime;
    public static volatile SingularAttribute<StatisticPersonForMonth,Double> workDayCount;
}
