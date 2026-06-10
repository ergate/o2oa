(function (ctx) {
    // CMS 专用脚本：用于 CMS 文档提交事件、已发布状态下保存后事件。
    // 说明：CMS 提交事件中 getWithDocument 可能读到上次保存值，本脚本只使用当前事件上下文 this.data。
    // 说明：学员中间库按流水账追加记录，不更新、不删除历史记录。
    console.log(">>> CMS submit/save event fired, documentId=" + ctx.documentContext.getDocument().id);
    var STUDENT_TABLE_ID = "a3ba9d3f-097c-4b08-a25e-b7edc8a0a881";

    var docInfo = getDocumentInfo();
    var creatorUnitName = docInfo.creatorUnitName || "";

    // 先按 CMS 文档创建部门拦截，非继续教育学院数据不进入中间库。
    if (creatorUnitName.indexOf("继续教育学院") === -1) {
        console.log("=> CMS学员同步跳过：文档创建部门不是继续教育学院。creatorUnitName=" + creatorUnitName);
        return;
    }

    var docData = ctx.data || {};
    var docId = docInfo.id || docData.document_id || docData.documentId || docData.id || "";
    if (!docId) {
        console.log("CMS学员同步异常：当前上下文未找到文档ID，中断同步。");
        return;
    }

    var dataTableRows = getStudentRows(docData);
    if (dataTableRows.length === 0) {
        console.log("=> CMS学员同步跳过：当前文档无学员明细。document_id=" + docId);
        return;
    }

    var queryAction = ctx.Actions.load("x_query_assemble_surface");
    var baseRecord = buildBaseRecord(docData, docInfo);
    var timeStr = nowText();
    var actionType = docData.sync_action_type || "CMS学员信息提交/保存";

    for (var i = 0; i < dataTableRows.length; i++) {
        insertStudentRow(baseRecord, dataTableRows[i], i, docId, actionType, timeStr);
    }

    console.log("=> CMS学员同步流水已追加：document_id=" + docId + "，学员记录数=" + dataTableRows.length);

    function getDocumentInfo() {
        if (ctx.documentContext && ctx.documentContext.getDocument) {
            var document = ctx.documentContext.getDocument();
            if (document) return document;
        }
        if (ctx.data && ctx.data.$document) return ctx.data.$document;
        return {};
    }

    function getStudentRows(docData) {
        if (docData.datatable && Array.isArray(docData.datatable.data)) return docData.datatable.data;
        return [];
    }

    function buildBaseRecord(docData, docInfo) {
        var record = {};
        var cp = docInfo.creatorPerson || "";
        var cu = docInfo.creatorUnitName || "";

        record.creatorPerson = shortName(cp);
        record.creatorUnit = shortName(cu);
        record.creatorTime = docInfo.createTime || docInfo.publishTime || "";
        record.project_id = docData.project_id || "";
        record.project_name = docData.project_name || "";
        record.project_type = docData.project_type || "";
        record.actualHours = parseFloat(docData.actualHours) || 0.0;
        record.actualNumber = parseInt(docData.actualNumber, 10) || 0;
        return record;
    }

    function insertStudentRow(baseRecord, sourceRow, index, docId, actionType, timeStr) {
        var rowData = clone(baseRecord);
        var rowNum = sourceRow.row_no || (index + 1);

        rowData.student_name = sourceRow.student_name || "";
        rowData.student_name_e = sourceRow.student_name_e || sourceRow.name_e || "";
        rowData.gender = sourceRow.gender || "";
        rowData.idcard = sourceRow.idcard || "";
        rowData.actualTrainingHours = parseFloat(sourceRow.actualTrainingHours) || 0.0;
        rowData.rate = parseFloat(sourceRow.rate) || 0.0;
        rowData.isOK = toBoolean(sourceRow.isOK);
        rowData.certificate_id = sourceRow.certificate_id || "";
        rowData.beizhu = sourceRow.beizhu || "";
        rowData.reason = sourceRow.reason || sourceRow.reasonForNoCert || "";

        rowData.document_id = docId;
        rowData.sync_uuid = rowData.project_id + "_" + rowNum;
        rowData.sync_action_type = actionType;
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";

        queryAction.TableAction.rowInsert(
            STUDENT_TABLE_ID,
            rowData,
            function () {
                console.log("=> 成功：CMS学员流水进入中间库。项目：" + rowData.project_id + "，学员：" + rowData.student_name);
            }.bind(ctx),
            function (err) {
                console.log("=> 错误：CMS学员中间库写入失败。项目：" + rowData.project_id + "，学员：" + rowData.student_name + "，错误：" + JSON.stringify(err));
            }.bind(ctx),
            false
        );
    }

    function shortName(value) {
        var text = value || "";
        return text.indexOf("@") > -1 ? text.split("@")[0] : text;
    }

    function toBoolean(value) {
        return value === true || value === "true" || value === "是" || value === "1" || value === 1;
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function nowText() {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
    }
})(this);
(function (ctx) {
    // CMS 专用脚本：用于 CMS 文档提交事件、已发布状态下保存后事件。
    // 说明：CMS 提交事件中 getWithDocument 可能读到上次保存值，本脚本只使用当前事件上下文 this.data。
    // 说明：学员中间库按流水账追加记录，不更新、不删除历史记录。
    console.log(">>> CMS submit/save event fired, documentId=" + ctx.documentContext.getDocument().id);
    var STUDENT_TABLE_ID = "a3ba9d3f-097c-4b08-a25e-b7edc8a0a881";

    var docInfo = getDocumentInfo();
    var creatorUnitName = docInfo.creatorUnitName || "";

    // 先按 CMS 文档创建部门拦截，非继续教育学院数据不进入中间库。
    if (creatorUnitName.indexOf("继续教育学院") === -1) {
        console.log("=> CMS学员同步跳过：文档创建部门不是继续教育学院。creatorUnitName=" + creatorUnitName);
        return;
    }

    var docData = ctx.data || {};
    var docId = docInfo.id || docData.document_id || docData.documentId || docData.id || "";
    if (!docId) {
        console.log("CMS学员同步异常：当前上下文未找到文档ID，中断同步。");
        return;
    }

    var dataTableRows = getStudentRows(docData);
    if (dataTableRows.length === 0) {
        console.log("=> CMS学员同步跳过：当前文档无学员明细。document_id=" + docId);
        return;
    }

    var queryAction = ctx.Actions.load("x_query_assemble_surface");
    var baseRecord = buildBaseRecord(docData, docInfo);
    var timeStr = nowText();
    var actionType = docData.sync_action_type || "CMS学员信息提交/保存";

    for (var i = 0; i < dataTableRows.length; i++) {
        insertStudentRow(baseRecord, dataTableRows[i], i, docId, actionType, timeStr);
    }

    console.log("=> CMS学员同步流水已追加：document_id=" + docId + "，学员记录数=" + dataTableRows.length);

    function getDocumentInfo() {
        if (ctx.documentContext && ctx.documentContext.getDocument) {
            var document = ctx.documentContext.getDocument();
            if (document) return document;
        }
        if (ctx.data && ctx.data.$document) return ctx.data.$document;
        return {};
    }

    function getStudentRows(docData) {
        if (docData.datatable && Array.isArray(docData.datatable.data)) return docData.datatable.data;
        return [];
    }

    function buildBaseRecord(docData, docInfo) {
        var record = {};
        var cp = docInfo.creatorPerson || "";
        var cu = docInfo.creatorUnitName || "";

        record.creatorPerson = shortName(cp);
        record.creatorUnit = shortName(cu);
        record.creatorTime = docInfo.createTime || docInfo.publishTime || "";
        record.project_id = docData.project_id || "";
        record.project_name = docData.project_name || "";
        record.project_type = docData.project_type || "";
        record.actualHours = parseFloat(docData.actualHours) || 0.0;
        record.actualNumber = parseInt(docData.actualNumber, 10) || 0;
        return record;
    }

    function insertStudentRow(baseRecord, sourceRow, index, docId, actionType, timeStr) {
        var rowData = clone(baseRecord);
        var rowNum = sourceRow.row_no || (index + 1);

        rowData.student_name = sourceRow.student_name || "";
        rowData.student_name_e = sourceRow.student_name_e || sourceRow.name_e || "";
        rowData.gender = sourceRow.gender || "";
        rowData.idcard = sourceRow.idcard || "";
        rowData.actualTrainingHours = parseFloat(sourceRow.actualTrainingHours) || 0.0;
        rowData.rate = parseFloat(sourceRow.rate) || 0.0;
        rowData.isOK = toBoolean(sourceRow.isOK);
        rowData.certificate_id = sourceRow.certificate_id || "";
        rowData.beizhu = sourceRow.beizhu || "";
        rowData.reason = sourceRow.reason || sourceRow.reasonForNoCert || "";

        rowData.document_id = docId;
        rowData.sync_uuid = rowData.project_id + "_" + rowNum;
        rowData.sync_action_type = actionType;
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";

        queryAction.TableAction.rowInsert(
            STUDENT_TABLE_ID,
            rowData,
            function () {
                console.log("=> 成功：CMS学员流水进入中间库。项目：" + rowData.project_id + "，学员：" + rowData.student_name);
            }.bind(ctx),
            function (err) {
                console.log("=> 错误：CMS学员中间库写入失败。项目：" + rowData.project_id + "，学员：" + rowData.student_name + "，错误：" + JSON.stringify(err));
            }.bind(ctx),
            false
        );
    }

    function shortName(value) {
        var text = value || "";
        return text.indexOf("@") > -1 ? text.split("@")[0] : text;
    }

    function toBoolean(value) {
        return value === true || value === "true" || value === "是" || value === "1" || value === 1;
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function nowText() {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
    }
})(this);
