this.define("toChinesNum", function (money) {
    //汉字的数字
    var cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    //基本单位
    var cnIntRadice = ["", "拾", "佰", "仟"];
    //对应整数部分扩展单位
    var cnIntUnits = ["", "万", "亿", "兆"];
    //对应小数部分单位
    var cnDecUnits = ["角", "分", "毫", "厘"];
    //整数金额时后面跟的字符
    var cnInteger = "元";
    //输出的中文金额字符串
    var cnMoney = "";
    //小数部分
    var cnDec = "";
    //分离金额后用的数组，预定义
    var parts;
    if (money == "") {
        return "";
    }
    money = parseFloat(money);
    if (money >= 999999999999.99) {
        return "超出范围值";
    }
    if (money == 0) {
        cnMoney = cnNums[0] //+ cnInteger;
        return cnMoney;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf(".") == -1) {
        parts = [money, ""];
    } else {
        parts = money.split(".");
    }
    //整数部分
    var integerNum = parts[0];
    //小数部分
    var decimalNum = parts[1];
    //小数部分去0
    if (decimalNum == "0") {
        cnDec = cnNums[0];
    } else {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var dec = decimalNum.substr(i, 1);
            if (dec != "0") {
                cnDec += cnNums[Number(dec)] //+ cnDecUnits[i];
            }
        }
    }
    //整数部分处理
    var intLen = integerNum.length;
    for (var i = 0; i < intLen; i++) {
        var num = integerNum.substr(i, 1);
        var p = intLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (num == "0") {
            if (m == 0 && cnMoney.indexOf(cnIntUnits[q]) == -1) {
                cnMoney += cnIntUnits[q];
            }
        } else {
            var cnChar = cnNums[parseInt(num)];
            cnMoney += cnChar;
            cnMoney += cnIntRadice[m];
            if (m == 0 && q > 0) {
                cnMoney += cnIntUnits[q];
            }
        }
    }
    // cnMoney += cnInteger + cnDec;
    if (cnDec != "") {
        cnMoney += "点" + cnDec;
    }
    return cnMoney;
});

this.define("getTitle", function (titles, titles_sequence) {
    var title_list = {
        "高等学校教师": {
            "正高级": "教授",
            "副高级": "副教授",
            "中级": "讲师",
            "初级": "助教",
            "未定": "-"
        },
        "研究员": {
            "正高级": "研究员",
            "副高级": "副研究员",
            "中级": "助理研究员",
            "初级": "研究实习员",
            "未定": "-"
        },
        "政工师": {
            "正高级": "高级政工师",
            "副高级": "中级政工师",
            "中级": "助理政工师",
            "初级": "政工员",
            "未定": "-"
        },
        "工程技术人员": {
            "正高级": "正高级工程师",
            "副高级": "高级工程师",
            "中级": "工程师",
            "初级": "助理工程师",
            "未定": "技术员"
        },
        "专业技术职务": {
            "正高级": "正高级工程师",
            "副高级": "高级工程师",
            "中级": "工程师",
            "初级": "助理工程师",
            "未定": "技术员"
        },
        "其他": {
            "正高级": "正高级",
            "副高级": "副高级",
            "中级": "中级",
            "初级": "初级",
            "未定": "未定"
        }
    };
    return title_list[titles_sequence][titles];
});
this.define("getReaderUnitNameList1", function (creatorUnitName) {
    // 获取子单元列表并提取 readerUnitName
    let readerUnitNameList = this.org.listSubUnit(creatorUnitName, false).map(subUnit => subUnit.distinguishedName);

    // 在列表中添加 "南开大学终身学习教育管理办公室@NK00001@U"
    readerUnitNameList.push("南开大学终身学习教育管理办公室@NK00001@U");

    // 返回结果
    return readerUnitNameList;
});


this.define("selectTeacher", function () {
    var view_name = '';
    if (this.data.teacher_type == "") {
        alert("请先选择教师分类");
        return;
    }
    switch (this.data.teacher_type) {
        case '本校':
            view_name = '本校师资记录';
            break;
        case '校外':
            view_name = '校外师资记录';
            break;
        case '委托方自聘':
            view_name = '委托方自聘师资记录';
            break;
    }

    this.view.select({
        "application": "项目管理",  //数据中心中的应用
        "view": view_name,     //视图的名称
        "isMulti": false,           //只允许单选
        "isTitle": true, //（Boolean）可选，是否显示视图标题。默认true
        "caption": "师资库信息", //（String）可选，选择框的标题
        "width": 1000, //（Number）可选，选择框的宽度。默认700
        "height": 720,  //（Number）可选，选择框的高度。默认400
    }, function (items) {
        //如果选择了某个数据，将数据赋值给表单输入框
        if (items.length) {
            this.form.get("teacher_id").setData(items[0].data.teacher_id);
            this.form.get("teacher_name").setData(items[0].data.teacher_name);
            if (this.data.teacher_type == '本校') {
                this.form.get("teacher_unit").setData(items[0].data.college);
                this.form.get("teacher_title").setData(items[0].data.title);
            } else {
                this.form.get("teacher_unit").setData(items[0].data.unit);
                this.form.get("teacher_title").setData(this.getTitle(items[0].data.title, items[0].data.title_seq));
            }

        }
    }.bind(this));
});

this.define("selectTeacherNo", function () {
    var view_name = '本校教职工';
    this.statement.select({
        "name": view_name,     //视图的名称
        "isMulti": false,           //只允许单选
        "isTitle": true, //（Boolean）可选，是否显示视图标题。默认true
        "caption": "本校教职工信息", //（String）可选，选择框的标题
        "width": 800, //（Number）可选，选择框的宽度。默认700
        "height": 600,  //（Number）可选，选择框的高度。默认400
    }, function (items) {
        //如果选择了某个数据，将数据赋值给表单输入框
        if (items.length) {
            this.form.get("teacher_No").setData(items[0].xjzgh);
            this.form.get("teacher_name").setData(items[0].xxm);
            this.form.get("gender").setData(items[0].xxbmc);
            this.form.get("college").setData(items[0].xdwmc);
            this.form.get("degree").setData(items[0].xzgxwmc);
            this.form.get("title").setData(items[0].xzcmc);
            this.checkTeacherNo.bind(this)();
        }
    }.bind(this));
});

this.define("checkTeacherNo", function () {
    if (this.data.teacher_No != "") {
        this.view.lookup({
            "application": "项目管理",  //数据中心中的应用
            "view": "本校师资记录",     //视图的名称
            "filter": [
                {
                    "logic": "and",
                    "path": "teacher_No",
                    "comparison": "equals",
                    "value": this.data.teacher_No,
                    "formatType": "textValue"
                }
            ]
        }, function (data) {
            console.log(data)
            var grid = data.grid;
            var length = grid.length; //总数语句执行后返回的数字
            if (length == 0) {
                this.data.add("teacher_No_err", true, true);
            } else {
                this.data.add("teacher_No_err", "该教师已存在，请确认。", true);
            }
        }.bind(this));
    }
});

this.define("setOptions", function () {
    console.log(this.data.college_id)
    this.statement.execute({
        "name": "本校教职工",
        "mode": "data",
        "pageSize": 1000,
        "filter": [
            {
                "path": "QRY_DYN_ZUZHIJIEGOU.xdwh", //查询语句格式为jpql使用o.title，为原生sql中使用xtitle
                "comparison": "equals",
                "value": this.data.college_id,
                "formatType": "textValue"
            }
        ]
    }, function (json) {
        var list = json.data; //查询语句后返回的数组
        console.log(list)
        this.form.get("teacher_No").json.options = list.map(item => ({
            value: item.xjzgh, // 设置为 value
            label: item.xxm // 设置为 label
        }));
    }.bind(this));
});