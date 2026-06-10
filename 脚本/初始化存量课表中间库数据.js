var cmsAction = this.Actions.load("x_cms_assemble_control");
var queryAction = this.Actions.load("x_query_assemble_surface");

// ==== 1. 抽离出的课表单据提取、平铺与插入逻辑 ====
var processDocument = function (docId) {
    cmsAction.DataAction.getWithDocument(
        docId,
        function (json) {
            var docData = json.data;
            if (!docData) return;

            // 检查是否有课表数组
            var dataTableRows = [];
            if (docData.datatable && Array.isArray(docData.datatable.data) && docData.datatable.data.length > 0) {
                dataTableRows = docData.datatable.data;
            } else if (docData.datatable_1 && Array.isArray(docData.datatable_1.data) && docData.datatable_1.data.length > 0) {
                dataTableRows = docData.datatable_1.data;
            }

            if (dataTableRows.length === 0) {
                print("=> [存量课表]：该项目 (" + docId + ") 无计划课表，跳过。");
                return;
            }

            // --- 提权核心环境属性（主表字段提取）---
            var baseRecord = {};
            if (docData.$document) {
                var cp = docData.$document.creatorPerson || "";
                baseRecord.creatorPerson = cp.indexOf("@") > -1 ? cp.split("@")[0] : cp;

                var cu = docData.$document.creatorUnitName || "";
                baseRecord.creatorUnit = cu.indexOf("@") > -1 ? cu.split("@")[0] : cu;

                baseRecord.creatorTime = docData.$document.createTime || docData.$document.publishTime || "";
            }

            baseRecord.project_id = docData.project_id || "";
            baseRecord.project_name = docData.project_name || "";
            baseRecord.project_type = docData.project_type || "";
            baseRecord.client = docData.client || "";
            baseRecord.openingTime = docData.openingTime || "";
            baseRecord.endingTime = docData.endingTime || "";
            baseRecord.traineesNumber = docData.traineesNumber || 0;
            baseRecord.trainingHours = docData.trainingHours || 0;
            baseRecord.actualHours = docData.actualHours || 0;
            baseRecord.timetable_id = docData.timetable_id || "";

            // 生成批次追踪信息
            var now = new Date();
            var paddNum = function (num) { return (num < 10 ? "0" : "") + num; };
            var timeStr = now.getFullYear() + "-" + paddNum(now.getMonth() + 1) + "-" + paddNum(now.getDate()) + " " + paddNum(now.getHours()) + ":" + paddNum(now.getMinutes()) + ":" + paddNum(now.getSeconds());

            var tableId = "e4e890e0-2c23-4e40-88de-1db1f8aee936"; // scheduleInfo 课表自建表

            // --- 循环拆解子表并推送 ---
            for (var i = 0; i < dataTableRows.length; i++) {
                var dtRow = dataTableRows[i];
                var rowData = JSON.parse(JSON.stringify(baseRecord));

                rowData.course_id = dtRow.course_id || "";
                rowData.course_name = dtRow.courseSubject || "";
                rowData.course_type = dtRow.course_type || "";
                rowData.course_hours = dtRow.course_hours || 0;

                rowData.teacher_type = dtRow.teacher_type || "";
                rowData.teacher_id = dtRow.teacher_id || "";
                rowData.teacher_name = dtRow.teacher_name || "";
                rowData.feeStd = dtRow.feeStd || "";
                rowData.teacher_title = dtRow.teacher_title || "";
                rowData.teacher_unit = dtRow.unit || "";
                rowData.warning = dtRow.warning || "";

                rowData.document_id = docId;
                rowData.sync_uuid = rowData.project_id + "_" + (i + 1);
                rowData.sync_action_type = "存量课表初始化";
                rowData.sync_version_time = timeStr;
                rowData.sync_status = "0";

                queryAction.TableAction.rowInsert(
                    tableId,
                    rowData,
                    function (res) {
                        print("=> 成功补录: 存量课表 " + rowData.project_id + " [" + rowData.course_name + "]");
                    }.bind(this),
                    function (err) {
                        print("=> 失败: 存量课表写入 " + docId + " - " + JSON.stringify(err));
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
var fetchPage = function (lastId) {
    var count = 50;
    var data = {
        "categoryIdList": ["e889a20b-d230-4ccd-b517-49caed68145b", "b615d062-410d-4239-8c04-49306f18e190"],
        "creatorUnitNameList": ["继续教育学院@NK00131@U"]
    };

    cmsAction.DocumentAction.query_listNextWithFilter(
        lastId,
        count,
        data,
        function (json) {
            var list = json.data;
            if (list && list.length > 0) {
                print(">>> 获取到一页历史存量，共 " + list.length + " 条...");
                for (var i = 0; i < list.length; i++) {
                    var doc = list[i];
                    processDocument(doc.id);
                }

                if (list.length === count) {
                    var nextId = list[list.length - 1].id;
                    fetchPage(nextId);
                } else {
                    print(">>> 所有符合条件的存量课表数据刷取指令下发完毕！");
                }
            } else {
                print(">>> 查询结束：未找到更多符合条件的项目课表。");
            }
        }.bind(this),
        function (json) {
            print("获取列表失败：" + JSON.stringify(json));
        }.bind(this)
    );
}.bind(this);

// ==== 3. 引擎点火启动 ====
print("=== 开始启动：继续教育学院【课表】存量数据初始化引擎 ===");
fetchPage("(0)");
