print(JSON.stringify(this.data.changedata));
print(JSON.stringify(this.data.changedataForTT));
print(JSON.stringify(this.data.changedataForStu));
print(JSON.stringify(this.data.changedataForCert));
print(JSON.stringify(this.data.document_id));
this.define("updateDoc", function (doc_id, newData, isMainProject) {
    print(JSON.stringify(doc_id));
    print(JSON.stringify(newData));
    var action = this.Actions.load("x_cms_assemble_control");
    action.DataAction.updateWithDocument(//平台封装好的方法
        doc_id,//uri的参数
        newData,//body请求参数
        function (json) { //服务调用成功的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
            
            // [业务追投]: 当主项目数据更新完成后，触发飞书流水表记录
            if (isMainProject) {
                this.data.document_id = doc_id; // 安全回写以防上下文偏离
                this.data.sync_action_type = "变更";
                this.include({
                    "type": "process",
                    "application": "项目管理",
                    "name": "项目信息中间库同步"
                });

                // [业务追投]: 精准判定是否发生课表变更，再触发课表同步
                var isScheduleChanged = false;
                if (this.data.newmsg) {
                    // 兼容委托办学（计划课表）与公开招生（开设课程及师资介绍）
                    var msgPlan = this.data.newmsg["计划课表"] || "";
                    var msgCourse = this.data.newmsg["开设课程及师资介绍"] || "";
                    
                    // 明确判定不仅要有 key，而且内容绝对不能是空字符串 ""
                    if (msgPlan !== "" || msgCourse !== "") {
                        isScheduleChanged = true;
                    }
                }
                
                if (isScheduleChanged) {
                    print("=> 监测到课表发生实质性变更，触发课表中间库同步引擎...");
                    this.include({
                        "type": "process",
                        "application": "项目管理",
                        "name": "课表信息中间库同步"
                    });
                }
            }
        }.bind(this),
        function (json) { //服务调用失败的回调函数, json为服务传回的数据
            print(JSON.stringify(json));
        }.bind(this)
    );
});

// 更新项目信息
this.updateDoc.bind(this)(this.data.document_id, this.data.changedata, true);
// 更新课表信息
if (this.data.docTT_id) {
    this.updateDoc.bind(this)(this.data.docTT_id, this.data.changedataForTT, false);
}
// 更新学员信息
if (this.data.docStu_id) {
    this.updateDoc.bind(this)(this.data.docStu_id, this.data.changedataForStu, false);
}
// 更新证书信息
if (this.data.docCert_id) {
    this.updateDoc.bind(this)(this.data.docCert_id, this.data.changedataForCert, false);
}

//更新新增教师状态
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