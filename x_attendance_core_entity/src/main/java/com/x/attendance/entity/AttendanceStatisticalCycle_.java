/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.attendance.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.attendance.entity.AttendanceStatisticalCycle.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:07:18 CST 2017")
public class AttendanceStatisticalCycle_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> companyName;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,Date> createTime;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,Date> cycleEndDate;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> cycleEndDateString;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> cycleMonth;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,Date> cycleStartDate;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> cycleStartDateString;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> cycleYear;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> departmentName;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> description;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> id;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,String> sequence;
    public static volatile SingularAttribute<AttendanceStatisticalCycle,Date> updateTime;
}
