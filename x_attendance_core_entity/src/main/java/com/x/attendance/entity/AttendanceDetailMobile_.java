/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.attendance.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Integer;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.attendance.entity.AttendanceDetailMobile.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:07:18 CST 2017")
public class AttendanceDetailMobile_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<AttendanceDetailMobile,Date> createTime;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> description;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> empName;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> empNo;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> id;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> latitude;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> longitude;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> optMachineType;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> optSystemName;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> recordAddress;
    public static volatile SingularAttribute<AttendanceDetailMobile,Date> recordDate;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> recordDateString;
    public static volatile SingularAttribute<AttendanceDetailMobile,Integer> recordStatus;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> sequence;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> signDescription;
    public static volatile SingularAttribute<AttendanceDetailMobile,String> signTime;
    public static volatile SingularAttribute<AttendanceDetailMobile,Date> updateTime;
}
