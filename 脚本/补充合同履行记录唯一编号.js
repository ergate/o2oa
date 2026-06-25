// 一次性维护脚本：为 CMS 合同履行情况 datatable.data 补充 performance_uid。
// 使用前提：
// 1. 合同履行情况流程表单和 CMS 表单的 datatable 增加隐藏列 performance_uid。
// 2. performance_uid 直接对应合同履行情况中间库 sync_uuid，不需要给中间库或飞书目标表新增 performance_uid 字段。
// 3. 本脚本只做存量补号，不做中间库同步；补号后下一次履行情况同步会把 performance_uid 写入 sync_uuid。
// 4. 已有 performance_uid/performance_id/performance_uuid 的行不会重新编号，避免重复运行造成主键漂移。
// 5. 新补编号统一使用：合同编号_项目编号_PERF_yyyyMMddHHmmssSSS_6位随机数。

(function (ctx) {
    var cmsAction = ctx.Actions.load("x_cms_assemble_control");

    var CONFIG = {
        pageSize: 50,
        categoryIdList: ["d1dd00ed-e7a8-4207-a93e-87fa821c6bc2"]
    };
    var processedDocs = {};

    print("=== 开始补充 CMS 合同履行记录唯一编号 performance_uid ===");
    fetchPage("(0)");

    function fetchPage(lastId) {
        var filter = {
            "categoryIdList": CONFIG.categoryIdList
        };

        cmsAction.DocumentAction.query_listNextWithFilter(
            lastId,
            CONFIG.pageSize,
            filter,
            function (json) {
                var list = json.data || [];
                if (!list.length) {
                    print("=== 合同履行记录唯一编号补充完成 ===");
                    return;
                }

                for (var i = 0; i < list.length; i++) {
                    if (!list[i].id || processedDocs[list[i].id]) continue;
                    processedDocs[list[i].id] = true;
                    patchDocument(list[i].id);
                }

                if (list.length === CONFIG.pageSize) {
                    var nextId = list[list.length - 1].id;
                    if (!nextId || nextId === lastId) {
                        print("=> 查询翻页中止：下一页ID无效或未推进。lastId=" + lastId + "，nextId=" + nextId);
                        return;
                    }
                    fetchPage(nextId);
                } else {
                    print("=== 合同履行记录唯一编号补充完成 ===");
                }
            }.bind(ctx),
            function (err) {
                print("=> 查询 CMS 合同履行情况文档失败：" + JSON.stringify(err));
            }.bind(ctx)
        );
    }

    function patchDocument(docId) {
        cmsAction.DataAction.getWithDocument(
            docId,
            function (json) {
                var docData = json.data || {};
                var rows = docData.datatable && Array.isArray(docData.datatable.data) ? docData.datatable.data : [];
                if (!rows.length) {
                    print("=> 跳过：无合同履行明细。document_id=" + docId);
                    return;
                }

                var changed = false;
                var existsCount = 0;
                var generatedCount = 0;
                var migratedCount = 0;
                var used = {};
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i] || {};
                    var existingInfo = firstFilledInfo(row);
                    if (existingInfo.value) {
                        if (!isFilled(row.performance_uid)) {
                            changed = true;
                            migratedCount++;
                        }
                        row.performance_uid = existingInfo.value;
                        used[existingInfo.value] = true;
                        existsCount++;
                        print("=> 已有 performance_uid：document_id=" + docId + "，行号=" + (row.row_no || (i + 1)) + "，来源=" + existingInfo.source + "，值=" + existingInfo.value);
                        continue;
                    }

                    row.performance_uid = makePerformanceUid(docData.contract_id || docId, row.project_id || "unknown_project", used);
                    used[row.performance_uid] = true;
                    changed = true;
                    generatedCount++;
                }

                if (!changed) {
                    print("=> 跳过：合同履行记录唯一编号已存在。document_id=" + docId + "，总行数=" + rows.length + "，已有=" + existsCount);
                    return;
                }

                cmsAction.DataAction.updateWithDocument(
                    docId,
                    { "datatable": { "data": rows } },
                    function () {
                        print("=> 已补充 performance_uid。document_id=" + docId + "，总行数=" + rows.length + "，已有=" + existsCount + "，迁移=" + migratedCount + "，新增=" + generatedCount);
                    }.bind(ctx),
                    function (err) {
                        print("=> 补充 performance_uid 失败。document_id=" + docId + "，错误：" + JSON.stringify(err));
                    }.bind(ctx)
                );
            }.bind(ctx),
            function (err) {
                print("=> 读取 CMS 合同履行情况文档失败。document_id=" + docId + "，错误：" + JSON.stringify(err));
            }.bind(ctx)
        );
    }

    function firstFilledInfo(row) {
        var fields = ["performance_uid", "performance_id", "performance_uuid"];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (isFilled(row[field])) {
                return {
                    source: field,
                    value: trimText(row[field])
                };
            }
        }
        return { source: "", value: "" };
    }

    function makePerformanceUid(contractId, projectId, used) {
        var uid = safePart(contractId || "unknown_contract") + "_" + safePart(projectId || "unknown_project") + "_PERF_" + timestamp() + "_" + randomDigits(6);
        while (used[uid]) {
            uid = safePart(contractId || "unknown_contract") + "_" + safePart(projectId || "unknown_project") + "_PERF_" + timestamp() + "_" + randomDigits(6);
        }
        return uid;
    }

    function isFilled(value) {
        return value !== null && value !== undefined && trimText(value) !== "";
    }

    function safePart(value) {
        var text = trimText(value).replace(/[^0-9A-Za-z_-]/g, "_");
        return text || "unknown";
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

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
    }

    function padMs(num) {
        if (num < 10) return "00" + num;
        if (num < 100) return "0" + num;
        return String(num);
    }

    function trimText(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "");
    }
})(this);
