this.include({
    "type": "process",
    "application": "项目管理",
    "name": "获取读者部门列表"
});
// 添加到data
this.data.add("reader", this.getReaderUnitNameList1.bind(this)(this.workContext.getWork().creatorUnit), true);
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

this.data.add("closetime", this.getFormateTime(new Date(), "yyyy-MM-dd hh:mm:ss"), true);
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
data["title"] = "结项信息：【" + this.data.project_id + "】" + this.data.project_name;
data["documentType"] = "信息";
data["docStatus"] = "published";
if (this.data.project_type == "委托办学项目") {
    data["categoryId"] = "1b8ecaf6-1ee6-4237-b052-14cf194a8645";
} else {
    data["categoryId"] = "83d9b72b-9ae7-4213-ba69-836d6bfbbf80";
}

var attList = this.workContext.getAttachmentList();
data["wf_attachmentIds"] = attList ? attList.map(function (obj) { return obj["id"]; }) : [];

var action = this.Actions.load("x_cms_assemble_control");
action.DocumentAction.persist_publishContent(data,
    function (json) {
        data = json.data;
        // item.document_id=data.id;
    }.bind(this),
    function (json) {
        data = json.data;
    }.bind(this)
);

new_data = { "status": "结项", "closetime": this.data.closetime };
// this.data.add("buildtime",this.getFormateTime(new Date(),"yyyy-MM-dd hh:mm:ss"),true);
print(JSON.stringify(new_data));
var action = this.Actions.load("x_cms_assemble_control");
action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.document_id,//uri的参数
    new_data,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));

        // [业务追投]: 触发飞书中转流水表记录
        this.data.sync_action_type = "结项";
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "项目信息中间库同步"
        });

    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this)
);


