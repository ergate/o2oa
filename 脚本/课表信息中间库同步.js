(function(ctx) {
    var docId = ctx.data.document_id;
    var actionType = ctx.data.sync_action_type || "未知触发";
    
    if (!docId) {
        print("飞书课表同步异常：当前上下文未找到 document_id，中断同步。");
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
            print("=> 业务拦截：当前项目不包含“继续教育学院”标识，跳过课表底层自建表同步。拦截依据：[" + unitInfo + "]");
            return;
        }

        // 1.2 检查是否有课表数组
        var dataTableRows = [];
        if (docData.datatable && Array.isArray(docData.datatable.data) && docData.datatable.data.length > 0) {
            dataTableRows = docData.datatable.data;
        } else if (docData.datatable_1 && Array.isArray(docData.datatable_1.data) && docData.datatable_1.data.length > 0) {
            dataTableRows = docData.datatable_1.data;
        }
        
        if (dataTableRows.length === 0) {
            print("=> 业务提示：该项目 (" + docId + ") 尚未填写计划课表，无需同步课表中间库。");
            return;
        }

        // --- 1.5 提权核心环境属性 ---
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

        // 生成追踪信息
        var now = new Date();
        var paddNum = function (num) { return (num < 10 ? "0" : "") + num; };
        var timeStr = now.getFullYear() + "-" + paddNum(now.getMonth() + 1) + "-" + paddNum(now.getDate()) + " " + paddNum(now.getHours()) + ":" + paddNum(now.getMinutes()) + ":" + paddNum(now.getSeconds());

        // --- 2. 开始拆分平铺 ---
        var tableId = "e4e890e0-2c23-4e40-88de-1db1f8aee936"; 
        var queryAction = ctx.Actions.load("x_query_assemble_surface");

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
            rowData.sync_action_type = actionType;
            rowData.sync_version_time = timeStr;
            rowData.sync_status = "0";

            queryAction.TableAction.rowInsert(
                tableId,
                rowData,
                function(res) {
                    print("=> 成功: 项目课表记录已进入中转站。所属项目：" + rowData.project_id + " - 课程：" + rowData.course_name);
                }.bind(ctx),
                function(err) {
                    print("=> 错误: 课表中间库写入失败: " + JSON.stringify(err));
                }.bind(ctx)
            );
        }

    }.bind(ctx),
    function (json) {
        print("同步中止：无法获取源表单的课表详情。");
    }.bind(ctx)
);

})(this);
