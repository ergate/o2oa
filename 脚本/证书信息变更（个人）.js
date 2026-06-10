var certificatedata = {
    "id": "",
    "site": "",
    "project_name": this.data.project_name,
    "project_id": this.data.project_id,
    "signing_time": this.data.signing_time,
    "checkinfo": this.data.checkinfo,
    "studentDocumentID": this.data.document_id,
    "openingTime": this.data.openingTime.substring(0, 4) + "年" + this.data.openingTime.substring(5, 7) + "月" + this.data.openingTime.substring(8) + "日",
    "endingTime": this.data.endingTime.substring(0, 4) + "年" + this.data.endingTime.substring(5, 7) + "月" + this.data.endingTime.substring(8) + "日",
    "creatorUnitName": this.workContext.getWork().creatorUnit,
    "actualHours": this.data.actualHours,
    "certificateArgList": [
    ]
};
var action = this.Actions.load("x_cms_assemble_control");
action.DataAction.updateWithDocumentWithPath0(//平台封装好的方法
    this.data.document_id, "actualHours",//uri的参数
    this.data.actualHours,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this));
var items = this.data.datatable.data;
for (i = 0; i < items.length; i++) {
    certificatedata.certificateArgList.push({
        "site": "datatable..data.." + items[i].row_no + "..certificate",
        "student_name": items[i].student_name,
        "gender": items[i].gender,
        "idcard": items[i].idcard,
        "actualTrainingHours": items[i].actualTrainingHours,
        "rate": items[i].rate,
        "certificate_id": items[i].certificate_id
    });
    var action = this.Actions.load("x_cms_assemble_control");
    action.DataAction.updateWithDocumentWithPath3(//平台封装好的方法
        this.data.document_id, "datatable", "data", items[i].row_no, "student_name",//uri的参数
        items[i].student_name,//body请求参数
        function (json) { //服务调用成功的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this),
        function (json) { //服务调用失败的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this));
    action.DataAction.updateWithDocumentWithPath3(//平台封装好的方法
        this.data.document_id, "datatable", "data", items[i].row_no, "gender",//uri的参数
        items[i].gender,//body请求参数
        function (json) { //服务调用成功的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this),
        function (json) { //服务调用失败的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this));
    action.DataAction.updateWithDocumentWithPath3(//平台封装好的方法
        this.data.document_id, "datatable", "data", items[i].row_no, "idcard",//uri的参数
        items[i].idcard,//body请求参数
        function (json) { //服务调用成功的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this),
        function (json) { //服务调用失败的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this));
}

// [业务追投]: 触发学员与证书信息同步
this.data.sync_action_type = "证书信息变更";
this.include({
    "type": "process",
    "application": "项目管理",
    "name": "学员信息中间库同步"
});

// print(JSON.stringify(certificatedata));
// // 生成有背景个人证书
// action.FileInfoAction.certificateMaker(//平台封装好的方法
//     this.data.template_id,//uri的参数
//     certificatedata,//body请求参数
//     function( json ){ //服务调用成功的回调函数, json为服务传回的数据
//         print(JSON.stringify(json));
//     }.bind(this),
//     function( json ){ //服务调用失败的回调函数, json为服务传回的数据
//         print(JSON.stringify(json));
//     }.bind(this)
// );
// // 生成无背景个人证书
// for (i=0;i<items.length;i++){
//     certificatedata.certificateArgList[i].site="datatable..data.."+items[i].row_no+"..certificate_nobg";
//     };
// action.FileInfoAction.certificateMaker(//平台封装好的方法
//     this.data.template_nobg_id,//uri的参数
//     certificatedata,//body请求参数
//     function( json ){ //服务调用成功的回调函数, json为服务传回的数据
//         print(JSON.stringify(json));
//     }.bind(this),
//     function( json ){ //服务调用失败的回调函数, json为服务传回的数据
//         print(JSON.stringify(json));
//     }.bind(this)
// );           
