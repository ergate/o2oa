/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.hotpic.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.hotpic.entity.HotPictureInfo.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:36:24 CST 2017")
public class HotPictureInfo_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<HotPictureInfo,String> application;
    public static volatile SingularAttribute<HotPictureInfo,Date> createTime;
    public static volatile SingularAttribute<HotPictureInfo,String> creator;
    public static volatile SingularAttribute<HotPictureInfo,String> id;
    public static volatile SingularAttribute<HotPictureInfo,String> infoId;
    public static volatile SingularAttribute<HotPictureInfo,String> picId;
    public static volatile SingularAttribute<HotPictureInfo,String> sequence;
    public static volatile SingularAttribute<HotPictureInfo,String> title;
    public static volatile SingularAttribute<HotPictureInfo,Date> updateTime;
    public static volatile SingularAttribute<HotPictureInfo,String> url;
}
