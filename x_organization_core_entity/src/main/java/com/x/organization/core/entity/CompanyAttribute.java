package com.x.organization.core.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OrderColumn;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.apache.commons.lang3.StringUtils;
import org.apache.openjpa.persistence.PersistentCollection;
import org.apache.openjpa.persistence.jdbc.ContainerTable;
import org.apache.openjpa.persistence.jdbc.ElementColumn;
import org.apache.openjpa.persistence.jdbc.ElementIndex;
import org.apache.openjpa.persistence.jdbc.Index;

import com.github.stuxuhai.jpinyin.PinyinFormat;
import com.github.stuxuhai.jpinyin.PinyinHelper;
import com.x.base.core.entity.AbstractPersistenceProperties;
import com.x.base.core.entity.JpaObject;
import com.x.base.core.entity.SliceJpaObject;
import com.x.base.core.entity.annotation.CheckPersist;
import com.x.base.core.entity.annotation.CitationExist;
import com.x.base.core.entity.annotation.CitationNotExist;
import com.x.base.core.entity.annotation.ContainerEntity;
import com.x.base.core.entity.annotation.EntityFieldDescribe;
import com.x.base.core.entity.annotation.Equal;
import com.x.base.core.utils.DateTools;

@Entity
@ContainerEntity
@Table(name = PersistenceProperties.CompanyAttribute.table)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class CompanyAttribute extends SliceJpaObject {

	private static final long serialVersionUID = -3113088269517791061L;
	private static final String TABLE = PersistenceProperties.CompanyAttribute.table;

	@PrePersist
	public void prePersist() throws Exception { 
		Date date = new Date();
		if (null == this.createTime) {
			this.createTime = date;
		}
		this.updateTime = date;
		if (null == this.sequence) {
			this.sequence = StringUtils.join(DateTools.compact(this.getCreateTime()), this.getId());
		}
		this.onPersist();
	}

	@PreUpdate
	public void preUpdate() throws Exception {
		this.updateTime = new Date();
		this.onPersist();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public String getSequence() {
		return sequence;
	}

	public void setSequence(String sequence) {
		this.sequence = sequence;
	}

	@EntityFieldDescribe("创建时间,自动生成.")
	@Index(name = TABLE + "_createTime")
	@Column(name = "xcreateTime")
	private Date createTime;

	@EntityFieldDescribe("修改时间,自动生成.")
	@Index(name = TABLE + "_updateTime")
	@Column(name = "xupdateTime")
	private Date updateTime;

	@EntityFieldDescribe("列表序号,由创建时间以及ID组成.在保存时自动生成.")
	@Column(length = AbstractPersistenceProperties.length_sequence, name = "xsequence")
	@Index(name = TABLE + "_sequence")
	private String sequence;

	@EntityFieldDescribe("数据库主键,自动生成.")
	@Id
	@Column(length = JpaObject.length_id, name = JpaObject.IDCOLUMN)
	@Index(name = TABLE + "_id")
	private String id = createId();

	/* 以上为 JpaObject 默认字段 */

	private void onPersist() throws Exception {
		this.pinyin = PinyinHelper.convertToPinyinString(name, "", PinyinFormat.WITHOUT_TONE);
		this.pinyinInitial = PinyinHelper.getShortPinyin(name);
	}

	/* 更新运行方法 */

	@EntityFieldDescribe("name拼音.")
	@Index(name = TABLE + "_pinyin")
	@Column(length = AbstractPersistenceProperties.organization_name_length, name = "xpinyin")
	private String pinyin;

	@EntityFieldDescribe("name拼音首字母.")
	@Column(length = AbstractPersistenceProperties.organization_name_length, name = "xpinyinInitial")
	@Index(name = TABLE + "_pinyinInitial")
	private String pinyinInitial;

	@EntityFieldDescribe("名称,不可重名.")
	@Column(length = AbstractPersistenceProperties.organization_name_length, name = "xname")
	@Index(name = TABLE + "_name")
	@CheckPersist(allowEmpty = false, citationNotExists =
	/* 同一个公司不可以重名 */
	@CitationNotExist(fields = { "name", "unique" }, type = CompanyAttribute.class, equals = {
			@Equal(property = "company", field = "company") }))
	private String name;

	@EntityFieldDescribe("唯一标识.")
	@Column(length = PersistenceProperties.length_unique, name = "xunique")
	@Index(name = TABLE + "_unique")
	@CheckPersist(allowEmpty = true, citationNotExists =
	/* 同一个公司不可以重名 */
	@CitationNotExist(fields = { "id", "name", "unique" }, type = CompanyAttribute.class, equals = {
			@Equal(property = "company", field = "company") }))
	private String unique;

	@EntityFieldDescribe("此公司属性值所属的公司ID.不可为空.")
	@Column(length = JpaObject.length_id, name = "xcompany")
	@Index(name = TABLE + "_company")
	@CheckPersist(allowEmpty = false, citationExists = { @CitationExist(type = Company.class) })
	private String company;

	@EntityFieldDescribe("属性值,多值.")
	@ContainerTable(name = TABLE + "_attribbuteList", joinIndex = @Index(name = TABLE + "_attribbuteList_join"))
	@ElementIndex(name = TABLE + "_attribbuteList_element")
	@PersistentCollection(fetch = FetchType.EAGER)
	@OrderColumn(name = PersistenceProperties.orderColumn)
	@ElementColumn(length = JpaObject.length_255B, name = "xattributeList")
	@CheckPersist(allowEmpty = true, simplyString = true)
	private List<String> attributeList;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getPinyinInitial() {
		return pinyinInitial;
	}

	public List<String> getAttributeList() {
		return attributeList;
	}

	public void setAttributeList(List<String> attributeList) {
		this.attributeList = attributeList;
	}

	public String getUnique() {
		return unique;
	}

	public void setUnique(String unique) {
		this.unique = unique;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public void setPinyinInitial(String pinyinInitial) {
		this.pinyinInitial = pinyinInitial;
	}

}