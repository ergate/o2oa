var dict = new this.Dict({
    "type": "cms",
    "application": "项目管理",
    "name": "项目管理"
});
var teacher_serial = dict.get("teacher_serial_s") + 1;
dict.set("teacher_serial_s", teacher_serial);
var doc = this.documentContext.getDocument();
this.data.add("serial", "TS" + this.org.getUnit(doc.creatorUnitName).unique.slice(-3) + teacher_serial.toString().padStart(4, '0'), true);
doc.title = "委托方自聘师资记录：" + this.data.teacher_name;
this.data.add("teacher_type", "自聘", true);
this.data.add("flg", "", true);
console.log(doc);
console.log(this.data);