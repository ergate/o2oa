var cmsAction = this.Actions.load("x_cms_assemble_control");
var queryAction = this.Actions.load("x_query_assemble_surface");
var STUDENT_TABLE_ID = "a3ba9d3f-097c-4b08-a25e-b7edc8a0a881";
var initializedStudentUuidMap = {};

// ==== 1. 抽离出的学员单据提取、平铺与插入逻辑 ====
var processDocument = function (docId) {
    cmsAction.DataAction.getWithDocument(
        docId,
        function (json) {
            var docData = json.data;
            if (!docData) return;

            // 1.2 检查是否有学员数组 (datatable)
            var dataTableRows = [];
            if (docData.datatable && Array.isArray(docData.datatable.data) && docData.datatable.data.length > 0) {
                dataTableRows = docData.datatable.data;
            }
            
            if (dataTableRows.length === 0) {
                print("=> [存量学员]：该项目 (" + docId + ") 无学员信息，跳过。");
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
            baseRecord.actualHours = parseFloat(docData.actualHours) || 0.0;
            baseRecord.actualNumber = parseInt(docData.actualNumber) || 0;

            // 生成追踪信息
            var now = new Date();
            var paddNum = function (num) { return (num < 10 ? "0" : "") + num; };
            var timeStr = now.getFullYear() + "-" + paddNum(now.getMonth() + 1) + "-" + paddNum(now.getDate()) + " " + paddNum(now.getHours()) + ":" + paddNum(now.getMinutes()) + ":" + paddNum(now.getSeconds());

            // --- 循环拆解子表并推送 ---
            for (var i = 0; i < dataTableRows.length; i++) {
                var dtRow = dataTableRows[i];
                var rowData = JSON.parse(JSON.stringify(baseRecord));

                rowData.student_name = dtRow.student_name || "";
                rowData.student_name_e = dtRow.student_name_e || dtRow.name_e || "";
                rowData.gender = dtRow.gender || "";
                rowData.idcard = dtRow.idcard || "";
                rowData.actualTrainingHours = parseInt(dtRow.actualTrainingHours) || 0;
                rowData.rate = parseFloat(dtRow.rate) || 0.0;
                
                rowData.isOK = (dtRow.isOK === "是" || dtRow.isOK === true || dtRow.isOK === "true");
                rowData.certificate_id = dtRow.certificate_id || "";
                rowData.beizhu = dtRow.beizhu || "";
                rowData.reason = dtRow.reason || dtRow.reasonForNoCert || "";
                
                rowData.document_id = docId;
                var rowNum = i + 1;
                if (dtRow.row_no) {
                    rowNum = dtRow.row_no;
                }

                // student_uid 是学员唯一主键，直接写入中间库 sync_uuid。
                // student_id/student_uuid 仅用于兼容已存在的旧隐藏字段；不要使用 O2OA 行对象自带 uid。
                // 如果源行仍未补 student_uid，才退回旧的“项目编号_行号”，并打印提示，方便后续补号。
                var studentUid = getStudentUid(dtRow);
                rowData.sync_uuid = studentUid || (rowData.project_id + "_" + rowNum);
                if (!studentUid) {
                    print("=> [存量学员]：源行缺少 student_uid，临时使用旧 sync_uuid。document_id=" + docId + "，行号=" + rowNum + "，sync_uuid=" + rowData.sync_uuid);
                }

                rowData.sync_action_type = "存量学员初始化";
                rowData.sync_version_time = timeStr;
                rowData.sync_status = "0";

                if (initializedStudentUuidMap[rowData.sync_uuid]) {
                    print("=> [存量学员]：本次初始化已处理，跳过重复源行。document_id=" + docId + "，学员=" + rowData.student_name + "，sync_uuid=" + rowData.sync_uuid);
                    continue;
                }
                initializedStudentUuidMap[rowData.sync_uuid] = true;

                insertStudentRow(docId, rowData);
            }

        }.bind(this),
        function (err) {
            print("=> 获取详情失败: " + docId);
        }.bind(this)
    );
}.bind(this);

function insertStudentRow(docId, rowData) {
    var where = "o.sync_uuid='" + escapeWhereValue(rowData.sync_uuid) + "'";
    queryAction.TableAction.listRowSelectWhere(
        STUDENT_TABLE_ID,
        where,
        function (json) {
            if (normalizeRows(json).length > 0) {
                print("=> [存量学员]：中间库已存在，跳过补录。document_id=" + docId + "，学员=" + rowData.student_name + "，sync_uuid=" + rowData.sync_uuid);
                return;
            }

            queryAction.TableAction.rowInsert(
                STUDENT_TABLE_ID,
                rowData,
                function (res) {
                    print("=> 成功补录: 存量学员 " + rowData.project_id + " [" + rowData.student_name + "] sync_uuid=" + rowData.sync_uuid);
                }.bind(this),
                function (err) {
                    print("=> 失败: 存量学员写入 " + docId + " [" + rowData.student_name + "] sync_uuid=" + rowData.sync_uuid + " - " + JSON.stringify(err));
                }.bind(this)
            );
        }.bind(this),
        function (err) {
            print("=> [存量学员]：查重失败，已跳过写入以避免重复。document_id=" + docId + "，学员=" + rowData.student_name + "，sync_uuid=" + rowData.sync_uuid + " - " + JSON.stringify(err));
        }.bind(this),
        false
    );
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

function getStudentUid(row) {
    if (!row) return "";
    if (isFilled(row.student_uid)) return trimText(row.student_uid);
    if (isFilled(row.student_id)) return trimText(row.student_id);
    if (isFilled(row.student_uuid)) return trimText(row.student_uuid);
    return "";
}

function isFilled(value) {
    return value !== null && value !== undefined && trimText(value) !== "";
}

function trimText(value) {
    return String(value || "").replace(/^\s+|\s+$/g, "");
}

// ==== 2. 批量拉取分页列表引擎 ====
var fetchPage = function (lastId) {
    var count = 50;
    var data = {
        "categoryIdList": ["c1eb692e-90d3-473c-bd73-2a63bba58320"],
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
                    print(">>> 所有符合条件的存量学员数据刷取指令下发完毕！");
                }
            } else {
                print(">>> 查询结束：未找到更多符合条件的项目存量学员。");
            }
        }.bind(this),
        function (json) {
            print("获取列表失败：" + JSON.stringify(json));
        }.bind(this)
    );
}.bind(this);

// ==== 3. 引擎点火启动 ====
print("=== 开始启动：继续教育学院【学员信息】存量数据初始化引擎 ===");
fetchPage("(0)");
