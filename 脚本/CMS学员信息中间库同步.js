(function (ctx) {
    // CMS 专用脚本：用于 CMS 文档提交事件、已发布状态下保存后事件。
    // 不要放到流程中使用；流程侧请使用“学员信息中间库同步.js”。
    // CMS 提交事件中 getWithDocument 可能读到上次保存值，本脚本只使用当前事件上下文 this.data。
    // 增量判断原则：
    // 1. 推荐在学员明细中增加隐藏列 student_uid，作为唯一可信、不可随业务字段修改而变化的学员行ID。
    // 2. 外籍学员无身份证、证书编号可能不存在、姓名也可能修正，因此这些字段只能用于存量过渡匹配。
    // 3. student_uid 直接对应中间库 sync_uuid，不额外写入 student_uid 字段，减少中间库和飞书表结构影响。
    var STUDENT_TABLE_ID = "a3ba9d3f-097c-4b08-a25e-b7edc8a0a881";
    var STUDENT_DIFF_FIELDS = [
        "student_name",
        "student_name_e",
        "gender",
        "idcard",
        "actualTrainingHours",
        "rate",
        "isOK",
        "certificate_id",
        "beizhu",
        "reason"
    ];

    var docInfo = getDocumentInfo();
    console.log(">>> CMS submit/save event fired, documentId=" + (docInfo.id || ""));

    var creatorUnitName = docInfo.creatorUnitName || "";
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
    var queryAction = ctx.Actions.load("x_query_assemble_surface");
    var baseRecord = buildBaseRecord(docData, docInfo);
    var timeStr = nowText();
    var actionType = docData.sync_action_type || "CMS学员信息提交/保存";

    loadLatestStudentRows(queryAction, docId, function (latestIndex) {
        var currentRows = buildCurrentRows(baseRecord, dataTableRows, docId, actionType, timeStr);
        var currentByUuid = {};
        var insertCount = 0;
        var deleteCount = 0;
        var unchangedCount = 0;

        for (var i = 0; i < currentRows.length; i++) {
            var current = currentRows[i];

            var latest = findLatestStudent(current, latestIndex, currentByUuid);
            if (latest && latest.sync_uuid && !current._student_uid) {
                // 缺少 student_uid 时才沿用旧内部ID；已有 student_uid 时 sync_uuid 必须与它保持一致。
                current.sync_uuid = latest.sync_uuid;
            }
            currentByUuid[current.sync_uuid] = current;
            if (latest && latest.sync_uuid) {
                currentByUuid[latest.sync_uuid] = current;
            }

            if (!latest || isDeletedRow(latest)) {
                current.sync_action_type = makeStudentAction(actionType, "新增");
                insertStudentRow(queryAction, current);
                insertCount++;
            } else if (hasStudentChanged(current, latest)) {
                current.sync_action_type = makeStudentAction(actionType, "修改");
                insertStudentRow(queryAction, current);
                insertCount++;
            } else {
                unchangedCount++;
            }
        }

        for (var uuid in latestIndex.byUuid) {
            if (!latestIndex.byUuid.hasOwnProperty(uuid) || currentByUuid[uuid] || isDeletedRow(latestIndex.byUuid[uuid])) continue;
            insertStudentRow(queryAction, buildDeletedRow(baseRecord, latestIndex.byUuid[uuid], docId, actionType, timeStr));
            deleteCount++;
        }

        if (insertCount === 0 && deleteCount === 0) {
            console.log("=> CMS学员信息未发生实质性变更，未追加中间库流水。document_id=" + docId + "，未变更学员数=" + unchangedCount);
        } else {
            console.log("=> CMS学员信息增量流水已追加：document_id=" + docId + "，新增/变更=" + insertCount + "，删除=" + deleteCount + "，未变更=" + unchangedCount);
        }
    }, function (err) {
        console.log("=> CMS学员同步中止：无法读取学员中间库历史流水，避免重复写入。错误：" + JSON.stringify(err));
    });

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
        record.creatorPerson = shortName(docInfo.creatorPerson || "");
        record.creatorUnit = shortName(docInfo.creatorUnitName || "");
        record.creatorTime = docInfo.createTime || docInfo.publishTime || "";
        record.project_id = docData.project_id || "";
        record.project_name = docData.project_name || "";
        record.project_type = docData.project_type || "";
        record.actualHours = parseFloat(docData.actualHours) || 0.0;
        record.actualNumber = parseInt(docData.actualNumber, 10) || 0;
        return record;
    }

    function buildCurrentRows(baseRecord, sourceRows, docId, actionType, timeStr) {
        var rows = [];
        for (var i = 0; i < sourceRows.length; i++) {
            rows.push(buildStudentRow(baseRecord, sourceRows[i], i, docId, actionType, timeStr));
        }
        return rows;
    }

    function buildStudentRow(baseRecord, sourceRow, index, docId, actionType, timeStr) {
        var rowData = clone(baseRecord);
        var rowNum = sourceRow.row_no || (index + 1);

        rowData._student_uid = sourceRow.student_uid || sourceRow.student_id || sourceRow.student_uuid || "";
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
        rowData._student_match_keys = buildStudentMatchKeys(rowData, rowNum);
        rowData.sync_uuid = buildSyncUuid(rowData.project_id, rowData._student_uid, rowData._student_match_keys);
        rowData.sync_action_type = actionType;
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";
        return rowData;
    }

    function buildDeletedRow(baseRecord, latestRow, docId, actionType, timeStr) {
        var rowData = clone(baseRecord);
        for (var i = 0; i < STUDENT_DIFF_FIELDS.length; i++) {
            var field = STUDENT_DIFF_FIELDS[i];
            rowData[field] = latestRow[field];
        }
        rowData.document_id = docId;
        rowData.sync_uuid = latestRow.sync_uuid;
        rowData._student_match_keys = buildStudentMatchKeys(rowData, "");
        rowData.sync_action_type = makeStudentAction(actionType, "删除");
        rowData.sync_version_time = timeStr;
        rowData.sync_status = "0";
        rowData.sync_error_msg = "";
        rowData.last_sync_time = "";
        return rowData;
    }

    function loadLatestStudentRows(queryAction, docId, success, failure) {
        var where = "o.document_id='" + escapeWhereValue(docId) + "'";
        queryAction.TableAction.listRowSelectWhere(
            STUDENT_TABLE_ID,
            where,
            function (json) {
                var rows = normalizeRows(json);
                // byUuid 用于最终判断哪些历史学员已从当前名单消失；byMatchKey 用于识别同一学员。
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

    function insertStudentRow(queryAction, rowData) {
        var insertData = clone(rowData);
        delete insertData._student_match_keys;
        delete insertData._student_uid;

        queryAction.TableAction.rowInsert(
            STUDENT_TABLE_ID,
            insertData,
            function () {
                console.log("=> 成功：CMS学员流水进入中间库。动作：" + rowData.sync_action_type + "，项目：" + rowData.project_id + "，学员：" + rowData.student_name);
            }.bind(ctx),
            function (err) {
                console.log("=> 错误：CMS学员中间库写入失败。动作：" + rowData.sync_action_type + "，项目：" + rowData.project_id + "，学员：" + rowData.student_name + "，错误：" + JSON.stringify(err));
            }.bind(ctx),
            false
        );
    }

    function findLatestStudent(current, latestIndex, usedByUuid) {
        // 按 student_uid、身份证号、证书编号、姓名组合、行号的顺序匹配；已匹配过的历史记录不能再被第二名学员复用。
        var keys = current._student_match_keys || [];
        for (var i = 0; i < keys.length; i++) {
            if (latestIndex.duplicateKeys[keys[i]]) continue;
            var latest = latestIndex.byMatchKey[keys[i]];
            if (latest && usedByUuid[latest.sync_uuid]) continue;
            if (latest) return latest;
        }
        return null;
    }

    function addLatestMatchKeys(latestIndex, row) {
        var keys = buildStudentMatchKeys(row, "");
        // 迁移后 sync_uuid 本身就是 student_uid；历史中间库没有 student_uid 字段时也能按它匹配。
        addMatchKey(keys, "uid", normalizeIdentityValue(row.sync_uuid));
        // 兼容存量流水的旧编号格式：项目编号_行号。只有缺少业务身份时才会退回使用。
        addMatchKey(keys, "row", extractLegacyRowNo(row));
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

    function buildStudentMatchKeys(row, rowNum) {
        // student_uid 是唯一可信主键；身份证、证书、姓名组合都可能缺失或变更，只做过渡；行号只作为最后兜底。
        var keys = [];
        addMatchKey(keys, "uid", normalizeIdentityValue(row._student_uid || row.student_uid));
        addMatchKey(keys, "idcard", normalizeIdentityValue(row.idcard));
        addMatchKey(keys, "cert", normalizeIdentityValue(row.certificate_id));

        var nameKey = normalizeIdentityValue(row.student_name) + "|" + normalizeIdentityValue(row.student_name_e) + "|" + normalizeIdentityValue(row.gender);
        if (nameKey !== "||") addMatchKey(keys, "name", nameKey);

        addMatchKey(keys, "row", rowNum ? String(rowNum) : "");
        return keys;
    }

    function addMatchKey(keys, type, value) {
        if (!value) return;
        keys.push(type + ":" + value);
    }

    function buildSyncUuid(projectId, studentUid, matchKeys) {
        var uid = normalizeText(studentUid);
        if (uid) return uid;
        return buildStableSyncUuid(projectId, chooseSyncUuidKey(matchKeys));
    }

    function buildStableSyncUuid(projectId, primaryKey) {
        var source = primaryKey || "row:unknown";
        var parts = source.split(":");
        var type = parts[0] || "key";
        return (projectId || "unknown_project") + "_" + type + "_" + hashText(source);
    }

    function chooseSyncUuidKey(keys) {
        // 缺少 student_uid 时才使用过渡键生成 sync_uuid，作为补号前的兜底。
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf("uid:") === 0 || keys[i].indexOf("idcard:") === 0 || keys[i].indexOf("cert:") === 0) return keys[i];
        }
        var nameKey = "";
        var rowKey = "";
        for (var j = 0; j < keys.length; j++) {
            if (keys[j].indexOf("name:") === 0) nameKey = keys[j];
            if (keys[j].indexOf("row:") === 0) rowKey = keys[j];
        }
        if (nameKey && rowKey) return nameKey + "|" + rowKey;
        return nameKey || rowKey || "row:unknown";
    }

    function extractLegacyRowNo(row) {
        var projectId = row.project_id || "";
        var syncUuid = row.sync_uuid || "";
        var prefix = projectId + "_";
        if (!projectId || syncUuid.indexOf(prefix) !== 0) return "";
        var tail = syncUuid.substring(prefix.length);
        return /^\d+$/.test(tail) ? tail : "";
    }

    function normalizeIdentityValue(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "").replace(/\s+/g, "").toUpperCase();
    }

    function normalizeText(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "");
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

    function hasStudentChanged(current, latest) {
        for (var i = 0; i < STUDENT_DIFF_FIELDS.length; i++) {
            var field = STUDENT_DIFF_FIELDS[i];
            if (normalizeValue(current[field], field) !== normalizeValue(latest[field], field)) return true;
        }
        return false;
    }

    function normalizeValue(value, field) {
        if (field === "isOK") return toBoolean(value) ? "true" : "false";
        if (field === "actualTrainingHours" || field === "rate") {
            var num = parseFloat(value);
            return String(isNaN(num) ? 0 : num);
        }
        if (value === null || value === undefined) return "";
        return String(value).replace(/^\s+|\s+$/g, "");
    }

    function isDeletedRow(row) {
        return String(row.sync_action_type || "").indexOf("删除") > -1;
    }

    function makeStudentAction(actionType, studentAction) {
        var text = actionType || "CMS学员信息提交/保存";
        if (text.indexOf("-新增") > -1 || text.indexOf("-修改") > -1 || text.indexOf("-删除") > -1) {
            text = text.replace(/-(新增|修改|删除).*$/, "");
        }
        return text + "-" + studentAction;
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

    function escapeWhereValue(value) {
        return String(value || "").replace(/'/g, "''");
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
