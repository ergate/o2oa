(function (ctx) {
    // 流程专用脚本：由“合同履行情况登记流程”审批完成后调用，不要放到 CMS 保存事件中使用。
    // 数据来源是当前流程表单 ctx.data；CMS 文档只由“登记合同履行情况.js”负责更新。
    // 每一行 datatable.data 都是一条独立履行情况流水，performance_uid 直接对应中间库 sync_uuid。
    var PERFORMANCE_TABLE_ID = "bb7cb1b4-9999-45d5-ac26-b7edb1014073";
    var PERFORMANCE_DIFF_FIELDS = [
        "actualEndingTime",
        "actualOpeningTime",
        "actualPayment",
        "amount",
        "client",
        "collectionDate",
        "contractChanged",
        "contract_id",
        "contract_name",
        "contract_operator",
        "defaultInfo",
        "endingTime",
        "headPerson",
        "info",
        "openingTime",
        "payable",
        "project_id",
        "project_name"
    ];

    if (!PERFORMANCE_TABLE_ID) {
        print("合同履行情况同步未执行：请先在脚本顶部填写 PERFORMANCE_TABLE_ID。");
        return;
    }

    var processData = ctx.data || {};
    var docId = processData.document_id || "";
    var actionType = processData.sync_action_type || "合同履行情况登记";
    if (!docId) {
        print("合同履行情况同步异常：当前流程数据缺少 document_id，中断同步。");
        return;
    }

    var rows = getPerformanceRows(processData);
    var baseRecord = buildBaseRecord(processData);
    var queryAction = ctx.Actions.load("x_query_assemble_surface");
    var timeStr = nowText();

    loadLatestRows(queryAction, docId, function (latestIndex) {
        var currentRows = buildCurrentRows(baseRecord, rows, docId, actionType, timeStr);
        var currentByUuid = {};
        var insertCount = 0;
        var deleteCount = 0;
        var unchangedCount = 0;

        for (var i = 0; i < currentRows.length; i++) {
            var current = currentRows[i];
            var latest = findLatestPerformance(current, latestIndex, currentByUuid);
            if (latest && latest.sync_uuid && !current._performance_uid) {
                current.sync_uuid = latest.sync_uuid;
            }

            currentByUuid[current.sync_uuid] = current;
            if (latest && latest.sync_uuid) currentByUuid[latest.sync_uuid] = current;

            if (!latest || isDeletedRow(latest)) {
                current.sync_action_type = makePerformanceAction(actionType, "新增");
                insertPerformanceRow(queryAction, current);
                insertCount++;
            } else if (hasPerformanceChanged(current, latest)) {
                current.sync_action_type = makePerformanceAction(actionType, "修改");
                insertPerformanceRow(queryAction, current);
                insertCount++;
            } else {
                unchangedCount++;
            }
        }

        for (var uuid in latestIndex.byUuid) {
            if (!latestIndex.byUuid.hasOwnProperty(uuid) || currentByUuid[uuid] || isDeletedRow(latestIndex.byUuid[uuid])) continue;
            insertPerformanceRow(queryAction, buildDeletedRow(baseRecord, latestIndex.byUuid[uuid], docId, actionType, timeStr));
            deleteCount++;
        }

        if (insertCount === 0 && deleteCount === 0) {
            print("=> 合同履行情况未发生实质性变更，未追加中间库流水。document_id=" + docId + "，未变更记录数=" + unchangedCount);
        } else {
            print("=> 合同履行情况增量流水已追加：document_id=" + docId + "，新增/变更=" + insertCount + "，删除=" + deleteCount + "，未变更=" + unchangedCount);
        }
    }, function (err) {
        print("=> 合同履行情况同步中止：无法读取历史流水，避免重复写入。错误：" + JSON.stringify(err));
    });

    function getPerformanceRows(processData) {
        if (processData.datatable && Array.isArray(processData.datatable.data)) return processData.datatable.data;
        return [];
    }

    function buildBaseRecord(processData) {
        var record = {};
        if (processData.$work) {
            record.creatorPerson = shortName(processData.$work.creatorPerson || "");
            record.creatorUnit = shortName(processData.$work.creatorUnit || "");
            record.creatorTime = processData.$work.startTime || processData.$work.activityArrivedTime || "";
        }
        record.amount = toDouble(processData.amount);
        record.client = processData.client || "";
        record.contractChanged = processData.contractChanged || "";
        record.contract_id = processData.contract_id || "";
        record.contract_name = processData.contract_name || "";
        record.contract_operator = processData.contract_operator || "";
        record.defaultInfo = processData.defaultInfo || "";
        record.endingTime = processData.endingTime || "";
        record.openingTime = processData.openingTime || "";
        return record;
    }

    function buildCurrentRows(baseRecord, sourceRows, docId, actionType, timeStr) {
        var rows = [];
        for (var i = 0; i < sourceRows.length; i++) {
            rows.push(buildPerformanceRow(baseRecord, sourceRows[i], i, docId, actionType, timeStr));
        }
        return rows;
    }

    function buildPerformanceRow(baseRecord, sourceRow, index, docId, actionType, timeStr) {
        var rowData = clone(baseRecord);
        var rowNum = sourceRow.row_no || (index + 1);

        rowData._performance_uid = sourceRow.performance_uid || sourceRow.performance_id || sourceRow.performance_uuid || "";
        rowData.actualEndingTime = sourceRow.actualEndingTime || "";
        rowData.actualOpeningTime = sourceRow.actualOpeningTime || "";
        rowData.actualPayment = toDouble(sourceRow.actualPayment);
        rowData.collectionDate = sourceRow.collectionDate || "";
        rowData.headPerson = arrayToText(sourceRow.headPerson);
        rowData.info = sourceRow.info || "";
        rowData.payable = toDouble(sourceRow.payable);
        rowData.project_id = sourceRow.project_id || "";
        rowData.project_name = sourceRow.project_name || "";

        rowData.document_id = docId;
        rowData._performance_match_keys = buildPerformanceMatchKeys(rowData, rowNum);
        rowData.sync_uuid = buildSyncUuid(rowData.contract_id, rowData._performance_uid, rowData._performance_match_keys);
        rowData.sync_action_type = actionType;
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";
        return rowData;
    }

    function buildDeletedRow(baseRecord, latestRow, docId, actionType, timeStr) {
        var rowData = clone(baseRecord);
        for (var i = 0; i < PERFORMANCE_DIFF_FIELDS.length; i++) {
            var field = PERFORMANCE_DIFF_FIELDS[i];
            rowData[field] = latestRow[field];
        }
        rowData.document_id = docId;
        rowData.sync_uuid = latestRow.sync_uuid;
        rowData._performance_match_keys = buildPerformanceMatchKeys(rowData, "");
        rowData.sync_action_type = makePerformanceAction(actionType, "删除");
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";
        return rowData;
    }

    function loadLatestRows(queryAction, docId, success, failure) {
        var where = "o.document_id='" + escapeWhereValue(docId) + "'";
        queryAction.TableAction.listRowSelectWhere(
            PERFORMANCE_TABLE_ID,
            where,
            function (json) {
                var rows = normalizeRows(json);
                var latestIndex = { byUuid: {}, byMatchKey: {}, duplicateKeys: {} };
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (!row.sync_uuid) continue;
                    if (!latestIndex.byUuid[row.sync_uuid] || isLaterRow(row, latestIndex.byUuid[row.sync_uuid])) {
                        latestIndex.byUuid[row.sync_uuid] = row;
                    }
                }
                for (var uuid in latestIndex.byUuid) {
                    if (!latestIndex.byUuid.hasOwnProperty(uuid)) continue;
                    addLatestMatchKeys(latestIndex, latestIndex.byUuid[uuid]);
                }
                success(latestIndex);
            }.bind(ctx),
            failure.bind(ctx),
            false
        );
    }

    function insertPerformanceRow(queryAction, rowData) {
        var insertData = clone(rowData);
        delete insertData._performance_uid;
        delete insertData._performance_match_keys;

        queryAction.TableAction.rowInsert(
            PERFORMANCE_TABLE_ID,
            insertData,
            function () {
                print("=> 成功：合同履行情况流水进入中间库。动作：" + rowData.sync_action_type + "，合同：" + rowData.contract_id + "，项目：" + rowData.project_id);
            }.bind(ctx),
            function (err) {
                print("=> 错误：合同履行情况中间库写入失败。动作：" + rowData.sync_action_type + "，合同：" + rowData.contract_id + "，项目：" + rowData.project_id + "，错误：" + JSON.stringify(err));
            }.bind(ctx),
            false
        );
    }

    function findLatestPerformance(current, latestIndex, usedByUuid) {
        var keys = current._performance_match_keys || [];
        for (var i = 0; i < keys.length; i++) {
            if (latestIndex.duplicateKeys[keys[i]]) continue;
            var latest = latestIndex.byMatchKey[keys[i]];
            if (latest && usedByUuid[latest.sync_uuid]) continue;
            if (latest) return latest;
        }
        return null;
    }

    function addLatestMatchKeys(latestIndex, row) {
        var keys = buildPerformanceMatchKeys(row, "");
        addMatchKey(keys, "uid", normalizeIdentityValue(row.sync_uuid));
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (latestIndex.duplicateKeys[key]) continue;
            if (latestIndex.byMatchKey[key] && latestIndex.byMatchKey[key].sync_uuid !== row.sync_uuid) {
                delete latestIndex.byMatchKey[key];
                latestIndex.duplicateKeys[key] = true;
                continue;
            }
            if (!latestIndex.byMatchKey[key] || isLaterRow(row, latestIndex.byMatchKey[key])) {
                latestIndex.byMatchKey[key] = row;
            }
        }
    }

    function buildPerformanceMatchKeys(row, rowNum) {
        var keys = [];
        addMatchKey(keys, "uid", normalizeIdentityValue(row._performance_uid || row.performance_uid));
        addMatchKey(keys, "payment", normalizeIdentityValue([
            row.contract_id,
            row.project_id,
            row.collectionDate,
            row.payable,
            row.actualPayment,
            row.actualOpeningTime,
            row.actualEndingTime
        ].join("|")));
        addMatchKey(keys, "row", rowNum ? String(rowNum) : "");
        return keys;
    }

    function addMatchKey(keys, type, value) {
        if (!value) return;
        keys.push(type + ":" + value);
    }

    function buildSyncUuid(contractId, performanceUid, matchKeys) {
        var uid = trimText(performanceUid);
        if (uid) return uid;
        return (contractId || "unknown_contract") + "_PERF_" + hashText(chooseSyncUuidKey(matchKeys));
    }

    function chooseSyncUuidKey(keys) {
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf("uid:") === 0 || keys[i].indexOf("payment:") === 0) return keys[i];
        }
        return keys.length ? keys[0] : "row:unknown";
    }

    function hasPerformanceChanged(current, latest) {
        for (var i = 0; i < PERFORMANCE_DIFF_FIELDS.length; i++) {
            var field = PERFORMANCE_DIFF_FIELDS[i];
            if (normalizeValue(current[field], field) !== normalizeValue(latest[field], field)) return true;
        }
        return false;
    }

    function normalizeValue(value, field) {
        if (field === "actualPayment" || field === "amount" || field === "payable") return String(toDouble(value));
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "");
    }

    function isDeletedRow(row) {
        return String(row.sync_action_type || "").indexOf("删除") > -1;
    }

    function makePerformanceAction(actionType, rowAction) {
        var text = actionType || "合同履行情况登记";
        if (text.indexOf("-新增") > -1 || text.indexOf("-修改") > -1 || text.indexOf("-删除") > -1) {
            text = text.replace(/-(新增|修改|删除).*$/, "");
        }
        return text + "-" + rowAction;
    }

    function isLaterRow(left, right) {
        var leftTime = left.sync_version_time || left.updateTime || left.createTime || "";
        var rightTime = right.sync_version_time || right.updateTime || right.createTime || "";
        if (leftTime !== rightTime) return leftTime > rightTime;
        return String(left.id || "") > String(right.id || "");
    }

    function normalizeRows(json) {
        if (!json) return [];
        var data = json.data || json;
        if (data.grid && data.grid.length !== undefined) return data.grid;
        if (data.valueList && data.valueList.length !== undefined) return data.valueList;
        if (data.length !== undefined) return data;
        return [];
    }

    function arrayToText(value) {
        if (!Array.isArray(value)) return value || "";
        var parts = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i] === null || value[i] === undefined) continue;
            if (typeof value[i] === "object") {
                parts.push(value[i].name || JSON.stringify(value[i]));
            } else {
                parts.push(String(value[i]));
            }
        }
        return parts.join(",");
    }

    function normalizeIdentityValue(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "").replace(/\s+/g, "").toUpperCase();
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

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
    }

    function hashText(text) {
        var hash = 0;
        var str = String(text || "");
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        if (hash < 0) hash = hash * -1;
        return hash.toString(36);
    }

    function escapeWhereValue(value) {
        return String(value || "").replace(/'/g, "''");
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
