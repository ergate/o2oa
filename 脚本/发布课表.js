this.data.add("subject", "课表登记：" + this.data.project_name, true);
var dict = new this.Dict({
    "type": "cms",
    "application": "项目管理",
    "name": "项目管理"
});
var timetable_serial = dict.get("timetable_serial") + 1;
dict.set("timetable_serial", timetable_serial);
this.data.add("serial", "T" + this.org.getUnit(this.documentContext.getDocument().creatorUnitName).unique.slice(-3) + timetable_serial.toString().padStart(4, '0'), true);
this.data.add("timetable_id", this.data.serial, true);
this.title = "课表登记：" + this.data.project_name;

// 将当前课表中每行的课程和教师补充信息回写到对应课程库文档。
var updateCourseLibraryRows = function () {
    var rows = this.data && this.data.datatable && this.data.datatable.data ? this.data.datatable.data : [];
    var action = this.Actions.load("x_cms_assemble_control");
    for (var i = 0; i < rows.length; i++) {
        if (!rows[i].doc_id) {
            console.log("课程库文档ID为空，跳过第" + (i + 1) + "行：" + (rows[i].course_name || ""));
            continue;
        }
        var data = {
            "course_name": rows[i].course_name || "",
            "course_type": rows[i].course_type || "",
            "course_hours": rows[i].course_hours || 0,
            "teacher_title": rows[i].teacher_title || "",
            "teacher_unit": rows[i].teacher_unit || ""
        };
        action.DataAction.updateWithDocument(
            rows[i].doc_id,
            data,
            function (json) {
                console.log(JSON.stringify(json));
            }.bind(this),
            function (json) {
                console.log(JSON.stringify(json));
            }.bind(this)
        );
    }
}.bind(this);

updateCourseLibraryRows();

this.view.lookup({
    "application": "项目管理",  //数据中心中的应用
    "view": '项目信息_精简版',     //视图的名称
    "filter": [ //（Array of Object）可选，对视图进行过滤的条件。json数组格式，每个数组元素描述一个过滤条件。
        {
            "logic": "and",
            "path": "project_id",
            "comparison": "equals",
            "value": this.data.project_id,
            "formatType": "textValue"
        }
    ]
}, function (items) {
    //如果选择了某个数据，将数据赋值给表单输入框
    if (items.grid.length) {
        data = { "timetable_id": this.data.timetable_id };
        var action = this.Actions.load("x_cms_assemble_control");
        action.DataAction.updateWithDocument(//平台封装好的方法
            items.grid[0].data.document_id,//uri的参数
            data,//body请求参数
            function (json) { //服务调用成功的回调函数, json为服务传回的数据
                console.log(JSON.stringify(json));
            }.bind(this),
            function (json) { //服务调用失败的回调函数, json为服务传回的数据
                console.log(JSON.stringify(json));
            }.bind(this)
        );
    }
}.bind(this));
