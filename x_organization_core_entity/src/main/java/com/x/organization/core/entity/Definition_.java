/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.organization.core.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.organization.core.entity.Definition.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:09:49 CST 2017")
public class Definition_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<Definition,Date> createTime;
    public static volatile SingularAttribute<Definition,String> data;
    public static volatile SingularAttribute<Definition,String> id;
    public static volatile SingularAttribute<Definition,String> name;
    public static volatile SingularAttribute<Definition,String> sequence;
    public static volatile SingularAttribute<Definition,Date> updateTime;
}
