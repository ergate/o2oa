var no = 0;
var newdata = {
    "status": "已申请",
    "actualHours": this.data.actualHours,
    "actualNumber": this.data.actualNumber,
    "datatable": { "data": this.data.datatable.data }
};
for (i = 0; i < this.data.datatable.data.length; i++) {
    if (newdata.datatable.data[i].isOK == "是") {
        no = no + 1;
        var noString = String(no);
        var padding = '0'.repeat(Math.max(0, 4 - noString.length));
        newdata.datatable.data[i].certificate_id = this.data.project_id + padding + noString;;
    } else {
        newdata.datatable.data[i].certificate_id = ""
    }
}
print(JSON.stringify(newdata));
print("!!!" + this.data.project_id);

var action = this.Actions.load("x_cms_assemble_control");
action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.document_id,//uri的参数
    newdata,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));

        // [业务追投]: 触发学员与证书信息同步
        this.data.sync_action_type = "发证申请";
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "学员信息中间库同步"
        });
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this)
);