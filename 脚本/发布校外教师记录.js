var dict = new this.Dict({
    "type": "cms",
    "application": "项目管理",
    "name": "项目管理"
});
var teacher_serial = dict.get("teacher_serial_e") + 1;
dict.set("teacher_serial_e", teacher_serial);
var doc = this.documentContext.getDocument();
this.data.add("serial", "TE" + this.org.getUnit(doc.creatorUnitName).unique.slice(-3) + teacher_serial.toString().padStart(4, '0'), true);
doc.title = "校外师资记录：" + this.data.teacher_name;
this.data.add("teacher_type", "校外", true);
this.data.add("flg", "", true);
this.data.add("newteacher", "是", true);
console.log(doc);
console.log(this.data);