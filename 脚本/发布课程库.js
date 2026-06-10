var dict = new this.Dict({
    "type": "cms",
    "application": "项目管理",
    "name": "项目管理"
});
var course_serial = dict.get("course_serial") + 1;
dict.set("course_serial", course_serial);
var doc = this.documentContext.getDocument();
this.data.add("serial", "CS" + this.org.getUnit(doc.creatorUnitName).unique.slice(-3) + course_serial.toString().padStart(4, '0'), true);
this.data.add("course_id", this.data.serial, true);
doc.title = "课程库登记：" + this.data.course_name;
console.log(doc);
console.log(this.data);