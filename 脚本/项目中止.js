this.define("getFormateTime", function (date, format) {
    var paddNum = function (num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
    }
    //指定格式字符
    var cfg = {
        yyyy: date.getFullYear() //年 : 4位
        , yy: date.getFullYear().toString().substring(2)//年 : 2位
        , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
        , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        , d: date.getDate()
        , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
        , hh: paddNum(date.getHours())//时:如果1位的时候补0
        , mm: paddNum(date.getMinutes())//分:如果1位的时候补0
        , ss: paddNum(date.getSeconds())//秒:如果1位的时候补0
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function (m) { return cfg[m]; });
});

new_data = { "status": this.data.status, "stoptime": this.getFormateTime(new Date(), "yyyy-MM-dd hh:mm:ss") };
// this.data.add("buildtime",this.getFormateTime(new Date(),"yyyy-MM-dd hh:mm:ss"),true);
print(JSON.stringify(new_data));

var action = this.Actions.load("x_cms_assemble_control");
print(JSON.stringify(data));
action.DataAction.updateWithDocument(//平台封装好的方法
    this.data.document_id,//uri的参数
    new_data,//body请求参数
    function (json) { //服务调用成功的回调函数, json为服务传回的数据
        print(JSON.stringify(json));

        // [业务追投]: 触发飞书中转流水表记录
        this.data.sync_action_type = "中止";
        this.include({
            "type": "process",
            "application": "项目管理",
            "name": "项目信息中间库同步"
        });

    }.bind(this),
    function (json) { //服务调用失败的回调函数, json为服务传回的数据
        print(JSON.stringify(json));
    }.bind(this)
);


