/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.okr.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.okr.entity.OkrWorkReportDetailInfo.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:09:40 CST 2017")
public class OkrWorkReportDetailInfo_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> adminSuperviseInfo;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> centerId;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,Date> createTime;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> id;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> memo;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> progressDescription;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> sequence;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> shortTitle;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> status;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> title;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,Date> updateTime;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> workId;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> workPlan;
    public static volatile SingularAttribute<OkrWorkReportDetailInfo,String> workPointAndRequirements;
}
