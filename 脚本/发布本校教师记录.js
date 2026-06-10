var dict = new this.Dict({
    "type": "cms",
    "application": "项目管理",
    "name": "项目管理"
});
var teacher_serial = dict.get("teacher_serial_i") + 1;
dict.set("teacher_serial_i", teacher_serial);
var doc = this.documentContext.getDocument();
this.data.add("serial", "TI" + this.org.getUnit(doc.creatorUnitName).unique.slice(-3) + teacher_serial.toString().padStart(4, '0'), true);
doc.title = "本校师资记录：" + this.data.teacher_name;
this.data.add("teacher_type", "本校", true);
this.data.add("flg", "", true);

console.log(doc);
console.log(this.data);