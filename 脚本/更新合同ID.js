this.include({
    "type": "process",
    "application": "项目管理",
    "name": "获取读者部门列表"
});
newdata = { "contract_id": this.data.contract_id };
var action = this.Actions.load("x_cms_assemble_control");
action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.document_id,//uri的参数
    newdata,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));

        // [业务追投]: 合同 CMS 文档已写回最终合同编号后，追加合同信息中间库流水。
        // 同步脚本会读取 this.data.document_id 指向的 CMS 合同文档，同时优先使用流程数据 this.data.contract_id。
        this.data.sync_action_type = "合同审批通过";
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "合同信息中间库同步"
        });
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this)
);
// 转存附件
this.workContext.getAttachmentList(false).map(function (item, index, arr) {
    var adddata = {
        "docId": this.data.document_id,
        "fileName": item.name,
        "fileUrl": 'https://fxl.nankai.edu.cn/x_processplatform_assemble_surface/jaxrs/attachment/download/' + item.id,
        "site": "contract_final"
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

action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.pj_docID,//uri的参数
    newdata,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this));

action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.timetable_docID,//uri的参数
    newdata,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this));
// 根据合同内容生成合同履行情况的初始表单
action.DataAction.getWithDocument(//平台封装好的方法
    this.data.document_id,//uri的参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        contract_data = json.data; //为变量data赋值
        var paydata = {
            "reader": this.getReaderUnitNameList1.bind(this)(this.workContext.getWork().creatorUnit),
            "contract_id": this.data.contract_id,
            "contract_name": this.data.contract_name,
            "contract_operator": contract_data.college_contacts[0].name,
            "client": contract_data.client,
            "openingTime": contract_data.openingTime,
            "endingTime": contract_data.endingTime,
            "amount": contract_data.totalTuition,
            "datatable": {
                "data": [],
                "total": {
                    "payable": 0,
                    "actualPayment": 0
                }
            },
            "contractChanged": "",
            "defaultInfo": ""
        }
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
        data["docData"] = paydata;
        data["readerList"] = readerList;
        data["authorList"] = authorList;
        data["title"] = "合同履行情况：【" + paydata.contract_id + "】" + paydata.contract_name;
        data["documentType"] = "信息";
        data["docStatus"] = "published";
        data["categoryId"] = "d1dd00ed-e7a8-4207-a93e-87fa821c6bc2";

        var action = this.Actions.load("x_cms_assemble_control");
        action.DocumentAction.persist_publishContent(data,
            function (json) {
                data = json.data;
                // item.document_id=data.id;
            }.bind(this),
            function (json) {
                data = json.data;
            }.bind(this),
            false
        );
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        data = json.data; //为变量data赋值
    }.bind(this)
);
