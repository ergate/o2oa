(function(ctx) {
    var docId = ctx.data.document_id;
    var actionType = ctx.data.sync_action_type || "未知触发";
    
    if (!docId) {
        print("飞书同步异常：当前上下文未找到 document_id，中断同步。");
        return;
    }

// 1. 获取 CMS 全量最新文档数据
var cmsAction = ctx.Actions.load("x_cms_assemble_control");
cmsAction.DataAction.getWithDocument(
    docId,
    function (json) {
        var docData = json.data;

        // --- 1.1 业务拦截阀门：仅继续教育学院更新中转表 ---
        var unitInfo = "";
        if (docData.$document && docData.$document.creatorUnitName) {
            unitInfo += docData.$document.creatorUnitName;
        }
        if (docData.headPerson_org) {
            unitInfo += JSON.stringify(docData.headPerson_org);
        }
        
        if (unitInfo.indexOf("继续教育学院") === -1) {
            print("=> 业务拦截：当前项目不包含“继续教育学院”标识，跳过底层自建表同步。拦截依据：[" + unitInfo + "]");
            return;
        }

        // --- 1.5 提权核心环境属性 ---
        if (docData.$document) {
            var cp = docData.$document.creatorPerson || "";
            docData.creatorPerson = cp.indexOf("@") > -1 ? cp.split("@")[0] : cp;

            var cu = docData.$document.creatorUnitName || "";
            docData.creatorUnit = cu.indexOf("@") > -1 ? cu.split("@")[0] : cu;

            docData.creatorTime = docData.$document.createTime || docData.$document.publishTime || "";
        }

        // 2. 剥离不需要的外壳
        delete docData["$attachmentList"];
        delete docData["$document"];
        delete docData["$work"];
        delete docData["datatable"];
        delete docData["reader"];

        // 3. 特殊复合字段降维清洗
        if (docData.headPerson && Array.isArray(docData.headPerson)) {
            var names = [];
            for (var i = 0; i < docData.headPerson.length; i++) {
                var p = docData.headPerson[i];
                if (typeof p === "object" && p.name) {
                    names.push(p.name);
                } else if (typeof p === "string") {
                    names.push(p.split("@")[0]);
                }
            }
            docData.headPerson = names.join(",");
        }

        if (docData.headPerson_org && Array.isArray(docData.headPerson_org)) {
            var orgs = [];
            for (var j = 0; j < docData.headPerson_org.length; j++) {
                var org = docData.headPerson_org[j];
                if (typeof org === "object" && org.name) {
                    orgs.push(org.name);
                } else if (typeof org === "string") {
                    orgs.push(org.split("@")[0]);
                }
            }
            docData.headPerson_org = orgs.join(",");
        }

        if (docData.contacts && Array.isArray(docData.contacts)) {
            var contactsNames = [];
            for (var c = 0; c < docData.contacts.length; c++) {
                var cobj = docData.contacts[c];
                if (typeof cobj === "object" && cobj.name) {
                    contactsNames.push(cobj.name);
                } else if (typeof cobj === "string") {
                    contactsNames.push(cobj.split("@")[0]);
                }
            }
            docData.contacts = contactsNames.join(",");
        }

        if (docData.trainPurpose && Array.isArray(docData.trainPurpose)) {
            docData.trainPurpose = docData.trainPurpose.join(",");
        }

        var boolFields = ["isJoint", "haveContract", "forForeigner", "forAbroad"];
        for (var k = 0; k < boolFields.length; k++) {
            var f = boolFields[k];
            if (docData[f] !== undefined) {
                docData[f] = (docData[f] === "是" || docData[f] === true || docData[f] === "true");
            }
        }

        docData.document_id = docId;

        // 4. 追加流水分发追踪参数
        var now = new Date();
        var paddNum = function (num) { return (num < 10 ? "0" : "") + num; };
        var timeStr = now.getFullYear() + "-" + paddNum(now.getMonth() + 1) + "-" + paddNum(now.getDate()) + " " + paddNum(now.getHours()) + ":" + paddNum(now.getMinutes()) + ":" + paddNum(now.getSeconds());

        docData.sync_uuid = docData.project_id;
        docData.sync_action_type = actionType;
        docData.sync_version_time = timeStr;
        docData.sync_status = "0"; 

        // 5. 路由判断
        var tableId = "";
        if (docData.project_type == "公开招生项目") {
            tableId = "d37c14de-a571-4661-be00-78888e8a8c9b"; 
        } else if (docData.project_type == "委托办学项目") {
            tableId = "6b3c4bc8-371b-40ee-ac4a-887b42074885"; 
        }

        if (tableId !== "") {
            // 6. 执行物理自建表同步插入
            var queryAction = ctx.Actions.load("x_query_assemble_surface");
            queryAction.TableAction.rowInsert(
                tableId,
                docData,
                function (res) {
                    print("=> 成功: 项目数据已进入中转站流水表。动作：" + actionType + ", 路由表：" + tableId);
                }.bind(ctx),
                function (err) {
                    print("=> 错误: 中转自建表写入失败: " + JSON.stringify(err));
                }.bind(ctx)
            );
        } else {
            print("=> 警告: 该数据 project_type 未知，未投递至自建表: " + docData.project_type);
        }

    }.bind(ctx),
    function (err) {
        print("=> 严重错误: 无法获取 CMS 文档源数据进行飞书同步: " + JSON.stringify(err));
    }.bind(ctx)
);

})(this);
