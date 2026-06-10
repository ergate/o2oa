(function(ctx) {
    var docId = ctx.data.document_id;
    var actionType = ctx.data.sync_action_type || "未知触发";
    
    if (!docId) {
        print("飞书学员同步异常：当前上下文未找到 document_id，中断同步。");
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
                print("=> 业务拦截：当前项目不包含“继续教育学院”标识，跳过学员信息自建表同步。拦截依据：[" + unitInfo + "]");
                return;
            }

            // 1.2 检查是否有学员数组 (datatable)
            var dataTableRows = [];
            if (docData.datatable && Array.isArray(docData.datatable.data) && docData.datatable.data.length > 0) {
                dataTableRows = docData.datatable.data;
            }
            
            if (dataTableRows.length === 0) {
                print("=> 业务提示：该项目 (" + docId + ") 尚未填写学员数据，无需同步学员中间库。");
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
            // 如果底层为字符串类型可以转换下，防止类型不匹配
            baseRecord.actualHours = parseFloat(docData.actualHours) || 0.0;
            baseRecord.actualNumber = parseInt(docData.actualNumber) || 0;

            // 生成追踪信息
            var now = new Date();
            var paddNum = function (num) { return (num < 10 ? "0" : "") + num; };
            var timeStr = now.getFullYear() + "-" + paddNum(now.getMonth() + 1) + "-" + paddNum(now.getDate()) + " " + paddNum(now.getHours()) + ":" + paddNum(now.getMinutes()) + ":" + paddNum(now.getSeconds());

            // --- 2. 开始拆分平铺学员列表 ---
            // 目标表：studentInfo (学员基本信息)
            var tableId = "a3ba9d3f-097c-4b08-a25e-b7edc8a0a881"; 
            var queryAction = ctx.Actions.load("x_query_assemble_surface");

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
                // [强制要求] sync_uuid 使用 项目ID_行号，以防止证书号尚未生成时的丢失
                var rowNum = i + 1;
                // 兼容有些 datatable 里面存在自带的 row_no 的情况
                if (dtRow.row_no) {
                    rowNum = dtRow.row_no;
                }
                rowData.sync_uuid = rowData.project_id + "_" + rowNum; 
                rowData.sync_action_type = actionType;
                rowData.sync_version_time = timeStr;
                rowData.sync_status = "0";

                queryAction.TableAction.rowInsert(
                    tableId,
                    rowData,
                    function(res) {
                        print("=> 成功: 学员/证书记录已进入中转库。项目：" + rowData.project_id + " - 学员：" + rowData.student_name);
                    }.bind(ctx),
                    function(err) {
                        print("=> 错误: 学员/证书中间库写入失败: " + JSON.stringify(err));
                    }.bind(ctx)
                );
            }

        }.bind(ctx),
        function (json) {
            print("学员信息同步中止：无法获取源表单详情。");
        }.bind(ctx)
    );

})(this);
