// 添加到data
print("B");
this.include({
    "type": "process",
    "application": "项目管理",
    "name": "获取读者部门列表"
});
print("E");
this.data.add("reader", this.getReaderUnitNameList1.bind(this)(this.workContext.getWork().creatorUnit), true);
this.data.add("project_id", this.workContext.getWork().serial, true);
this.data.add("timetable_id", "", true);
if (!this.data.contract_id) {
    this.data.add("contract_id", "", true);
}
this.define("getFormateTime", function (date, format) {
    var paddNum = function (num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
    }
    //指定格式字符
    var cfg = {
        yyyy: date.getFullYear() //年 : 4位
        , yy: date.getFullYear().toString().substring(2)//年 : 2位
        , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
        , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        , d: date.getDate()
        , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
        , hh: paddNum(date.getHours())//时:如果1位的时候补0
        , mm: paddNum(date.getMinutes())//分:如果1位的时候补0
        , ss: paddNum(date.getSeconds())//秒:如果1位的时候补0
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function (m) { return cfg[m]; });
});
this.data.add("buildtime", this.getFormateTime(new Date(), "yyyy-MM-dd hh:mm:ss"), true);
this.data.add("closetime", "", true);
this.data.add("stoptime", "", true);
// this.data.save();
var authorList = [];
var readerList = [];

readerList = this.getReaderUnitNameList2.bind(this)(this.workContext.getWork().creatorUnit);

authorList.push({
    permission: "作者",
    permissionObjectCode: this.workContext.getWork().creatorIdentityDn,
    permissionObjectName: this.workContext.getWork().creatorIdentityDn.split("@")[0],
    permissionObjectType: "人员"
})


var data = {};
data["identity"] = this.workContext.getWork().creatorIdentityDn;
data["docData"] = this.data;
data["readerList"] = readerList;
data["authorList"] = authorList;
data["title"] = "项目信息：【" + this.data.project_id + "】" + this.data.project_name;
data["documentType"] = "信息";
data["docStatus"] = "published";
if (this.data.project_type == "公开招生项目") {
    data["categoryId"] = "b615d062-410d-4239-8c04-49306f18e190";
    var attList1 = this.workContext.getAttachmentList();
    data["wf_attachmentIds"] = attList1 ? attList1.map(function (obj) { return obj["id"]; }) : [];
} else {
    data["categoryId"] = "e889a20b-d230-4ccd-b517-49caed68145b";
}

var action = this.Actions.load("x_cms_assemble_control");
action.DocumentAction.persist_publishContent(data,
    function (json) {
        data = json.data;
        print("发布立项信息成功");
        // item.document_id=data.id;
        // 转存附件
        var attList2 = this.workContext.getAttachmentList(false);
        if (attList2) {
            attList2.map(function (item, index, arr) {
                var adddata = {
                    "docId": data.id,
                    "fileName": item.name,
                    "fileUrl": 'https://fxl.nankai.edu.cn/x_processplatform_assemble_surface/jaxrs/attachment/download/' + item.id,
                    "site": "buchongshuoming"
                }
                var action = this.Actions.load("x_cms_assemble_control");
                action.FileInfoAction.uploadWithUrl(//平台封装好的方法
                    adddata,//body请求参数
                    function (json) { //服务调用成功的回调函数, json为服务传回的数据
                        print(JSON.stringify(json));
                    }.bind(this),
                    function (json) { //服务调用失败的回调函数, json为服务传回的数据
                        print(JSON.stringify(json));
                    }.bind(this)
                );
            }.bind(this));
        }

        // [业务追投]: 触发飞书中转流水表记录
        this.data.document_id = data.id;
        this.data.sync_action_type = "立项";
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "项目信息中间库同步"
        });

        // [业务追投]: 触发课表信息流水分发
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "课表信息中间库同步"
        });

    }.bind(this),
    function (json) {
        print("发布立项信息失败");
        data = json.data;
    }.bind(this)
);

var action = this.Actions.load("x_cms_assemble_control");
if (this.data.datatable && this.data.datatable.data) {
    for (var i = 0; i < this.data.datatable.data.length; i++) {
        if (this.data.datatable.data[i].newteacher == "是") {
            action.DataAction.updateWithDocument(//平台封装好的方法
                this.data.datatable.data[i].document_id,//uri的参数
                { "newteacher": "" },//body请求参数
                function (json) { //服务调用成功的回调函数, json为服务传回的数据
                    print(JSON.stringify(json));
                }.bind(this),
                function (json) { //服务调用失败的回调函数, json为服务传回的数据
                    print(JSON.stringify(json));
                }.bind(this)
            );
        }
    }
}


