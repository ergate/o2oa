(function (ctx) {
    // 流程专用脚本：由合同审批流程最后环节调用，不要放到 CMS 保存事件中使用。
    // processData = ctx.data，是合同审批流程数据；只用于定位 CMS 文档、取得最终合同编号和触发动作。
    // cmsDocData = getWithDocument(document_id) 返回的合同 CMS 文档；合同业务字段以它为准。
    // 注意：CMS 合同文档中的 contract_id 可能仍是占位值，必须优先使用流程上下文中的最终合同编号。
    var CONTRACT_TABLE_ID = "8a701be3-3719-4eab-9db2-82723353cdf5";
    var CONTRACT_CATEGORY_ID = "2fb7d18f-60b0-4fb1-811e-2cbf516c8a31";

    var CONTRACT_FIELDS = [
        "accommodation",
        "accommodationCN",
        "client",
        "client_addr",
        "client_contacts",
        "client_fax",
        "client_phone",
        "client_unit",
        "college",
        "college_addr",
        "college_contacts",
        "college_fax",
        "college_phone",
        "contract_id",
        "contract_name",
        "contract_type",
        "copies1",
        "copies2",
        "copies3",
        "cost1",
        "cost2",
        "cost3",
        "creatorPerson",
        "creatorTime",
        "creatorUnit",
        "description",
        "document_id",
        "endingTime",
        "exceededNumber",
        "meals",
        "mealsCN",
        "openingTime",
        "others",
        "paymentDate1",
        "paymentDate2",
        "paymentDate3",
        "project_id",
        "project_name",
        "rate",
        "reason",
        "signing_location",
        "signing_time",
        "template",
        "totalTuition",
        "trainAddress",
        "traineesNumber",
        "tuition",
        "tuitionCN",
        "unitPrice"
    ];
    var INTEGER_FIELDS = {
        copies1: true,
        copies2: true,
        copies3: true,
        exceededNumber: true,
        paymentDate1: true,
        paymentDate2: true,
        paymentDate3: true,
        traineesNumber: true
    };
    var DOUBLE_FIELDS = {
        accommodation: true,
        meals: true,
        rate: true,
        totalTuition: true,
        tuition: true,
        unitPrice: true
    };

    if (!CONTRACT_TABLE_ID) {
        print("合同信息同步未执行：请先在脚本顶部填写 CONTRACT_TABLE_ID。");
        return;
    }

    var processData = ctx.data || {};
    var docId = processData.document_id || "";
    var actionType = processData.sync_action_type || "合同审批通过";
    if (!docId) {
        print("合同信息同步异常：当前上下文未找到 document_id，中断同步。");
        return;
    }

    var cmsAction = ctx.Actions.load("x_cms_assemble_control");
    cmsAction.DataAction.getWithDocument(
        docId,
        function (json) {
            var cmsDocData = json.data || {};
            if (cmsDocData.$document && cmsDocData.$document.categoryId && cmsDocData.$document.categoryId !== CONTRACT_CATEGORY_ID) {
                print("合同信息同步警告：document_id=" + docId + " 的 CMS 分类不是合同信息。categoryId=" + cmsDocData.$document.categoryId);
            }

            var record = buildContractRecord(cmsDocData, processData, docId, actionType);
            var queryAction = ctx.Actions.load("x_query_assemble_surface");
            queryAction.TableAction.rowInsert(
                CONTRACT_TABLE_ID,
                record,
                function () {
                    print("=> 成功：合同信息进入中间库。合同编号：" + record.contract_id + "，项目：" + record.project_id);
                }.bind(ctx),
                function (err) {
                    print("=> 错误：合同信息中间库写入失败。合同编号：" + record.contract_id + "，错误：" + JSON.stringify(err));
                }.bind(ctx),
                false
            );
        }.bind(ctx),
        function (err) {
            print("=> 合同信息同步中止：无法读取合同 CMS 文档。document_id=" + docId + "，错误：" + JSON.stringify(err));
        }.bind(ctx)
    );

    function buildContractRecord(cmsDocData, processData, docId, actionType) {
        var record = {};
        enrichCreatorFields(record, cmsDocData);

        for (var i = 0; i < CONTRACT_FIELDS.length; i++) {
            var field = CONTRACT_FIELDS[i];
            if (record[field] !== undefined) continue;
            if (cmsDocData[field] !== undefined) record[field] = normalizeFieldValue(field, cmsDocData[field]);
        }

        // 审批流程生成的合同编号优先级最高，用它覆盖 CMS 文档中的占位合同编号。
        record.contract_id = chooseContractId(processData.contract_id, cmsDocData.contract_id);
        record.contract_name = firstFilled(processData.contract_name, record.contract_name, cmsDocData.contract_name);
        record.project_id = firstFilled(processData.project_id, record.project_id, cmsDocData.project_id);
        record.project_name = firstFilled(processData.project_name, record.project_name, cmsDocData.project_name);
        // 补充协议流程中的 reason/description 来自流程表单，优先于 CMS 合同文档中的同名字段。
        record.reason = firstFilled(processData.reason, record.reason, cmsDocData.reason);
        record.description = firstFilled(processData.description, record.description, cmsDocData.description);
        record.document_id = docId;

        record.sync_uuid = meaningfulContractId(record.contract_id) ? record.contract_id : docId;
        record.sync_action_type = actionType;
        record.sync_version_time = nowText();
        record.sync_status = "0";
        record.sync_error_msg = "";
        record.last_sync_time = "";
        return record;
    }

    function enrichCreatorFields(record, cmsDocData) {
        if (!cmsDocData.$document) return;
        record.creatorPerson = shortName(cmsDocData.$document.creatorPerson || "");
        record.creatorUnit = shortName(cmsDocData.$document.creatorUnitName || "");
        record.creatorTime = cmsDocData.$document.createTime || cmsDocData.$document.publishTime || "";
    }

    function normalizeFieldValue(field, value) {
        if (field === "college_contacts") return personArrayToNames(value);
        if (INTEGER_FIELDS[field]) return toIntegerOrEmpty(value);
        if (DOUBLE_FIELDS[field]) return toDoubleOrEmpty(value);
        if (Array.isArray(value)) return arrayToText(value);
        return value === null || value === undefined ? "" : value;
    }

    function personArrayToNames(value) {
        if (!Array.isArray(value)) return value || "";
        var names = [];
        for (var i = 0; i < value.length; i++) {
            var item = value[i];
            if (item && typeof item === "object" && item.name) {
                names.push(item.name);
            } else if (typeof item === "string") {
                names.push(shortName(item));
            }
        }
        return names.join(",");
    }

    function arrayToText(value) {
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

    function chooseContractId(flowContractId, cmsContractId) {
        if (meaningfulContractId(flowContractId)) return trimText(flowContractId);
        if (meaningfulContractId(cmsContractId)) return trimText(cmsContractId);
        return trimText(flowContractId || cmsContractId || "");
    }

    function meaningfulContractId(value) {
        var text = trimText(value);
        return text !== "" && text !== "00000000000000";
    }

    function firstFilled() {
        for (var i = 0; i < arguments.length; i++) {
            var value = arguments[i];
            if (trimText(value) !== "") return value;
        }
        return "";
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
