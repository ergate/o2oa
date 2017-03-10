/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.processplatform.core.entity.element;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Boolean;
import java.lang.Integer;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.processplatform.core.entity.element.Process.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Fri Mar 10 10:10:19 CST 2017")
public class Process_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<Process,String> afterBeginScript;
    public static volatile SingularAttribute<Process,String> afterBeginScriptText;
    public static volatile SingularAttribute<Process,String> afterEndScript;
    public static volatile SingularAttribute<Process,String> afterEndScriptText;
    public static volatile SingularAttribute<Process,String> alias;
    public static volatile SingularAttribute<Process,String> application;
    public static volatile SingularAttribute<Process,String> beforeBeginScript;
    public static volatile SingularAttribute<Process,String> beforeBeginScriptText;
    public static volatile SingularAttribute<Process,String> beforeEndScript;
    public static volatile SingularAttribute<Process,String> beforeEndScriptText;
    public static volatile ListAttribute<Process,String> controllerList;
    public static volatile SingularAttribute<Process,Date> createTime;
    public static volatile SingularAttribute<Process,String> creatorPerson;
    public static volatile SingularAttribute<Process,String> description;
    public static volatile SingularAttribute<Process,Integer> expireDay;
    public static volatile SingularAttribute<Process,Integer> expireHour;
    public static volatile SingularAttribute<Process,String> expireScript;
    public static volatile SingularAttribute<Process,String> expireScriptText;
    public static volatile SingularAttribute<Process,ExpireType> expireType;
    public static volatile SingularAttribute<Process,Boolean> expireWorkTime;
    public static volatile SingularAttribute<Process,String> icon;
    public static volatile SingularAttribute<Process,String> id;
    public static volatile SingularAttribute<Process,String> lastUpdatePerson;
    public static volatile SingularAttribute<Process,Date> lastUpdateTime;
    public static volatile SingularAttribute<Process,String> name;
    public static volatile ListAttribute<Process,String> reviewIdentityList;
    public static volatile SingularAttribute<Process,String> sequence;
    public static volatile SingularAttribute<Process,String> serialActivity;
    public static volatile SingularAttribute<Process,String> serialTexture;
    public static volatile ListAttribute<Process,String> startableCompanyList;
    public static volatile ListAttribute<Process,String> startableDepartmentList;
    public static volatile ListAttribute<Process,String> startableIdentityList;
    public static volatile SingularAttribute<Process,Date> updateTime;
}
