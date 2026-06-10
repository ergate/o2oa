var cmsAction = this.Actions.load("x_cms_assemble_control");

// 根据课表行中的教师类型，返回对应师资库视图、CMS分类、编号规则和字段映射。
var getTeacherConfig = function (teacherType) {
    if (teacherType == "本校") {
        return {
            "view": "本校师资记录",
            "categoryId": "283469a6-45eb-4fb6-af5f-b1ac792baa1e",
            "unitField": "college",
            "docUnitField": "college",
            "serialKey": "teacher_serial_i",
            "serialPrefix": "TI",
            "publishTeacherType": "本校",
            "titlePrefix": "本校师资记录："
        };
    }
    if (teacherType == "校外") {
        return {
            "view": "校外师资记录",
            "categoryId": "f5418373-f172-4672-8f0b-4e0d01235791",
            "unitField": "unit",
            "docUnitField": "unit",
            "serialKey": "teacher_serial_e",
            "serialPrefix": "TE",
            "publishTeacherType": "校外",
            "titlePrefix": "校外师资记录："
        };
    }
    if (teacherType == "委托方自聘") {
        return {
            "view": "委托方自聘师资记录",
            "categoryId": "fbde91342-a9e5-4b04-ace1-519abc83abb7",
            "unitField": "unit",
            "docUnitField": "unit",
            "serialKey": "teacher_serial_s",
            "serialPrefix": "TS",
            "publishTeacherType": "自聘",
            "titlePrefix": "委托方自聘师资记录："
        };
    }
    return null;
};

// 当前脚本运行在 CMS 模块，发布身份、权限和编号组织后缀直接取当前 CMS 文档上下文。
var getCmsDocument = function () {
    if (this.documentContext && this.documentContext.getDocument) {
        return this.documentContext.getDocument() || {};
    }
    return {};
}.bind(this);

// 取得当前 CMS 文档创建人的身份，用于 CMS 文档发布身份和作者权限。
var getCurrentIdentity = function () {
    var doc = getCmsDocument();
    return doc.creatorIdentity || "";
};

// 取得当前 CMS 文档创建组织，用于生成读者权限和编号中的组织后缀。
var getCurrentCreatorUnit = function () {
    var doc = getCmsDocument();
    return doc.creatorUnitName || "";
};

// 从组织标识中取得 unique 后三位；优先使用 org.getUnit，失败时从“名称@unique@U”格式中解析。
var getCreatorUnitUniqueSuffix = function () {
    var creatorUnitName = getCurrentCreatorUnit();
    var unitUnique = "";
    if (creatorUnitName && this.org && this.org.getUnit) {
        var unit = this.org.getUnit(creatorUnitName);
        unitUnique = unit && unit.unique ? unit.unique : "";
    }
    if (!unitUnique && creatorUnitName && creatorUnitName.indexOf("@") > -1) {
        unitUnique = creatorUnitName.split("@")[1] || "";
    }
    return unitUnique.slice(-3);
}.bind(this);

// 从业务编号中提取单位三位码。
// 例如 TI1010081、TE1010035、TS1010001、CS1010029 中的 101。
var getUnitSuffixFromId = function (id) {
    id = id || "";
    return id.length >= 5 ? id.substr(2, 3) : "";
};

// 判断记录的编号是否属于当前办学单位。
var isSameCreatorUnitRecord = function (record, idFields) {
    var currentSuffix = getCreatorUnitUniqueSuffix();
    if (!currentSuffix) return false;
    for (var i = 0; i < idFields.length; i++) {
        var suffix = getUnitSuffixFromId(record[idFields[i]]);
        if (suffix && suffix == currentSuffix) return true;
    }
    return false;
};

// 在同名查询结果中找到当前办学单位的记录；姓名或课程名相同但单位码不同的记录不能复用。
var findSameCreatorUnitRecord = function (records, idFields) {
    records = records || [];
    for (var i = 0; i < records.length; i++) {
        if (isSameCreatorUnitRecord(records[i], idFields)) {
            return records[i];
        }
    }
    return null;
};

// 名称检索前统一去掉前后空格。
var trimText = function (value) {
    return value ? value.toString().replace(/^\s+|\s+$/g, "") : "";
};

// 找一条可借鉴的其他单位记录，用于新建本单位记录前补足字段。
var findReferenceRecord = function (records) {
    records = records || [];
    return records.length ? records[0] : null;
};

// 生成 CMS 文档的 readerList。
// 所有自动发布的文档默认给当前创建单位和终管办阅读权限。
var getReaderList = function () {
    var creatorUnit = getCurrentCreatorUnit();
    var readerList = [];
    if (creatorUnit) {
        readerList.push({
            permission: "阅读",
            permissionObjectCode: creatorUnit,
            permissionObjectName: creatorUnit.split("@")[0],
            permissionObjectType: "组织"
        });
    }
    readerList.push({
        permission: "阅读",
        permissionObjectCode: "南开大学终身学习教育管理办公室@NK00001@U",
        permissionObjectName: "南开大学终身学习教育管理办公室",
        permissionObjectType: "组织"
    });
    return readerList;
};

// 生成 CMS 文档的 authorList，作者为当前流程创建人。
var getAuthorList = function () {
    var identity = getCurrentIdentity();
    if (!identity) return [];
    return [
        {
            permission: "作者",
            permissionObjectCode: identity,
            permissionObjectName: identity.split("@")[0],
            permissionObjectType: "人员"
        }
    ];
};

// 日期格式化工具，用于兜底编号生成。
var getFormateTime = function (date, format) {
    var paddNum = function (num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
    };
    var cfg = {
        yyyy: date.getFullYear(),
        yy: date.getFullYear().toString().substring(2),
        M: date.getMonth() + 1,
        MM: paddNum(date.getMonth() + 1),
        d: date.getDate(),
        dd: paddNum(date.getDate()),
        hh: paddNum(date.getHours()),
        mm: paddNum(date.getMinutes()),
        ss: paddNum(date.getSeconds())
    };
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function (m) { return cfg[m]; });
};

// 非本校教师的职称存储为“职称序列 + 级别”，需要转换为实际显示职称。
// 规则与 comm.js 中 selectTeacher 使用的 getTitle 保持一致。
var getTitle = function (titles, titles_sequence) {
    if (!titles && !titles_sequence) {
        return "";
    }
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
    if (title_list[titles_sequence] && title_list[titles_sequence][titles]) {
        return title_list[titles_sequence][titles];
    }
    return titles || "";
};

// 生成教师或课程编号。
// 教师编号参照三类师资发布脚本：TI/TE/TS + 组织unique后三位 + 4位流水。
// 课程编号参照课程库发布脚本：CS + 组织unique后三位 + 4位流水。
var getGeneratedId = function (type) {
    var teacherConfig = type == "teacher" ? getTeacherConfig(arguments[1]) : null;
    if (teacherConfig) {
        var dict = new this.Dict({
            "type": "cms",
            "application": "项目管理",
            "name": "项目管理"
        });
        var teacherSerial = (dict.get(teacherConfig.serialKey) || 0) + 1;
        dict.set(teacherConfig.serialKey, teacherSerial);
        return teacherConfig.serialPrefix + getCreatorUnitUniqueSuffix() + teacherSerial.toString().padStart(4, "0");
    }
    if (type == "course") {
        var courseDict = new this.Dict({
            "type": "cms",
            "application": "项目管理",
            "name": "项目管理"
        });
        var courseSerial = (courseDict.get("course_serial") || 0) + 1;
        courseDict.set("course_serial", courseSerial);
        return "CS" + getCreatorUnitUniqueSuffix() + courseSerial.toString().padStart(4, "0");
    }
    return "C" + getFormateTime(new Date(), "yyyyMMddhhmmss") + Math.floor(Math.random() * 10000);
}.bind(this);

// 将 view.lookup 返回的 grid 结果规整为纯 data 数组，便于后续统一读取字段。
var getGridData = function (lookupResult) {
    var grid = lookupResult && lookupResult.grid ? lookupResult.grid : [];
    return grid.map(function (item) {
        var data = item.data || item;
        data.doc_id = item.bundle;
        return data;
    });
};

// 发布 CMS 文档的统一封装。
// 必要字段包含 identity、docData、readerList、authorList、title、documentType、docStatus。
var publishContent = function (categoryId, title, docData, success, failure) {
    var data = {};
    data["identity"] = getCurrentIdentity();
    data["categoryId"] = categoryId;
    data["docData"] = docData;
    data["readerList"] = getReaderList();
    data["authorList"] = getAuthorList();
    data["title"] = title;
    data["documentType"] = "信息";
    data["docStatus"] = "published";
    for (var key in docData) {
        if (docData.hasOwnProperty(key)) {
            data[key] = docData[key];
        }
    }
    cmsAction.DocumentAction.persist_publishContent(
        data,
        function (json) {
            if (success) success(json);
        }.bind(this),
        function (json) {
            if (failure) failure(json);
        }.bind(this)
    );
}.bind(this);

// 按教师类型和指定字段查询对应师资库，查询完成后通过 callback 返回记录数组。
var lookupTeacher = function (teacherType, path, value, callback) {
    var config = getTeacherConfig(teacherType);
    if (!config || !value) {
        callback([]);
        return;
    }
    this.view.lookup({
        "application": "项目管理",
        "view": config.view,
        "filter": [
            {
                "logic": "and",
                "path": path,
                "comparison": "equals",
                "value": value,
                "formatType": "textValue"
            }
        ]
    }, function (teachers) {
        console.log(teachers);
        callback(getGridData(teachers));
    }.bind(this));
}.bind(this);

// 按课程名称和教师姓名查询课程库，查询完成后通过 callback 返回记录数组。
var lookupCourseByNameAndTeacher = function (courseName, teacherName, callback) {
    courseName = trimText(courseName);
    teacherName = trimText(teacherName);
    if (!courseName || !teacherName) {
        callback([]);
        return;
    }
    this.view.lookup({
        "application": "项目管理",
        "view": "课程库信息",
        "filter": [
            {
                "logic": "and",
                "path": "course_name",
                "comparison": "equals",
                "value": courseName,
                "formatType": "textValue"
            },
            {
                "logic": "and",
                "path": "teacher_name",
                "comparison": "equals",
                "value": teacherName,
                "formatType": "textValue"
            }
        ]
    }, function (courses) {
        callback(getGridData(courses));
    }.bind(this));
}.bind(this);

// 自动创建教师记录。
// 当按教师姓名查到 0 条或多条时调用；发布成功后把新教师编号回写到当前课表行。
var createTeacher = function (row, callback) {
    var config = getTeacherConfig(row.teacher_type);
    if (!config) {
        callback(row);
        return;
    }
    row.teacher_name = trimText(row.teacher_name);
    var teacherId = row.teacher_id || getGeneratedId("teacher", row.teacher_type);
    var teacherData = {
        "teacher_name": row.teacher_name || "",
        "teacher_id": teacherId,
        "serial": teacherId,
        "teacher_type": config.publishTeacherType || row.teacher_type || "",
        "flg": "",
        "title": row.teacher_title || ""
    };
    if (row.teacher_type == "校外") {
        teacherData["newteacher"] = "是";
    }
    teacherData[config.docUnitField] = row.teacher_unit || row.unit || row.college || "";

    var publishTeacher = function () {
        publishContent(
            config.categoryId,
            config.titlePrefix + (row.teacher_name || ""),
            teacherData,
            function () {
                row.teacher_id = teacherId;
                row.teacher_title = teacherData.title || "";
                row.teacher_unit = teacherData[config.docUnitField] || "";
                callback(row);
            }.bind(this),
            function (json) {
                alert("教师“" + (row.teacher_name || "") + "”自动登记失败，课程无法自动导入。");
                console.log(json);
                callback(null);
            }.bind(this)
        );
    }.bind(this);

    if (row.teacher_type == "本校") {
        completeInternalTeacherInfo(teacherData, publishTeacher);
    } else {
        publishTeacher();
    }
}.bind(this);

// 创建本校教师记录前，按姓名从“本校教职工”补足性别、职称、学位、单位代码，再查“组织机构”补足单位名称。
// 任一步查不到数据时不覆盖原值，继续发布教师记录。
var completeInternalTeacherInfo = function (teacherData, callback) {
    if (!this.statement || !this.statement.execute || !teacherData.teacher_name) {
        callback();
        return;
    }
    this.statement.execute({
        "name": "本校教职工",
        "mode": "data",
        "filter": [
            {
                "path": "QRY_DYN_JIAOZHIGONG.xxm",
                "comparison": "equals",
                "value": teacherData.teacher_name,
                "formatType": "textValue"
            }
        ]
    }, function (json) {
        var list = json && json.data ? json.data : [];
        if (!list.length) {
            callback();
            return;
        }
        teacherData["gender"] = list[0].xxbmc || teacherData["gender"] || "";
        teacherData["teacher_No"] = list[0].xjzgh || teacherData["teacher_No"] || "";
        teacherData["title"] = list[0].xzcmc || teacherData["title"] || "";
        teacherData["degree"] = list[0].xzgxwmc || teacherData["degree"] || "";
        teacherData["dwh"] = list[0].xdwh || teacherData["dwh"] || "";
        if (!teacherData["dwh"]) {
            callback();
            return;
        }
        this.statement.execute({
            "name": "组织机构",
            "mode": "data",
            "filter": [
                {
                    "path": "QRY_DYN_ZUZHIJIEGOU.xdwh",
                    "comparison": "equals",
                    "value": teacherData["dwh"],
                    "formatType": "textValue"
                }
            ]
        }, function (unitJson) {
            var unitList = unitJson && unitJson.data ? unitJson.data : [];
            if (unitList.length) {
                teacherData["college"] = unitList[0].xdwmc || teacherData["college"] || "";
                teacherData["teacher_unit"] = unitList[0].xdwmc || teacherData["teacher_unit"] || "";
            }
            callback();
        }.bind(this));
    }.bind(this));
}.bind(this);

// 将师资库中查到的单位、职称、教师编号回填到当前课表行。
var fillTeacherInfo = function (row, teacherData) {
    var config = getTeacherConfig(row.teacher_type);
    if (!config || !teacherData) return row;
    row.teacher_id = teacherData.teacher_id || row.teacher_id || "";
    if (row.teacher_type == "本校") {
        row.teacher_title = teacherData.title || row.teacher_title || "";
    } else {
        row.teacher_title = getTitle(teacherData.title, teacherData.title_seq) || row.teacher_title || "";
    }
    row.teacher_unit = teacherData[config.unitField] || row.teacher_unit || "";
    return row;
};

// 参考其他单位同名教师记录补足当前课表行，但不复用其编号。
var fillTeacherInfoFromReference = function (row, teacherData) {
    var oldTeacherId = row.teacher_id || "";
    fillTeacherInfo(row, teacherData);
    row.teacher_id = oldTeacherId;
    return row;
};

// 确保当前课表行已经具备可用教师信息。
// 有 teacher_id 时按编号查；无 teacher_id 时按姓名查，并只复用当前办学单位单位码一致的教师。
var ensureTeacher = function (row, callback) {
    if (!row.teacher_type || !row.teacher_name && !row.teacher_id) {
        callback(row);
        return;
    }
    row.teacher_name = trimText(row.teacher_name);

    if (row.teacher_id && row.teacher_id != "") {
        if (!row.teacher_title || !row.teacher_unit) {
            lookupTeacher(row.teacher_type, "serial", row.teacher_id, function (teachers) {
                if (teachers.length) {
                    fillTeacherInfo(row, teachers[0]);
                }
                callback(row);
            }.bind(this));
        } else {
            callback(row);
        }
    } else {
        lookupTeacher(row.teacher_type, "teacher_name", row.teacher_name, function (teachers) {
            var matchedTeacher = findSameCreatorUnitRecord(teachers, ["teacher_id", "serial"]);
            if (matchedTeacher) {
                fillTeacherInfo(row, matchedTeacher);
                callback(row);
            } else {
                fillTeacherInfoFromReference(row, findReferenceRecord(teachers));
                createTeacher(row, function (createdRow) {
                    callback(createdRow);
                }.bind(this));
            }
        }.bind(this));
    }
}.bind(this);

// 将课程库中查到的课程字段回填到当前课表行。
var fillCourseInfo = function (row, courseData) {
    if (!courseData) return row;
    row.doc_id = courseData.doc_id || row.doc_id || "";
    row.course_id = courseData.course_id || courseData.serial || row.course_id || "";
    row.course_name = courseData.course_name || row.course_name || row.courseSubject || "";
    row.course_type = courseData.course_type || row.course_type || "";
    row.teacher_type = courseData.teacher_type || row.teacher_type || "";
    row.teacher_id = courseData.teacher_id || row.teacher_id || "";
    row.teacher_name = courseData.teacher_name || row.teacher_name || "";
    row.teacher_title = courseData.teacher_title || row.teacher_title || "";
    row.teacher_unit = courseData.teacher_unit || row.teacher_unit || "";
    return row;
};

// 参考其他单位同课程同教师记录补足当前课表行，但不复用其课程编号。
var fillCourseInfoFromReference = function (row, courseData) {
    fillCourseInfo(row, courseData);
    return row;
};

// 确保当前课表行已经具备可用课程库编号。
// 按课程名称查询时，只有当前办学单位单位码一致的课程可以复用，否则重新编号新建课程。
var ensureCourse = function (row, callback) {
    if (row.course_id && row.course_id != "") {
        callback(row);
        return;
    }
    row.course_name = trimText(row.course_name || row.courseSubject || "");
    row.courseSubject = row.course_name;
    row.teacher_name = trimText(row.teacher_name);
    lookupCourseByNameAndTeacher(row.course_name, row.teacher_name, function (courses) {
        var matchedCourse = findSameCreatorUnitRecord(courses, ["course_id", "serial"]);
        if (matchedCourse) {
            fillCourseInfo(row, matchedCourse);
            callback(row);
        } else {
            fillCourseInfoFromReference(row, findReferenceRecord(courses));
            createCourse(row, callback);
        }
    }.bind(this));
}.bind(this);

// 自动创建课程库记录。
// 创建成功后将新 course_id 回写到当前课表行，再交给导入流程写入当前表单课表。
var createCourse = function (row, callback) {
    var courseId = getGeneratedId("course");
    row.course_name = trimText(row.course_name || row.courseSubject || "");
    row.courseSubject = row.course_name;
    row.teacher_name = trimText(row.teacher_name);
    var courseData = {
        "course_name": row.course_name || row.courseSubject || "",
        "teacher_type": row.teacher_type || "",
        "teacher_id": row.teacher_id || "",
        "teacher_name": row.teacher_name || "",
        "teacher_title": row.teacher_title || "",
        "teacher_unit": row.teacher_unit || "",
        "serial": courseId,
        "course_id": courseId
    };
    publishContent(
        "5dc5ddaa-016b-40bf-ac07-bfc369eb5eee",
        "课程库登记：" + courseData.course_name,
        courseData,
        function (json) {
            row.course_id = courseId;
            row.doc_id = (json && json.data) ? json.data.id : "";
            callback(row);
        }.bind(this),
        function (json) {
            alert("课程“" + courseData.course_name + "”自动登记课程库失败，无法导入。");
            console.log(json);
            callback(null);
        }.bind(this)
    );
}.bind(this);

// 根据立项课表行构造当前表单 datatable 所需的课程行结构。
// 非“委托办学项目”的课时按原脚本规则置为 0。
var buildCourseRow = function (row, projectType) {
    return {
        "course_id": row.course_id || "",
        "doc_id": row.doc_id || "",
        "course_name": row.course_name || row.courseSubject || "",
        "course_type": row.course_type || "",
        "course_hours": projectType == "委托办学项目" ? (row.course_hours || 0) : 0,
        "teacher_type": row.teacher_type || "",
        "teacher_id": row.teacher_id || "",
        "teacher_name": row.teacher_name || "",
        "feeStd": row.feeStd || "",
        "teacher_title": row.teacher_title || "",
        "teacher_unit": row.teacher_unit || row.unit || row.college || "",
        "warning": row.warning || ""
    };
};

// 刷新当前表单课程表格。
var reloadDatatable = function () {
    this.form.get("datatable").reload();
}.bind(this);

// 校验导入后的课表行是否都已具备课程类型。
var checkCourse_type = function () {
    var rows = this.data && this.data.datatable && this.data.datatable.data ? this.data.datatable.data : [];
    for (var i = 0; i < rows.length; i++) {
        if (!rows[i].course_type) return false;
    }
    return true;
}.bind(this);

// 对已有 course_id 的课程，从课程库补齐课程名称、课程类型和教师信息。
var enrichCourseFromLibrary = function (course, callback) {
    this.view.lookup({
        "application": "项目管理",
        "view": "课程库信息",
        "filter": [
            {
                "logic": "and",
                "path": "course_id",
                "comparison": "equals",
                "value": course.course_id,
                "formatType": "textValue"
            }
        ]
    }, function (courses) {
        console.log(courses);
        if (courses.grid && courses.grid.length) {
            course.doc_id = courses.grid[0].bundle;
            course.course_name = courses.grid[0].data.course_name;
            course.course_type = courses.grid[0].data.course_type;
            course.teacher_type = courses.grid[0].data.teacher_type;
            course.teacher_id = courses.grid[0].data.teacher_id;
            course.teacher_name = courses.grid[0].data.teacher_name;
            course.teacher_title = courses.grid[0].data.teacher_title;
            course.teacher_unit = courses.grid[0].data.teacher_unit;
        }
        reloadDatatable();
        if (callback) callback(course);
    }.bind(this));
}.bind(this);

// 处理单条立项课表行。
// 已有 course_id：先写入当前表单，再异步补齐课程库信息。
// 没有 course_id：先确保教师存在，再按课程名查找本单位课程；找不到才自动创建课程库记录。
var processTimetableRow = function (row, projectType, callback) {
    if (row.course_id && row.course_id != "") {
        var course = buildCourseRow(row, projectType);
        this.data.datatable.data.push(course);
        enrichCourseFromLibrary(course, function () {
            ensureTeacher(course, function () {
                reloadDatatable();
                callback();
            }.bind(this));
        }.bind(this));
    } else {
        ensureTeacher(row, function (teacherRow) {
            if (!teacherRow) {
                callback();
                return;
            }
            ensureCourse(teacherRow, function (createdRow) {
                if (createdRow) {
                    this.data.datatable.data.push(buildCourseRow(createdRow, projectType));
                    reloadDatatable();
                }
                callback();
            }.bind(this));
        }.bind(this));
    }
}.bind(this);

// 串行处理课表数组。
// view.lookup、getWithDocument、persist_publishContent 都是异步调用，因此这里逐行等待完成后再处理下一行。
var processTimetableRows = function (rows, projectType, index) {
    index = index || 0;
    if (index >= rows.length) {
        console.log(this.data.datatable.data);
        reloadDatatable();
        // console.log("课表导入后课程类型校验结果：", checkCourse_type());
        return;
    }
    processTimetableRow(rows[index], projectType, function () {
        processTimetableRows(rows, projectType, index + 1);
    }.bind(this));
}.bind(this);

// 选择可导入课表的立项项目，并在选择后读取该项目文档中的立项课表。
this.view.select({
    "application": "项目管理",  //数据中心中的应用
    "view": "项目信息_精简版",     //视图的名称
    "isMulti": false,           //只允许单选
    "isTitle": true, //（Boolean）可选，是否显示视图标题。默认true
    "caption": "项目信息", //（String）可选，选择框的标题
    "width": 1200, //（Number）可选，选择框的宽度。默认700
    "height": 720,  //（Number）可选，选择框的高度。默认400
    "filter": [ //（Array of Object）可选，对视图进行过滤的条件。json数组格式，每个数组元素描述一个过滤条件。
        {
            "logic": "and",
            "path": "status",
            "comparison": "equals",
            "value": "立项",
            "formatType": "textValue"
        },
        {
            "logic": "and",
            "path": "timetable_id",
            "comparison": "equals",
            "value": "",
            "formatType": "textValue"
        }
    ]
}, function (items) {
    //如果选择了某个数据，将数据赋值给表单输入框
    if (items.length) {
        this.form.get("project_id").setData(items[0].data.project_id);
        this.form.get("project_name").setData(items[0].data.project_name);
        this.form.get("project_type").setData(items[0].data.project_type);
        this.form.get("client").setData(items[0].data.client);
        this.form.get("openingTime").setData(items[0].data.openingTime);
        this.form.get("endingTime").setData(items[0].data.endingTime);
        this.form.get("trainingHours").setData(items[0].data.trainingHours);
        this.form.get("traineesNumber").setData(items[0].data.traineesNumber);
        this.form.get("contract_id").setData(items[0].data.contract_id);
        this.data.datatable.data = [];
        cmsAction.DataAction.getWithDocument(//平台封装好的方法
            items[0].data.document_id,//uri的参数
            function (json) { //服务调用成功的回调函数, json为服务传回的数据
                var docData = json.data || {};
                var timetable_data = docData.datatable && docData.datatable.data ? docData.datatable.data : [];
                console.log(timetable_data);
                processTimetableRows(timetable_data, items[0].data.project_type, 0);
            }.bind(this),
            function (json) { //服务调用失败的回调函数, json为服务传回的数据
                alert("读取立项申请课表失败，无法导入。");
                console.log(json);
            }.bind(this)
        );
    }
}.bind(this));
