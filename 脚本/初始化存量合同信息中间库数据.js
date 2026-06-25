// 一次性维护脚本：将继续教育学院创建、已审批通过且有正式合同ID的 CMS 合同信息初始化到合同信息中间库。
// 本脚本只追加“存量合同初始化”流水，不更新、不删除已有中间库记录；重复执行会重复插入。

(function (ctx) {
    var cmsAction = ctx.Actions.load("x_cms_assemble_control");
    var queryAction = ctx.Actions.load("x_query_assemble_surface");

    var CONTRACT_TABLE_ID = "8a701be3-3719-4eab-9db2-82723353cdf5";
    var CONFIG = {
        pageSize: 50,
        categoryIdList: ["2fb7d18f-60b0-4fb1-811e-2cbf516c8a31"],
        creatorUnitNameList: ["继续教育学院@NK00131@U"]
    };
    var CONTRACT_FIELDS = [
        "accommodation", "accommodationCN", "client", "client_addr", "client_contacts", "client_fax",
        "client_phone", "client_unit", "college", "college_addr", "college_contacts", "college_fax",
        "college_phone", "contract_id", "contract_name", "contract_type", "copies1", "copies2", "copies3",
        "cost1", "cost2", "cost3", "creatorPerson", "creatorTime", "creatorUnit", "description",
        "document_id", "endingTime", "exceededNumber", "meals", "mealsCN", "openingTime", "others",
        "paymentDate1", "paymentDate2", "paymentDate3", "project_id", "project_name", "rate", "reason",
        "signing_location", "signing_time", "template", "totalTuition", "trainAddress", "traineesNumber",
        "tuition", "tuitionCN", "unitPrice"
    ];
    var INTEGER_FIELDS = {
        copies1: true, copies2: true, copies3: true, exceededNumber: true,
        paymentDate1: true, paymentDate2: true, paymentDate3: true, traineesNumber: true
    };
    var DOUBLE_FIELDS = {
        accommodation: true, meals: true, rate: true, totalTuition: true, tuition: true, unitPrice: true
    };
    var processedDocs = {};

    print("=== 开始初始化存量合同信息中间库数据 ===");
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
                    print("=== 存量合同信息初始化完成 ===");
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
                    print("=== 存量合同信息初始化完成 ===");
                }
            }.bind(ctx),
            function (err) {
                print("=> 查询 CMS 合同信息失败：" + JSON.stringify(err));
            }.bind(ctx)
        );
    }

    function processDocument(docId) {
        cmsAction.DataAction.getWithDocument(
            docId,
            function (json) {
                var docData = json.data || {};
                if (!isApprovedPublished(docData)) {
                    print("=> 跳过：合同 CMS 文档未发布或未审批通过。document_id=" + docId);
                    return;
                }
                if (!meaningfulContractId(docData.contract_id)) {
                    print("=> 跳过：合同没有正式合同ID。document_id=" + docId + "，contract_id=" + (docData.contract_id || ""));
                    return;
                }

                var record = buildContractRecord(docData, docId);
                queryAction.TableAction.rowInsert(
                    CONTRACT_TABLE_ID,
                    record,
                    function () {
                        print("=> 成功补录：存量合同信息。contract_id=" + record.contract_id + "，document_id=" + docId);
                    }.bind(ctx),
                    function (err) {
                        print("=> 失败：存量合同信息写入中间库。document_id=" + docId + "，错误：" + JSON.stringify(err));
                    }.bind(ctx),
                    false
                );
            }.bind(ctx),
            function (err) {
                print("=> 读取 CMS 合同信息失败。document_id=" + docId + "，错误：" + JSON.stringify(err));
            }.bind(ctx)
        );
    }

    function buildContractRecord(docData, docId) {
        var record = {};
        enrichCreatorFields(record, docData);
        for (var i = 0; i < CONTRACT_FIELDS.length; i++) {
            var field = CONTRACT_FIELDS[i];
            if (record[field] !== undefined) continue;
            if (docData[field] !== undefined) record[field] = normalizeFieldValue(field, docData[field]);
        }
        record.document_id = docId;
        record.contract_id = trimText(docData.contract_id);
        record.sync_uuid = record.contract_id;
        record.sync_action_type = "存量合同初始化";
        record.sync_version_time = nowText();
        record.sync_status = "0";
        record.sync_error_msg = "";
        record.last_sync_time = "";
        return record;
    }

    function enrichCreatorFields(record, docData) {
        if (!docData.$document) return;
        record.creatorPerson = shortName(docData.$document.creatorPerson || "");
        record.creatorUnit = shortName(docData.$document.creatorUnitName || "");
        record.creatorTime = docData.$document.createTime || docData.$document.publishTime || "";
    }

    function normalizeFieldValue(field, value) {
        if (field === "college_contacts") return personArrayToNames(value);
        if (INTEGER_FIELDS[field]) return toIntegerOrEmpty(value);
        if (DOUBLE_FIELDS[field]) return toDoubleOrEmpty(value);
        if (Array.isArray(value)) return arrayToText(value);
        return value === null || value === undefined ? "" : value;
    }

    function isApprovedPublished(docData) {
        if (!docData.$document) return true;
        return docData.$document.docStatus === "published" && docData.$document.reviewed !== false;
    }

    function meaningfulContractId(value) {
        var text = trimText(value);
        return text !== "" && text !== "00000000000000";
    }

    function personArrayToNames(value) {
        if (!Array.isArray(value)) return value || "";
        var names = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i] && typeof value[i] === "object" && value[i].name) names.push(value[i].name);
            else if (typeof value[i] === "string") names.push(shortName(value[i]));
        }
        return names.join(",");
    }

    function arrayToText(value) {
        var parts = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i] === null || value[i] === undefined) continue;
            if (typeof value[i] === "object") parts.push(value[i].name || JSON.stringify(value[i]));
            else parts.push(String(value[i]));
        }
        return parts.join(",");
    }

    function toIntegerOrEmpty(value) {
        if (trimText(value) === "") return "";
        var num = parseInt(value, 10);
        return isNaN(num) ? "" : num;
    }

    function toDoubleOrEmpty(value) {
        if (trimText(value) === "") return "";
        var num = parseFloat(value);
        return isNaN(num) ? "" : num;
    }

    function nowText() {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
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
