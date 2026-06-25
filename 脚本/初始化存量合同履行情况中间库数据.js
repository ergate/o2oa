// 一次性维护脚本：将继续教育学院创建、已审批通过且有正式合同ID的 CMS 合同履行情况初始化到中间库。
// datatable.data 每一行作为一条履行情况记录；本脚本只追加“存量履行情况初始化”流水，重复执行会重复插入。

(function (ctx) {
    var cmsAction = ctx.Actions.load("x_cms_assemble_control");
    var queryAction = ctx.Actions.load("x_query_assemble_surface");

    var PERFORMANCE_TABLE_ID = "bb7cb1b4-9999-45d5-ac26-b7edb1014073";
    var CONFIG = {
        pageSize: 50,
        categoryIdList: ["d1dd00ed-e7a8-4207-a93e-87fa821c6bc2"],
        creatorUnitNameList: ["继续教育学院@NK00131@U"]
    };
    var processedDocs = {};

    print("=== 开始初始化存量合同履行情况中间库数据 ===");
    fetchPage("(0)");

    function fetchPage(lastId) {
        var filter = {
            "categoryIdList": CONFIG.categoryIdList,
            "creatorUnitNameList": CONFIG.creatorUnitNameList
        };

        cmsAction.DocumentAction.query_listNextWithFilter(
            lastId,
            CONFIG.pageSize,
            filter,
            function (json) {
                var list = json.data || [];
                if (!list.length) {
                    print("=== 存量合同履行情况初始化完成 ===");
                    return;
                }

                for (var i = 0; i < list.length; i++) {
                    if (!list[i].id || processedDocs[list[i].id]) continue;
                    processedDocs[list[i].id] = true;
                    processDocument(list[i].id);
                }

                if (list.length === CONFIG.pageSize) {
                    var nextId = list[list.length - 1].id;
                    if (!nextId || nextId === lastId) {
                        print("=> 查询翻页中止：下一页ID无效或未推进。lastId=" + lastId + "，nextId=" + nextId);
                        return;
                    }
                    fetchPage(nextId);
                } else {
                    print("=== 存量合同履行情况初始化完成 ===");
                }
            }.bind(ctx),
            function (err) {
                print("=> 查询 CMS 合同履行情况失败：" + JSON.stringify(err));
            }.bind(ctx)
        );
    }

    function processDocument(docId) {
        cmsAction.DataAction.getWithDocument(
            docId,
            function (json) {
                var docData = json.data || {};
                if (!isApprovedPublished(docData)) {
                    print("=> 跳过：履行情况 CMS 文档未发布或未审批通过。document_id=" + docId);
                    return;
                }
                if (!meaningfulContractId(docData.contract_id)) {
                    print("=> 跳过：履行情况没有正式合同ID。document_id=" + docId + "，contract_id=" + (docData.contract_id || ""));
                    return;
                }

                var rows = docData.datatable && Array.isArray(docData.datatable.data) ? docData.datatable.data : [];
                if (!rows.length) {
                    print("=> 跳过：无合同履行明细。document_id=" + docId);
                    return;
                }

                var changed = ensurePerformanceUid(rows, docData.contract_id);
                if (changed) {
                    cmsAction.DataAction.updateWithDocument(
                        docId,
                        { "datatable": { "data": rows } },
                        function () {
                            print("=> 已回写缺失 performance_uid。document_id=" + docId);
                        }.bind(ctx),
                        function (err) {
                            print("=> 回写 performance_uid 失败。document_id=" + docId + "，错误：" + JSON.stringify(err));
                        }.bind(ctx),
                        false
                    );
                }

                var baseRecord = buildBaseRecord(docData, docId);
                var timeStr = nowText();
                for (var i = 0; i < rows.length; i++) {
                    insertPerformanceRow(buildPerformanceRow(baseRecord, rows[i] || {}, i, timeStr));
                }
            }.bind(ctx),
            function (err) {
                print("=> 读取 CMS 合同履行情况失败。document_id=" + docId + "，错误：" + JSON.stringify(err));
            }.bind(ctx)
        );
    }

    function buildBaseRecord(docData, docId) {
        var record = {};
        if (docData.$document) {
            record.creatorPerson = shortName(docData.$document.creatorPerson || "");
            record.creatorUnit = shortName(docData.$document.creatorUnitName || "");
            record.creatorTime = docData.$document.createTime || docData.$document.publishTime || "";
        }
        record.amount = toDouble(docData.amount);
        record.client = docData.client || "";
        record.contractChanged = docData.contractChanged || "";
        record.contract_id = trimText(docData.contract_id);
        record.contract_name = docData.contract_name || "";
        record.contract_operator = docData.contract_operator || "";
        record.defaultInfo = docData.defaultInfo || "";
        record.document_id = docId;
        record.endingTime = docData.endingTime || "";
        record.openingTime = docData.openingTime || "";
        return record;
    }

    function buildPerformanceRow(baseRecord, sourceRow, index, timeStr) {
        var rowData = clone(baseRecord);
        rowData.actualEndingTime = sourceRow.actualEndingTime || "";
        rowData.actualOpeningTime = sourceRow.actualOpeningTime || "";
        rowData.actualPayment = toDouble(sourceRow.actualPayment);
        rowData.collectionDate = sourceRow.collectionDate || "";
        rowData.headPerson = arrayToText(sourceRow.headPerson);
        rowData.info = sourceRow.info || "";
        rowData.payable = toDouble(sourceRow.payable);
        rowData.project_id = sourceRow.project_id || "";
        rowData.project_name = sourceRow.project_name || "";
        rowData.sync_uuid = sourceRow.performance_uid || sourceRow.performance_id || sourceRow.performance_uuid || (rowData.contract_id + "_PERF_ROW_" + (index + 1));
        rowData.sync_action_type = "存量履行情况初始化";
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";
        return rowData;
    }

    function insertPerformanceRow(rowData) {
        queryAction.TableAction.rowInsert(
            PERFORMANCE_TABLE_ID,
            rowData,
            function () {
                print("=> 成功补录：存量合同履行情况。contract_id=" + rowData.contract_id + "，project_id=" + rowData.project_id + "，sync_uuid=" + rowData.sync_uuid);
            }.bind(ctx),
            function (err) {
                print("=> 失败：存量合同履行情况写入中间库。contract_id=" + rowData.contract_id + "，sync_uuid=" + rowData.sync_uuid + "，错误：" + JSON.stringify(err));
            }.bind(ctx),
            false
        );
    }

    function ensurePerformanceUid(rows, contractId) {
        var changed = false;
        var used = {};
        for (var i = 0; i < rows.length; i++) {
            if (!rows[i]) continue;
            var existing = firstFilled(rows[i].performance_uid, rows[i].performance_id, rows[i].performance_uuid);
            if (existing) {
                rows[i].performance_uid = existing;
                used[existing] = true;
                continue;
            }
            rows[i].performance_uid = makePerformanceUid(contractId, rows[i].project_id, used);
            used[rows[i].performance_uid] = true;
            changed = true;
        }
        return changed;
    }

    function makePerformanceUid(contractId, projectId, used) {
        var uid = safePart(contractId || "unknown_contract") + "_" + safePart(projectId || "unknown_project") + "_PERF_" + timestamp() + "_" + randomDigits(6);
        while (used[uid]) {
            uid = safePart(contractId || "unknown_contract") + "_" + safePart(projectId || "unknown_project") + "_PERF_" + timestamp() + "_" + randomDigits(6);
        }
        return uid;
    }

    function isApprovedPublished(docData) {
        if (!docData.$document) return true;
        return docData.$document.docStatus === "published" && docData.$document.reviewed !== false;
    }

    function meaningfulContractId(value) {
        var text = trimText(value);
        return text !== "" && text !== "00000000000000";
    }

    function firstFilled() {
        for (var i = 0; i < arguments.length; i++) {
            var value = trimText(arguments[i]);
            if (value !== "") return value;
        }
        return "";
    }

    function arrayToText(value) {
        if (!Array.isArray(value)) return value || "";
        var parts = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i] === null || value[i] === undefined) continue;
            if (typeof value[i] === "object") parts.push(value[i].name || JSON.stringify(value[i]));
            else parts.push(String(value[i]));
        }
        return parts.join(",");
    }

    function toDouble(value) {
        var num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj || {}));
    }

    function nowText() {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function timestamp() {
        var d = new Date();
        return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + padMs(d.getMilliseconds());
    }

    function randomDigits(length) {
        var max = Math.pow(10, length);
        var text = String(Math.floor(Math.random() * max));
        while (text.length < length) text = "0" + text;
        return text;
    }

    function safePart(value) {
        var text = trimText(value).replace(/[^0-9A-Za-z_-]/g, "_");
        return text || "unknown";
    }

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
    }

    function padMs(num) {
        if (num < 10) return "00" + num;
        if (num < 100) return "0" + num;
        return String(num);
    }

    function shortName(value) {
        var text = trimText(value);
        return text.indexOf("@") > -1 ? text.split("@")[0] : text;
    }

    function trimText(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "");
    }
})(this);
