var cmsAction = this.Actions.load("x_cms_assemble_control");
var queryAction = this.Actions.load("x_query_assemble_surface");

// ==== 1. 抽离出的单条数据提取、清洗与插入逻辑 ====
var processDocument = function(docId) {
    cmsAction.DataAction.getWithDocument(
        docId,
        function (json) {
            var docData = json.data;
            if(!docData) return;
            
            // --- 提权核心环境属性 ---
            if (docData.$document) {
                var cp = docData.$document.creatorPerson || "";
                docData.creatorPerson = cp.indexOf("@") > -1 ? cp.split("@")[0] : cp;

                var cu = docData.$document.creatorUnitName || "";
                docData.creatorUnit = cu.indexOf("@") > -1 ? cu.split("@")[0] : cu;

                docData.creatorTime = docData.$document.createTime || docData.$document.publishTime || "";
            }

            // --- 剥离不需要的深层原生系统级外壳或复杂对象 ---
            delete docData["$attachmentList"];
            delete docData["$document"];
            delete docData["$work"];
            delete docData["datatable"];
            delete docData["reader"];

            // --- 特殊复合字段降维清洗 ---
            // 提取 headPerson 中的 name
            if (docData.headPerson && Array.isArray(docData.headPerson)) {
                var names = [];
                for (var j = 0; j < docData.headPerson.length; j++) {
                    var p = docData.headPerson[j];
                    if (typeof p === "object" && p.name) {
                        names.push(p.name);
                    } else if (typeof p === "string") {
                        names.push(p.split("@")[0]);
                    }
                }
                docData.headPerson = names.join(",");
            }

            // 提取 headPerson_org 中的 name
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

            // 提取 contacts 中的 name
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

            // 逗号拼串 trainPurpose 
            if (docData.trainPurpose && Array.isArray(docData.trainPurpose)) {
                docData.trainPurpose = docData.trainPurpose.join(",");
            }

            // “是/否” 汉字强转标准 Boolean 字段
            var boolFields = ["isJoint", "haveContract", "forForeigner", "forAbroad"];
            for (var k = 0; k < boolFields.length; k++) {
                var f = boolFields[k];
                if (docData[f] !== undefined) {
                    docData[f] = (docData[f] === "是" || docData[f] === true || docData[f] === "true");
                }
            }

            // 挂载源文档 ID
            docData.document_id = docId;

            // --- 追加流水分发列 ---
            var now = new Date();
            var paddNum = function (num) { return (num < 10 ? "0" : "") + num; };
            var timeStr = now.getFullYear() + "-" + paddNum(now.getMonth() + 1) + "-" + paddNum(now.getDate()) + " " + paddNum(now.getHours()) + ":" + paddNum(now.getMinutes()) + ":" + paddNum(now.getSeconds());

            docData.sync_uuid = docData.project_id || docId;
            docData.sync_action_type = "存量初始化";
            docData.sync_version_time = timeStr;
            docData.sync_status = "0"; 
            
            // --- 路由与目标库入库 ---
            var tableId = "";
            if (docData.project_type == "公开招生项目") {
                tableId = "d37c14de-a571-4661-be00-78888e8a8c9b"; 
            } else if (docData.project_type == "委托办学项目") {
                tableId = "6b3c4bc8-371b-40ee-ac4a-887b42074885"; 
            }
            
            if (tableId !== "") {
                queryAction.TableAction.rowInsert(
                    tableId,
                    docData,
                    function(res) {
                        print("=> 成功补录: " + docId);
                    }.bind(this),
                    function(err) {
                        print("=> 失败: " + docId + " - " + JSON.stringify(err));
                    }.bind(this)
                );
            }

        }.bind(this),
        function (err) {
            print("=> 获取详情失败: " + docId);
        }.bind(this)
    );
}.bind(this);

// ==== 2. 批量拉取分页列表引擎 ====
var fetchPage = function(lastId) {
    var count = 50; // 限制每次拉取 50 条防止内存溢出
    var data = {
       "categoryIdList" : ["e889a20b-d230-4ccd-b517-49caed68145b", "b615d062-410d-4239-8c04-49306f18e190"],
       "creatorUnitNameList" : ["继续教育学院@NK00131@U"]
    };
    
    cmsAction.DocumentAction.query_listNextWithFilter(
        lastId, 
        count,
        data,
        function( json ){ 
            var list = json.data;
            if (list && list.length > 0) {
                print(">>> 获取到一页数据，共 " + list.length + " 条...");
                // 遍历当前页所有的历史单据
                for (var i = 0; i < list.length; i++) {
                    var doc = list[i];
                    processDocument(doc.id); // 下发清洗入库指令
                }
                
                // 如果本页拉满，说明可能还有下一页，递归翻页！
                if (list.length === count) {
                    var nextId = list[list.length - 1].id;
                    fetchPage(nextId);
                } else {
                    print(">>> 所有符合条件的存量数据刷取完毕！");
                }
            } else {
                print(">>> 查询结束：未找到更多符合条件的项目。");
            }
        }.bind(this),
        function( json ){ 
            print("获取列表失败：" + JSON.stringify(json));
        }.bind(this)
    );
}.bind(this);

// ==== 3. 引擎点火启动 ====
print("=== 开始启动：继续教育学院存量数据初始化引擎 ===");
fetchPage("(0)");
