this.define("getReaderUnitNameList1",function(creatorUnitName){
    // 获取子单元列表并提取 readerUnitName
    var subUnitList = this.org.listSubUnit(creatorUnitName, false);
    var readerUnitNameList = subUnitList ? subUnitList.map(function(subUnit) { return subUnit.distinguishedName; }) : [];

    // 在列表中添加 "南开大学终身学习教育管理办公室@NK00001@U"
    readerUnitNameList.push("南开大学终身学习教育管理办公室@NK00001@U");

    // 返回结果
    return readerUnitNameList;
});

this.define("getReaderUnitNameList2",function(creatorUnitName){
    // 初始化 readerList
    var readerList = [];

    // 获取子单元列表
    var subUnitList = this.org.listSubUnit(creatorUnitName, false);

    // 判断子单元列表是否为空
    if (subUnitList && subUnitList.length > 0) {
        // 遍历子单元列表
        subUnitList.forEach(function(subUnit) {
            var distinguishedName = subUnit.distinguishedName;
            var distinguishedNameArr = distinguishedName.split("@");

            // 将每个子单元的信息添加到 readerList
            readerList.push({
                permission: "阅读",
                permissionObjectCode: distinguishedName,
                permissionObjectName: distinguishedNameArr[0],
                permissionObjectType: "组织"
            });
        });
    }

    // 添加固定的南开大学终身学习教育管理办公室信息
    readerList.push({
        permission: "阅读",
        permissionObjectCode: "南开大学终身学习教育管理办公室@NK00001@U",
        permissionObjectName: "南开大学终身学习教育管理办公室",
        permissionObjectType: "组织"
    });

    // 返回结果
    return readerList;
});
