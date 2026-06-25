ensurePerformanceUid(this.data.datatable && this.data.datatable.data ? this.data.datatable.data : [], this.data.contract_id);

var newdata = {
    "datatable": this.data.datatable,
    "contractChanged": this.data.contractChanged,
    "defaultInfo": this.data.defaultInfo
};
var action = this.Actions.load("x_cms_assemble_control");
action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.document_id,//uri的参数
    newdata,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));

        // [业务追投]: CMS 履行情况文档已更新后，按 datatable 明细逐条追加合同履行情况中间库流水。
        this.data.sync_action_type = "合同履行情况登记";
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "合同履行情况中间库同步"
        });
    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this)
);
// var host=this.Actions.getHost("x_cms_assemble_control");
// print('host:'+host)
// 转存附件
this.workContext.getAttachmentList(false).map(function (item, index, arr) {
    var adddata = {
        "docId": this.data.document_id,
        "fileName": item.name,
        "fileUrl": 'https://fxl.nankai.edu.cn/x_processplatform_assemble_surface/jaxrs/attachment/download/' + item.id,
        "site": item.site
    }
    var action = this.Actions.load("x_cms_assemble_control");
    print("adddata:" + JSON.stringify(adddata));
    action.FileInfoAction.listFileInfoByDocumentId(//平台封装好的方法

        this.data.document_id,//uri的参数
        function (json) { //服务调用成功的回调函数, json为服务传回的数据
            fileInfodata = json.data; //为变量data赋值
            print("fileInfodata:" + JSON.stringify(fileInfodata));
            var count = fileInfodata.reduce(function (acc, file) {
                // 如果 "site" 的值等于目标值，则增加计数
                if (file.site === item.site) {
                    acc++;
                }
                return acc;
            }, 0);
            print("附件个数:" + count);
            if (count == 0) {
                action.FileInfoAction.uploadWithUrl(//平台封装好的方法
                    adddata,//body请求参数
                    function (json) { //服务调用成功的回调函数, json为服务传回的数据
                        print("upload成功:" + JSON.stringify(json));
                    }.bind(this),
                    function (json) { //服务调用失败的回调函数, json为服务传回的数据
                        print("upload失败:" + JSON.stringify(json));
                    }.bind(this)
                );
            }
        }.bind(this),
        function (json) { //服务调用失败的回调函数, json为服务传回的数据
            data = json.data; //为变量data赋值
        }.bind(this)
    );
}.bind(this));

function ensurePerformanceUid(rows, contractId) {
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
    }
}

function makePerformanceUid(contractId, projectId, used) {
    var prefix = safePart(contractId || "unknown_contract") + "_" + safePart(projectId || "unknown_project") + "_PERF_";
    var uid = "";
    do {
        uid = prefix + timestamp() + "_" + randomDigits(6);
    } while (used[uid]);
    return uid;
}

function firstFilled() {
    for (var i = 0; i < arguments.length; i++) {
        var value = trimText(arguments[i]);
        if (value !== "") return value;
    }
    return "";
}

function safePart(value) {
    return trimText(value).replace(/[^0-9A-Za-z_-]/g, "_") || "unknown";
}

function timestamp() {
    var d = new Date();
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + padMs(d.getMilliseconds());
}

function randomDigits(length) {
    var text = "";
    for (var i = 0; i < length; i++) {
        text += String(Math.floor(Math.random() * 10));
    }
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
