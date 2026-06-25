/*
 * 每天定时执行本脚本，将本地中间库 sync_status = "0" 或 "2" 的记录同步到飞书多维表格。
 * 本脚本由 O2OA 定时任务触发；建议定时表达式在平台调度中配置为每天凌晨低峰期执行。
 */
(function (ctx) {
    var FEISHU = {
        appId: "cli_aa8c6479a4389cd6",
        appSecret: "XYUyOsR6hHVDWWMVZN4hUhBSBuYY4Xcx",
        appToken: "KkHNbaraQagGWLsqzuzcgIAInHh",
        maxBatchSize: 100,
        batchDelayMs: 500,
        batchRetryTimes: 3,
        batchRetryDelayMs: 1000,
        validateRemoteFields: false
    };

    var TABLES = [
        {
            name: "项目信息（公开招生）",
            localTableId: "d37c14de-a571-4661-be00-78888e8a8c9b",
            feishuTableId: "tbl7Kdt3FYu15Mih",
            fields: [
                f("creatorPerson", "录入人", "string"), f("creatorUnit", "所属学院", "string"), f("creatorTime", "录入时间", "dateTime"),
                f("project_id", "立项编号", "string"), f("project_name", "项目名字", "string"), f("isJoint", "是否合作办学", "boolean"),
                f("headPerson", "项目经办人", "string"), f("headMobile", "经办人联系电话", "string"), f("headPerson_org", "办学单位", "string"),
                f("forForeigner", "是否涉及境外、国外人员", "boolean"), f("forAbroad", "是否为非学历留学生教育项目", "boolean"),
                f("openingTime", "开班时间", "date"), f("endingTime", "结业时间", "date"), f("project_profile", "项目简介", "string"),
                f("target", "招生对象", "string"), f("tuitionStandard", "收费标准", "double"), f("swTS1", "是否有学费", "boolean"),
                f("swTS2", "是否有书本资料费", "boolean"), f("swTS3", "是否有证书费", "boolean"), f("swTS4", "是否有实验平台使用费", "boolean"),
                f("swTS5", "是否有拓展培训费", "boolean"), f("swTS6", "是否有食宿费", "boolean"), f("swTS7", "是否有交通费", "boolean"),
                f("swTS8", "是否有其他费用", "boolean"), f("costOther", "其他费用", "double"), f("trainingHours", "总学时（小时）", "double"),
                f("traineesNumber", "招生人数", "integer"), f("totalTuition", "收费总额（万元）", "double"), f("analysis", "社会承受能力分析", "string"),
                f("teacherfees", "师资费", "double"), f("managementfee", "教学管理费", "double"), f("sitecost", "场地费", "double"),
                f("onthespot", "拓展培训、现场教学费", "double"), f("accommodation", "食宿费", "double"), f("transportation", "交通费", "double"),
                f("materialfee", "书本资料费（含证书费）", "double"), f("platformfee", "实验平台使用费", "double"), f("othercost", "其他费用", "double"),
                f("totalTuition_1", "总计", "double"), f("shuoming", "说明", "string"), f("payment", "收费方式", "string"),
                f("bill_type", "票据类型", "string"), f("swLM1", "是否开启线下授课", "boolean"), f("trainingHours_1", "线下授课学时", "double"),
                f("schoolArea", "线下授课区域", "string"), f("trainAddress", "线下授课具体地址", "string"), f("swLM2", "是否开启线上授课", "boolean"),
                f("trainingHours_2", "线上授课学时", "double"), f("trainPlatform", "线上教学平台", "string"), f("swLM3", "是否开启现场教学", "boolean"),
                f("trainingHours_3", "现场教学学时", "double"), f("trainAddress_1", "现场教学地点", "string"), f("swCert1", "是否发放证书", "boolean"),
                f("swCert2", "发放证书是否要求出勤学时", "boolean"), f("certificateStandard_1", "发放证书标准（学时）", "double"),
                f("swCert3", "发放证书是否有其他要求", "boolean"), f("certificateStandard_2", "发放证书其他要求", "string"),
                f("publicity", "招生宣传方式", "string"), f("registration", "报名方式", "string"), f("contacts", "联系人", "string"),
                f("contact_info", "联系方式", "string"), f("approved_Date", "审核日期", "date"), f("approved_Meet", "审核会议", "string"),
                f("meet_name", "其他会议", "string"), f("project_type", "项目类型", "string"), f("keyword1", "关键字1", "string"),
                f("keyword2", "关键字2", "string"), f("keyword3", "关键字3", "string"), f("buildtime", "立项时间", "date"),
                f("closetime", "结项时间", "date"), f("stoptime", "中止时间", "date"), syncField("sync_uuid", "内部ID", "string"),
                syncField("sync_action_type", "触发源", "string"), syncField("sync_version_time", "触发时间点", "dateTime"),
                f("document_id", "源文档ID", "string")
            ]
        },
        {
            name: "项目信息（委托办学）",
            localTableId: "6b3c4bc8-371b-40ee-ac4a-887b42074885",
            feishuTableId: "tbl29nMAIHzhNdEi",
            fields: [
                f("creatorPerson", "录入人", "string"), f("creatorUnit", "所属学院", "string"), f("creatorTime", "录入时间", "dateTime"),
                f("project_id", "项目编号", "string"), f("isJoint", "是否合作办学", "boolean"), f("project_name", "项目名称", "string"),
                f("headPerson", "项目经办人", "string"), f("headMobile", "经办人联系电话", "string"), f("headPerson_org", "办学单位", "string"),
                f("client", "委托单位", "string"), f("haveContract", "是否已经签署合同", "boolean"), f("contract_id", "合同编号", "string"),
                f("contract_name", "合同名字", "string"), f("forForeigner", "是否涉及境外、国外人员", "boolean"),
                f("forAbroad", "是否为非学历留学生教育项目", "boolean"), f("trainees", "学员构成", "string"),
                f("traineesOther", "其他学员构成", "string"), f("trainPurpose", "教育重点", "string"), f("openingTime", "计划开班时间", "date"),
                f("endingTime", "计划结业时间", "date"), f("trainingHours", "总学时（小时）", "double"),
                f("traineesNumber", "参与学习人数（人）", "integer"), f("totalTuition", "学费总额（元）", "double"), f("tuitionStandard", "收费标准", "double"),
                f("swLM1", "是否开启线下授课", "boolean"),
                f("trainingHours_1", "线下授课学时", "double"), f("schoolArea", "线下授课地区", "string"),
                f("trainAddress", "线下授课具体地址", "string"), f("swLM2", "是否开启线上授课", "boolean"),
                f("trainingHours_2", "线上授课学时", "double"), f("trainPlatform", "线上授课平台", "string"),
                f("swLM3", "是否开启现场教学", "boolean"), f("trainingHours_3", "现场教学学时", "double"),
                f("trainAddress_1", "现场教学地点", "string"), f("swCert1", "是否发放证书", "boolean"),
                f("swCert2", "证书发放是否要求出勤学时", "boolean"), f("certificateStandard_1", "证书发放出勤学时", "double"),
                f("swCert3", "证书发放是否有其他要求", "boolean"), f("certificateStandard_2", "证书发放其他要求", "string"),
                f("keyword1", "关键字1", "string"), f("keyword2", "关键字2", "string"), f("keyword3", "关键字3", "string"),
                f("client_id", "客户编号", "string"), f("buildtime", "立项时间", "date"), f("project_type", "项目类型", "string"),
                f("client_province", "客户所属省份", "string"), f("closetime", "结项时间", "date"), f("stoptime", "中止时间", "date"),
                syncField("sync_uuid", "内部ID", "string"), syncField("sync_action_type", "触发源", "string"),
                syncField("sync_version_time", "触发时间点", "dateTime"), f("document_id", "源文档ID", "string")
            ]
        },
        {
            name: "学员基本信息",
            localTableId: "a3ba9d3f-097c-4b08-a25e-b7edc8a0a881",
            feishuTableId: "tbl26RF3cL5zlUx5",
            fields: [
                f("creatorPerson", "录入人", "string"), f("creatorUnit", "所属学院", "string"), f("creatorTime", "录入时间", "dateTime"),
                f("project_id", "立项编号", "string"), f("project_name", "项目名称", "string"), f("project_type", "项目类型", "string"),
                f("actualHours", "实际培训学时", "double"), f("actualNumber", "实际参训人数", "integer"), f("student_name", "姓名", "string"),
                f("student_name_e", "护照姓名", "string"), f("gender", "性别", "string"), f("idcard", "身份证号", "string"),
                f("actualTrainingHours", "实际出勤课时", "double"), f("rate", "出勤率%", "double"), f("isOK", "是否发证", "boolean"),
                f("certificate_id", "证书编号", "string"), f("beizhu", "备注", "string"), f("reason", "未领证书情况说明", "string"),
                syncField("sync_uuid", "内部ID", "string"), syncField("sync_action_type", "触发源", "string"),
                syncField("sync_version_time", "触发时间点", "dateTime"), f("document_id", "源文档ID", "string")
            ]
        },
        {
            name: "课表基本信息",
            localTableId: "e4e890e0-2c23-4e40-88de-1db1f8aee936",
            feishuTableId: "tbl2373BzAcLxbS9",
            fields: [
                f("creatorPerson", "录入人", "string"), f("creatorUnit", "所属学院", "string"), f("creatorTime", "录入时间", "dateTime"),
                f("project_id", "立项编号", "string"), f("project_name", "项目名称", "string"), f("project_type", "项目类型", "string"),
                f("course_id", "课程编号", "string"), f("course_name", "课程名字", "string"), f("course_type", "课程类别", "string"),
                f("course_hours", "课时", "double"), f("teacher_type", "教师类别", "string"), f("teacher_id", "教师编号", "string"),
                f("teacher_name", "教师名字", "string"), f("feeStd", "师资标准", "string"), f("teacher_title", "职称", "string"),
                f("teacher_unit", "单位", "string"), f("warning", "风险提示", "string"), f("timetable_id", "课表ID", "string"),
                syncField("sync_uuid", "内部ID", "string"), syncField("sync_action_type", "触发源", "string"),
                syncField("sync_version_time", "触发时间点", "dateTime"), f("document_id", "源文档ID", "string")
            ]
        }
    ];

    var queryAction = ctx.Actions.load("x_query_assemble_surface");

    function f(name, label, type) {
        return { name: name, label: label, type: type, candidates: [label, name] };
    }

    function syncField(name, label, type) {
        var candidates = [label, name];
        if (name === "sync_version_time") candidates = ["同步时间", "触发时间点", name];
        if (name === "sync_status") candidates = ["数据状态", "同步状态", name];
        if (name === "last_sync_time") candidates = ["最终同步时间", "同步完成时间", name];
        return { name: name, label: label, type: type, candidates: candidates };
    }

    function nowText() {
        var d = new Date();
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }

    function pad(num) {
        return (num < 10 ? "0" : "") + num;
    }

    function sleep(ms) {
        if (!ms || ms <= 0) return;
        javaType("java.lang.Thread").sleep(ms);
    }

    function urlPathEncode(value) {
        if (typeof encodeURIComponent === "function") return encodeURIComponent(value);
        return String(javaType("java.net.URLEncoder").encode(String(value), "UTF-8")).replace(/\+/g, "%20");
    }

    function normalizeRows(json) {
        if (!json) return [];
        var data = json.data || json;
        if (data.grid && data.grid.length !== undefined) return data.grid;
        if (data.valueList && data.valueList.length !== undefined) return data.valueList;
        if (data.length !== undefined) return data;
        return [];
    }

    function dataStatus(row, table) {
        var action = row.sync_action_type || "";
        if (action.indexOf("删除") > -1) return "删除";
        if (table && table.name === "学员基本信息") {
            if (action.indexOf("-新增") > -1) return "新增";
            if (action.indexOf("-修改") > -1) return "修改";
            if (action.indexOf("-删除") > -1) return "删除";
            if (action.indexOf("发证申请") > -1) return "发证申请";
            if (action.indexOf("证书信息变更") > -1) return "证书信息变更";
            if (action.indexOf("CMS修改保存") > -1 || action.indexOf("修改保存") > -1) return "修改";
            if (action.indexOf("CMS提交") > -1 || action.indexOf("提交") > -1) return "新建";
            if (action.indexOf("CMS学员信息提交/保存") > -1 || action.indexOf("保存") > -1) return "修改";
            return action || "修改";
        }
        if (action.indexOf("变更") > -1) return "变更";
        if (action.indexOf("结项") > -1) return "结项";
        if (action.indexOf("中止") > -1) return "中止";
        return "新建";
    }

    function convertValue(value, type, row) {
        if (value === undefined || value === null) return null;
        if (type === "date" || type === "dateTime") return toTimestamp(value);
        if (type === "integer") {
            var i = parseInt(value, 10);
            return isNaN(i) ? null : i;
        }
        if (type === "double") {
            var n = parseFloat(value);
            return isNaN(n) ? null : n;
        }
        if (type === "boolean") {
            return (value === true || value === "true" || value === "是" || value === "1" || value === 1) ? "是" : "否";
        }
        if (type === "string" || type === "stringLob") {
            if (value instanceof Array) return value.join(",");
            if (typeof value === "object") return JSON.stringify(value);
            return String(value);
        }
        return value;
    }

    function toTimestamp(value) {
        if (typeof value === "number") return value;
        var s = String(value);
        if (!s) return null;
        var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (m) {
            var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), parseInt(m[4] || "0", 10), parseInt(m[5] || "0", 10), parseInt(m[6] || "0", 10));
            return d.getTime();
        }
        var parsed = new Date(s);
        return isNaN(parsed.getTime()) ? null : parsed.getTime();
    }

    function chooseRemoteName(def, remoteNameMap) {
        for (var i = 0; i < def.candidates.length; i++) {
            if (remoteNameMap[def.candidates[i]]) return def.candidates[i];
        }
        return null;
    }

    function buildRecord(row, table, remoteNameMap) {
        var fields = {};
        var used = {};
        var defined = {};
        for (var i = 0; i < table.fields.length; i++) {
            var def = table.fields[i];
            defined[def.name] = true;
            var remoteName = chooseRemoteName(def, remoteNameMap);
            if (!remoteName) continue;

            var raw = def.name === "sync_status" ? dataStatus(row, table) : row[def.name];
            used[def.name] = true;
            var value = convertValue(raw, def.type, row);
            if (value === null || value === undefined) continue;
            fields[remoteName] = value;
        }

        for (var key in row) {
            if (!row.hasOwnProperty(key) || used[key] || defined[key] || isSystemField(key) || !remoteNameMap[key]) continue;
            var v = row[key];
            if (v === null || v === undefined) continue;
            fields[key] = typeof v === "object" ? JSON.stringify(v) : v;
        }
        return { fields: fields };
    }

    function isSystemField(key) {
        return key === "id" || key === "sequence" || key === "createTime" || key === "updateTime";
    }

    function isUnmodifiableField(key) {
        return key === "id" || key === "sequence" || key === "createTime" || key === "updateTime" || key === "distributeFactor";
    }

    function buildStatusUpdateRow(row, status, errorMsg) {
        var data = {};
        for (var key in row) {
            if (!row.hasOwnProperty(key) || isUnmodifiableField(key)) continue;
            data[key] = row[key];
        }
        data.sync_status = status;
        data.sync_error_msg = errorMsg || "";
        data.last_sync_time = nowText();
        return data;
    }

    function chunkRows(rows, size) {
        var chunks = [];
        for (var i = 0; i < rows.length; i += size) chunks.push(rows.slice(i, i + size));
        return chunks;
    }

    function javaType(name) {
        if (typeof Java !== "undefined" && Java.type) return Java.type(name);
        var parts = name.split(".");
        var current = Packages;
        for (var i = 0; i < parts.length; i++) current = current[parts[i]];
        return current;
    }

    function headerList(headers) {
        var ArrayList = javaType("java.util.ArrayList");
        var NameValuePair = javaType("com.x.base.core.project.bean.NameValuePair");
        var list = new ArrayList();
        for (var h in headers) {
            if (headers.hasOwnProperty(h)) list.add(new NameValuePair(h, String(headers[h])));
        }
        return list;
    }

    function readHttpBody(connection, status) {
        var IOUtils = javaType("org.apache.commons.io.IOUtils");
        var StandardCharsets = javaType("java.nio.charset.StandardCharsets");
        var input = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        if (!input) return "";
        try {
            return String(IOUtils.toString(input, StandardCharsets.UTF_8));
        } finally {
            try { input.close(); } catch (ignore) { }
        }
    }

    function requestByHttpConnection(method, url, bodyText, headers) {
        var HttpConnection = javaType("com.x.base.core.project.connection.HttpConnection");
        var HttpConnectionResponse = javaType("com.x.base.core.project.connection.HttpConnectionResponse");
        var list = headerList(headers);
        var supplier = function (connection) {
            var response = new HttpConnectionResponse();
            var status = connection.getResponseCode();
            response.setResponseCode(status);
            response.setBody(readHttpBody(connection, status));
            return response;
        };

        if (method === "GET") return HttpConnection.get(url, list, 30000, 60000, supplier);
        if (method === "POST") return HttpConnection.post(url, list, bodyText, 30000, 60000, supplier);
        if (method === "PUT") return HttpConnection.put(url, list, bodyText, 30000, 60000, supplier);
        if (method === "DELETE") return HttpConnection.delete(url, list, 30000, 60000, supplier);
        throw new Error("Unsupported HTTP method: " + method);
    }

    function httpRequest(method, url, body, headers) {
        var requestHeaders = { "Content-Type": "application/json; charset=utf-8" };
        for (var h in headers) {
            if (headers.hasOwnProperty(h)) requestHeaders[h] = headers[h];
        }

        var bodyText = "";
        if (body !== null && body !== undefined) {
            bodyText = typeof body === "string" ? body : JSON.stringify(body);
        }

        var res;
        try {
            res = requestByHttpConnection(String(method).toUpperCase(), url, bodyText, requestHeaders);
        } catch (e) {
            throw new Error("HTTP request failed: " + method + " " + url + " - " + String(e.message || e));
        }
        if (!res) throw new Error("HTTP request returned empty response: " + method + " " + url);

        var text = res.body ? String(res.body) : "";
        var json = {};
        if (text) {
            try {
                json = JSON.parse(text);
            } catch (e) {
                throw new Error("HTTP response is not JSON: " + method + " " + url + " status=" + res.responseCode + " body=" + text.substr(0, 500));
            }
        }
        if (res.responseCode < 200 || res.responseCode >= 300) {
            throw new Error("HTTP response error: " + method + " " + url + " status=" + res.responseCode + " body=" + text.substr(0, 2000));
        }
        return { status: res.responseCode, body: json };
    }

    function getTenantToken() {
        var res = httpRequest("POST", "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
            app_id: FEISHU.appId,
            app_secret: FEISHU.appSecret
        }, {});
        if (res.body.code !== 0) throw new Error("获取 tenant_access_token 失败：" + JSON.stringify(res.body));
        return res.body.tenant_access_token;
    }

    function getRemoteFields(token, table) {
        if (!FEISHU.validateRemoteFields) return configuredFieldMap(table);

        var fields = {};
        var pageToken = "";
        do {
            var url = "https://open.feishu.cn/open-apis/bitable/v1/apps/" + FEISHU.appToken + "/tables/" + table.feishuTableId + "/fields?page_size=20";
            if (pageToken) url += "&page_token=" + encodeURIComponent(pageToken);
            var res = httpRequest("GET", url, null, { Authorization: "Bearer " + token });
            if (res.body.code !== 0) throw new Error("获取飞书字段失败：" + table.name + " - " + JSON.stringify(res.body));
            var items = (res.body.data && res.body.data.items) ? res.body.data.items : [];
            for (var i = 0; i < items.length; i++) fields[items[i].field_name] = true;
            pageToken = res.body.data && res.body.data.has_more ? res.body.data.page_token : "";
        } while (pageToken);
        return fields;
    }

    function configuredFieldMap(table) {
        var fields = {};
        for (var i = 0; i < table.fields.length; i++) {
            fields[table.fields[i].label] = true;
            fields[table.fields[i].name] = true;
        }
        return fields;
    }

    function batchCreate(token, table, records) {
        var url = "https://open.feishu.cn/open-apis/bitable/v1/apps/" + FEISHU.appToken + "/tables/" + table.feishuTableId + "/records/batch_create?ignore_consistency_check=true";
        var res = httpRequest("POST", url, { records: records }, { Authorization: "Bearer " + token });
        if (res.body.code !== 0) throw new Error("飞书批量新增失败：" + table.name + " - " + JSON.stringify(res.body));
        return res.body;
    }

    function fieldNames(record) {
        var names = [];
        for (var key in record.fields) {
            if (record.fields.hasOwnProperty(key)) names.push(key);
        }
        return names.join(",");
    }

    function rowFlag(row) {
        return row.sync_uuid || row.project_id || row.document_id || row.id || "";
    }

    function batchCreateWithRetry(token, table, records) {
        var lastError;
        for (var attempt = 0; attempt <= FEISHU.batchRetryTimes; attempt++) {
            try {
                return batchCreate(token, table, records);
            } catch (e) {
                lastError = e;
                if (attempt >= FEISHU.batchRetryTimes) break;
                var delay = FEISHU.batchRetryDelayMs * (attempt + 1);
                print("=> " + table.name + "：批量同步失败，" + delay + "ms 后重试第 " + (attempt + 1) + " 次。原因：" + String(e.message || e));
                sleep(delay);
            }
        }
        throw lastError;
    }

    function syncPayloadChunk(token, table, sourceChunk, payloadChunk) {
        try {
            batchCreateWithRetry(token, table, payloadChunk);
            markRows(table, sourceChunk, "1", "");
            print("=> " + table.name + "：成功批量同步 " + sourceChunk.length + " 条。");
            return;
        } catch (batchError) {
            print("=> " + table.name + "：批量重试后仍失败，降级逐条同步。原因：" + String(batchError.message || batchError));
        }

        for (var i = 0; i < payloadChunk.length; i++) {
            try {
                batchCreate(token, table, [payloadChunk[i]]);
                markRows(table, [sourceChunk[i]], "1", "");
                print("=> " + table.name + "：逐条同步成功：" + rowFlag(sourceChunk[i]));
            } catch (singleError) {
                var fullMsg = String(singleError.message || singleError) + "；本条字段：" + fieldNames(payloadChunk[i]);
                markRows(table, [sourceChunk[i]], "2", fullMsg);
                print("=> " + table.name + "：逐条同步失败：" + rowFlag(sourceChunk[i]) + " - " + fullMsg);
            }
        }
    }

    function markRows(table, rows, status, errorMsg) {
        for (var i = 0; i < rows.length; i++) {
            if (!rows[i].id) continue;
            queryAction.TableAction.rowUpdate(
                table.localTableId,
                rows[i].id,
                buildStatusUpdateRow(rows[i], status, errorMsg),
                function () { },
                function (err) {
                    print("=> 本地中间库状态回写失败：" + table.name + " - " + JSON.stringify(err));
                },
                false
            );
        }
    }

    function syncTable(token, table, done) {
        var where = "o.sync_status='0' or o.sync_status='2'";
        queryAction.TableAction.listRowSelectWhere(
            table.localTableId,
            urlPathEncode(where),
            function (json) {
                var rows = normalizeRows(json);
                if (!rows.length) {
                    print("=> " + table.name + "：无待同步记录。");
                    done();
                    return;
                }

                try {
                    var remoteNameMap = getRemoteFields(token, table);
                    var chunks = chunkRows(rows, FEISHU.maxBatchSize);
                    for (var i = 0; i < chunks.length; i++) {
                        var sourceChunk = chunks[i];
                        var payloadRows = [];
                        var payload = [];
                        for (var j = 0; j < sourceChunk.length; j++) {
                            var record = buildRecord(sourceChunk[j], table, remoteNameMap);
                            if (Object.keys(record.fields).length > 0) {
                                payloadRows.push(sourceChunk[j]);
                                payload.push(record);
                            }
                        }

                        if (!payload.length) {
                            markRows(table, sourceChunk, "2", "飞书目标表没有匹配字段，未生成有效 payload");
                            continue;
                        }

                        syncPayloadChunk(token, table, payloadRows, payload);
                        if (i < chunks.length - 1) sleep(FEISHU.batchDelayMs);
                    }
                } catch (e) {
                    markRows(table, rows, "2", String(e.message || e));
                    print("=> " + table.name + "：同步失败：" + String(e.message || e));
                }
                done();
            }.bind(ctx),
            function (err) {
                print("=> 查询本地中间库失败：" + table.name + " - " + JSON.stringify(err));
                done();
            }.bind(ctx),
            false
        );
    }

    function run(index, token) {
        if (index >= TABLES.length) {
            print("=== 飞书多维表格定时同步结束 ===");
            return;
        }
        syncTable(token, TABLES[index], function () {
            run(index + 1, token);
        });
    }

    try {
        print("=== 飞书多维表格定时同步开始：" + nowText() + " ===");
        run(0, getTenantToken());
    } catch (e) {
        print("=> 飞书同步任务启动失败：" + String(e.message || e));
    }
})(this);
