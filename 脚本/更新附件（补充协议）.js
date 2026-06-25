var action = this.Actions.load("x_cms_assemble_control");
var supplementData = {
    "reason": this.data.reason || "",
    "description": this.data.description || ""
};

if (!this.data.document_id) {
    print("补充协议附件更新异常：当前流程数据缺少 document_id，无法更新合同 CMS 文档。");
} else {
    action.DataAction.updateWithDocument(
        this.data.document_id,
        supplementData,
        function (json) {
            print(JSON.stringify(json));

            // [业务追投]: 补充协议信息已写回合同 CMS 文档后，追加合同信息中间库流水。
            // 合同业务字段从 CMS 合同文档读取，reason/description 优先使用当前补充协议流程数据。
            this.data.sync_action_type = "补充协议审批通过";
            this.include({
                "type": "process",
                "application": "项目管理",
                "name": "合同信息中间库同步"
            });
        }.bind(this),
        function (json) {
            print(JSON.stringify(json));
        }.bind(this)
    );

    this.workContext.getAttachmentList(false).map(function (item, index, arr) {
        var adddata = {
            "docId": this.data.document_id,
            "fileName": item.name,
            "fileUrl": 'https://fxl.nankai.edu.cn/x_processplatform_assemble_surface/jaxrs/attachment/download/' + item.id,
            "site": item.site
        }
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

