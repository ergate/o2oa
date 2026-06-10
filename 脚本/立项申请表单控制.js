this.define("checkTrainingHours",function(){
    // 计算总学时
    this.form.get("trainingHours").setData(this.data.trainingHours_1+this.data.trainingHours_2+this.data.trainingHours_3)
    this.chkChange.bind(this)("trainingHours");
    // 小于16学时不能发证书
    if (this.form.get("trainingHours").getData()<16){
        this.form.get("label_3").node.setStyle("display","block"); // 显示提示信息
        this.form.get("swCert1").json.disabled=true;
        this.form.get("swCert2").json.disabled=true;
        this.form.get("swCert3").json.disabled=true;
        this.form.get("swCert1").setData(true);
        this.form.get("swCert2").setData(false);
        this.form.get("swCert3").setData(false); 
        this.form.get("certificateStandard_1").json.disabled=true;
        this.form.get("certificateStandard_2").json.disabled=true;        
        this.form.get("certificateStandard_1").setData(0);
        this.form.get("certificateStandard_2").setData("");
        this.chkChange.bind(this)("swCert1");
        this.chkChange.bind(this)("swCert2");   
        this.chkChange.bind(this)("swCert3");   
        this.chkChange.bind(this)("certificateStandard_1");   
        this.chkChange.bind(this)("certificateStandard_2");                     
    }else{
        this.form.get("label_3").node.setStyle("display","none"); // 关闭提示信息
        this.form.get("swCert1").json.disabled=false;
        this.form.get("swCert1").setData(false);
        this.form.get("swCert2").setData(true);
        this.form.get("swCert3").setData(false);   
        // this.form.get("certificateStandard_1").setData(0); 
        this.form.get("swCert2").json.disabled=false;
        this.form.get("swCert3").json.disabled=false;         
        this.form.get("certificateStandard_1").json.disabled=false;
        this.form.get("certificateStandard_2").json.disabled=false;                      
        // if (this.data.swCert1){
        //     this.form.get("swCert2").json.disabled=true;
        //     this.form.get("swCert3").json.disabled=true;
        // }else{
        //     this.form.get("swCert2").json.disabled=false;
        //     this.form.get("swCert3").json.disabled=false;
        // }
    }    
});
this.define("setROctlr_1",function(){
    var moduleAll = this.target.all; //获取组件对象
    console.log(moduleAll)
    moduleAll.headPerson.node.setStyle("border","")
    moduleAll.headPerson_org.node.setStyle("border","")
    moduleAll.contacts.node.setStyle("border","")
    this.setROctlr.bind(this)()
    this.form.get("swTS1").node.setStyle("display","none");
    this.form.get("lbTS1").node.setStyle("display","block");
    this.form.get("swTS2").node.setStyle("display","none");
    this.form.get("lbTS2").node.setStyle("display","block");
    this.form.get("swTS3").node.setStyle("display","none");
    this.form.get("lbTS3").node.setStyle("display","block");
    this.form.get("swTS4").node.setStyle("display","none");
    this.form.get("lbTS4").node.setStyle("display","block");
    this.form.get("swTS5").node.setStyle("display","none");
    this.form.get("lbTS5").node.setStyle("display","block");
    this.form.get("swTS6").node.setStyle("display","none");
    this.form.get("lbTS6").node.setStyle("display","block");
    this.form.get("swTS7").node.setStyle("display","none");
    this.form.get("lbTS7").node.setStyle("display","block");
    this.form.get("swTS8").node.setStyle("display","none");
    this.form.get("lbTS8").node.setStyle("display","block");
    if (this.data.swTS1) {
        this.form.get("lbTS1").setText("⬛")
    }else{
        this.form.get("lbTS1").setText("🔲")
    }
    if (this.data.swTS2) {
        this.form.get("lbTS2").setText("⬛")
    }else{
        this.form.get("lbTS2").setText("🔲")
    }
    if (this.data.swTS3) {
        this.form.get("lbTS3").setText("⬛")
    }else{
        this.form.get("lbTS3").setText("🔲")
    }
    if (this.data.swTS4) {
        this.form.get("lbTS4").setText("⬛")
    }else{
        this.form.get("lbTS4").setText("🔲")
    }
    if (this.data.swTS5) {
        this.form.get("lbTS5").setText("⬛")
    }else{
        this.form.get("lbTS5").setText("🔲")
    }
    if (this.data.swTS6) {
        this.form.get("lbTS6").setText("⬛")
    }else{
        this.form.get("lbTS6").setText("🔲")
    }
    if (this.data.swTS7) {
        this.form.get("lbTS7").setText("⬛")
    }else{
        this.form.get("lbTS7").setText("🔲")
    }
    if (this.data.swTS8) {
        this.form.get("lbTS8").setText("⬛")
    }else{
        this.form.get("lbTS8").setText("🔲")
    }

});
this.define("setRWctlr_1",function(){
    if (this.data.swTS2 || this.data.swTS3){
    this.form.get("materialfee").json.disabled=false;
    }else{
        this.form.get("materialfee").json.disabled=true;
        this.form.get("materialfee").setData(0);
    }
    if (this.data.swTS4){
        this.form.get("platformfee").json.disabled=false;
    }else{
        this.form.get("platformfee").json.disabled=true;
        this.form.get("platformfee").setData(0);
    }
    if (this.data.swTS5){
        this.form.get("onthespot").json.disabled=false;
    }else{
        this.form.get("onthespot").json.disabled=true;
        this.form.get("onthespot").setData(0);
    }
    if (this.data.swTS6){
        this.form.get("accommodation").json.disabled=false;
    }else{
        this.form.get("accommodation").json.disabled=true;
        this.form.get("accommodation").setData(0);
    }
    if (this.data.swTS7){
        this.form.get("transportation").json.disabled=false;
    }else{
        this.form.get("transportation").json.disabled=true;
        this.form.get("transportation").setData(0);
    }
    if (this.data.swTS8){
        this.form.get("othercost").json.disabled=false;
        this.form.get("costOther").json.disabled=false;
    }else{
        this.form.get("othercost").json.disabled=true;
        this.form.get("othercost").setData(0);
        this.form.get("costOther").json.disabled=true;
        this.form.get("costOther").setData("");
    }
    this.setRWctlr_comm.bind(this)();
    if (this.form.get("approved_Meet").getData()=="其他" ) {
        this.form.get("meet_name").json.disabled=false
    }else{
        this.form.get("meet_name").json.disabled=true
    }
});
this.define("setROctlr",function(){
    // var activity = this.workContext.getActivity();
    // // if (activity.name == '终管办审批'){
    //     console.log(this.form.get("project_id").json.isReadonly);
    //     this.form.get("project_id").json.isReadonly=false;
    //     console.log(this.form.get("project_id").json.isReadonly);
    // // }
    this.form.get("headPerson").node.setStyle("border","")
    this.form.get("headPerson_org").node.setStyle("border","")
    this.form.get("swLM1").node.setStyle("display","none");
    this.form.get("swLM2").node.setStyle("display","none");
    this.form.get("swLM3").node.setStyle("display","none");
    this.form.get("lbLM1").node.setStyle("display","block");
    this.form.get("lbLM2").node.setStyle("display","block");
    this.form.get("lbLM3").node.setStyle("display","block");
    if (this.data.swLM1) {
        this.form.get("lbLM1").setText("⬛")
    }else{
        this.form.get("lbLM1").setText("🔲")
    }
    if (this.data.swLM2) {
        this.form.get("lbLM2").setText("⬛")
    }else{
        this.form.get("lbLM2").setText("🔲")
    }
    if (this.data.swLM3) {
        this.form.get("lbLM3").setText("⬛")
    }else{
        this.form.get("lbLM3").setText("🔲")
    }
    this.form.get("swCert1").node.setStyle("display","none");
    this.form.get("swCert2").node.setStyle("display","none");
    this.form.get("swCert3").node.setStyle("display","none");
    this.form.get("lbCert1").node.setStyle("display","block");
    this.form.get("lbCert2").node.setStyle("display","block");
    this.form.get("lbCert3").node.setStyle("display","block");
    if (this.data.swCert1) {
        this.form.get("lbCert1").setText("⬛")
    }else{
        this.form.get("lbCert1").setText("🔲")
    }
    if (this.data.swCert2) {
        this.form.get("lbCert2").setText("⬛")
    }else{
        this.form.get("lbCert2").setText("🔲")
    }
    if (this.data.swCert3) {
        this.form.get("lbCert3").setText("⬛")
    }else{
        this.form.get("lbCert3").setText("🔲")
    }
});
this.define("setRWctlr",function(){
    this.setRWctlr_comm.bind(this)();
    if (this.form.get("trainees").getData()=="其他" ) {
        this.form.get("traineesOther").json.disabled=false
    }else{
        this.form.get("traineesOther").json.disabled=true
    }
    if (this.form.get("haveContract").getData()=="是" ) {
        this.form.get("contract_id").json.disabled=false
    }else{
        this.form.get("contract_id").json.disabled=true
        this.form.get("contract_id").setData("")
        this.form.get("contract_name").setData("")
        this.form.get("contract_id").validate()
    }
});
this.define("setRWctlr_comm",function(){
    if (this.data.swLM1) {
        this.form.get("trainingHours_1").json.disabled=false
        this.form.get("schoolArea").json.disabled=false
        this.form.get("trainAddress").json.disabled=false    
    }else{
        this.form.get("trainingHours_1").json.disabled=true
        this.form.get("schoolArea").json.disabled=true
        this.form.get("trainAddress").json.disabled=true    
    }
    if (this.data.swLM2) {
        this.form.get("trainingHours_2").json.disabled=false
        this.form.get("trainPlatform").json.disabled=false
    }else{
        this.form.get("trainingHours_2").json.disabled=true
        this.form.get("trainPlatform").json.disabled=true
    }
    if (this.data.swLM3) {
        this.form.get("trainingHours_3").json.disabled=false
        this.form.get("trainAddress_1").json.disabled=false
    }else{
        this.form.get("trainingHours_3").json.disabled=true
        this.form.get("trainAddress_1").json.disabled=true
    }
    if (this.data.swCert2 ) {
        this.form.get("certificateStandard_1").json.disabled=false
    }else{
        this.form.get("certificateStandard_1").json.disabled=true
    }
    if (this.data.swCert3 ) {
        this.form.get("certificateStandard_2").json.disabled=false
    }else{
        this.form.get("certificateStandard_2").json.disabled=true
    }
    this.checkTrainingHours.bind(this)();
});
this.define("chkChange",function(key){
    if (typeof(this.data.pjdata) == "undefined"){
        return;
    }
        console.log(key+":"+this.data[key])
        this.data.changedata.add(key,this.data[key],true);
        switch (key) {
            case "project_name":
                this.data.changedataForTT.add(key,this.data[key],true);
                this.data.changedataForStu.add(key,this.data[key],true);
                this.data.changedataForCert.add(key,this.data[key],true);
                this.data.changedata.add("subject","立项申请："+this.data[key],true);
                this.data.changedata.add("$document",{"title":"立项申请："+this.data[key]},true);
                this.data.changedata.add("$work",{"title":"立项申请："+this.data[key]},true);
                this.data.changedataForCert.add("title","证书发放：（"+this.data.project_id+"）"+this.data[key],true);
                this.data.changedataForCert.add("$document",{"title":"证书发放：（"+this.data.project_id+"）"+this.data[key]},true);
                this.data.changedataForTT.add("subject","课表登记："+this.data[key],true);
                this.data.changedataForTT.add("$document",{"title":"课表登记："+this.data[key]},true);
                this.data.changedataForStu.add("$document",{"title":"学员基本信息：【" + this.data.project_id+"】"+this.data[key]},true); 
                break;
            case "client":
            case "openingTime":
            case "endingTime":
            case "trainingHours":
            case "traineesNumber":
                this.data.changedataForTT.add(key,this.data[key],true);
                this.data.changedataForStu.add(key,this.data[key],true);
                break;
            case 'swCert1':
                if (key =='swCert1'){
                    if(this.data.swCert1 ){
                        this.data.changedata.add('certificate_flg','否',true);
                        this.data.changedataForStu.add('certificate_flg','否',true);
                    }else{
                        this.data.changedata.add('certificate_flg','是',true);
                        this.data.changedataForStu.add('certificate_flg','是',true);
                    }
                }
                break;                
            case 'certificateStandard_1':
            case 'certificateStandard_2':
                this.data.changedataForStu.add(key,this.data[key],true);
                break;  
            case 'haveContract':
            case 'contract_id':
            case 'contract_name':
                this.data.changedata.add('haveContract',this.data['haveContract'],true);
                this.data.changedata.add('contract_id',this.data['contract_id'],true);
                this.data.changedata.add('contract_name',this.data['contract_name'],true);
                break;                             
        }

        var itemNm="";
        switch (key) {
            case 'project_name':
                itemNm='项目名称';
                break;
            case 'isJoint':
                itemNm='是否合作办学';
                break;
            case 'headPerson':
                itemNm='项目经办人';
                break; 
            case 'headPerson_org':
                itemNm='办学单位';
                break;                               
            case 'headMobile':
                itemNm='经办人联系电话';
                break;  
            case 'client':
            case 'client_id':
            case 'client_province':
                itemNm='委托单位';
                break;     
            case 'haveContract':
            case 'contract_id':
            case 'contract_name':
                itemNm='关联合同';
                break;                         
            case 'forForeigner':
                itemNm='是否涉及境外、国外人员';
                break;  
            case 'forAbroad':
                itemNm='是否为非学历留学生教育项目';
                break;  
            case 'trainees':
            case 'traineesOther':
                itemNm='学员构成';
                break; 
            case 'trainPurpose':
                itemNm='教育重点';
                break; 
            case 'keyword1':
            case 'keyword2':
            case 'keyword3':
                itemNm='关键字';
                break; 
            case 'openingTime':
                itemNm='开班时间';
                break; 
            case 'openingTime':
                itemNm='开班时间';
                break; 
            case 'endingTime':
                itemNm='结业时间';
                break; 
            case 'trainingHours':
                itemNm='总学时';
                break; 
            case 'traineesNumber':
                if (this.data.project_type=="委托办学项目"){
                    itemNm='参与学习人数';
                }else{
                    itemNm='招生人数';
                }                
                break; 
            case 'totalTuition':
                if (this.data.project_type=="委托办学项目"){
                    itemNm='学费总额';
                }else{
                    itemNm='收费总额';
                }               
                break; 
            case 'tuitionStandard':
            case 'swTS1':
            case 'swTS2':
            case 'swTS3':
            case 'swTS4':
            case 'swTS5':
            case 'swTS6':
            case 'swTS7':
            case 'swTS8':
            case 'costOther':
                itemNm='收费标准';
                break; 
            case 'trainingHours':
                itemNm='总学时';
                break; 
            case 'swLM1':
            case 'swLM2':
            case 'swLM3':
            case 'trainingHours_1':
            case 'trainingHours_2':
            case 'trainingHours_3':                                    
            case 'schoolArea':
            case 'trainAddress':
            case 'trainPlatform':
            case 'trainAddress_1':  
                itemNm='教学模式';
                break; 
            case 'swCert1':
            case 'swCert2':
            case 'swCert3':
            case 'certificateStandard_1':
            case 'certificateStandard_2':
                itemNm='证书发放要求';
                break; 
            case 'datatable':
                itemNm='计划课表';
                break; 
            case 'project_profile':
                itemNm='项目简介';
                break; 
            case 'target':
                itemNm='招生对象';
                break;
            case 'courselist':             
                itemNm='开设课程及师资介绍';
                break;
            case 'pjlist':
                itemNm='兄弟高校办学情况';
                break;                 
            case 'analysis':             
                itemNm='社会承受能力分析';
                break;
            case 'teacherfees':             
                itemNm='成本分析（师资费）';
                break;
            case 'managementfee':             
                itemNm='成本分析（教学管理费）';
                break;
            case 'materialfee':             
                itemNm='成本分析（书本资料费（含证书费））';
                break;
            case 'sitecost':             
                itemNm='成本分析（场地费）';
                break;
            case 'onthespot':             
                itemNm='成本分析（拓展培训、现场教学）';
                break;
            case 'platformfee':             
                itemNm='成本分析（实验平台使用费）';
                break;
            case 'accommodation':             
                itemNm='成本分析（食宿费）';
                break;
            case 'transportation':             
                itemNm='成本分析（交通费）';
                break;
            case 'othercost':             
                itemNm='成本分析（其他）';
                break;
            case 'totalTuition_1':             
                itemNm='成本分析（总计）';
                break;
            case 'payment':             
                itemNm='收费方式';
                break;
            case 'bill_type':             
                itemNm='票据类型';
                break;
            case 'publicity':             
                itemNm='招生宣传方式';
                break;
            case 'registration':             
                itemNm='报名方式';
                break;
            case 'contacts':             
                itemNm='报名联系人';
                break;
            case 'contact_info':             
                itemNm='报名联系方式';
                break;
            case 'approved_Date':             
                itemNm='审核日期';
                break;
            case 'approved_Meet':  
            case 'meet_name':           
                itemNm='审核会议';
                break;
        }
        switch (key) {
            case 'client':
            case 'client_id':
            case 'client_province':
                if (this.data.pjdata['client'] == this.data['client']){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ this.data.pjdata['client'],true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ this.data['client'],true);
                }
                break;  
            case 'haveContract':
            case 'contract_id':
            case 'contract_name':
                if (this.data.pjdata['contract_id'] == this.data['contract_id']){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：('+ this.data.pjdata['contract_id']+')'+this.data.pjdata['contract_name'],true);
                    this.data.newmsg.add(itemNm,itemNm +'：('+ this.data['contract_id']+')'+this.data['contract_name'],true);
                }
                break;  
            case 'trainees':
            case 'traineesOther':
                console.log(this.data.pjdata.trainees)
                console.log(this.data.trainees)
                msg_o='';
                msg_n='';                
                if (this.data.pjdata.trainees=='其他'){
                    msg_o = this.data.pjdata.trainees + '(' + this.data.pjdata.traineesOther + ')';
                }else{
                    msg_o = this.data.pjdata.trainees ;
                }
                if (this.data.trainees=='其他'){
                    msg_n = this.data.trainees + '(' + this.data.traineesOther + ')';
                }else{
                    msg_n =  this.data.trainees ,true;
                }
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break;
            case 'keyword1':
            case 'keyword2':
            case 'keyword3':
                msg_o=this.data.pjdata.keyword1+'、'+this.data.pjdata.keyword2+'、'+this.data.pjdata.keyword3;
                msg_n=this.data.keyword1+'、'+this.data.keyword2+'、'+this.data.keyword3;
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break;
            case 'swLM1':
            case 'swLM2':
            case 'swLM3':
            case 'trainingHours_1':
            case 'trainingHours_2':
            case 'trainingHours_3':                                    
            case 'schoolArea':
            case 'trainAddress':
            case 'trainPlatform':
            case 'trainAddress_1':
                msg_o='';
                msg_n='';
                if (this.data.pjdata.swLM1){
                    msg_o = '线下授课' +this.data.pjdata.trainingHours_1 +'学时（地点：'+this.data.pjdata.schoolArea+' '+this.data.pjdata.trainAddress+'）';
                }
                if(this.data.pjdata.swLM2){
                    if (msg_o==""){
                        msg_o = '线上授课' +this.data.pjdata.trainingHours_2 +'学时（教学平台：'+this.data.pjdata.trainPlatform+'）';
                    }else{
                        msg_o = msg_o + '；'+'线上授课' +this.data.pjdata.trainingHours_2 +'学时（教学平台：'+this.data.pjdata.trainPlatform+'）';
                    }
                }
                if(this.data.pjdata.swLM3){
                    if (msg_o==""){
                        msg_o = '现场教学' +this.data.pjdata.trainingHours_3 +'学时（地点：'+this.data.pjdata.trainAddress_1+'）';
                    }else{
                        msg_o = msg_o + '；'+'现场教学' +this.data.pjdata.trainingHours_3 +'学时（地点：'+this.data.pjdata.trainAddress_1+'）';
                    }
                }

                if (this.data.swLM1){
                    msg_n = '线下授课' +this.data.trainingHours_1 +'学时（地点：'+this.data.schoolArea+' '+this.data.trainAddress+'）';
                }
                if(this.data.swLM2){
                    if (msg_n==""){
                        msg_n = '线上授课' +this.data.trainingHours_2 +'学时（教学平台：'+this.data.trainPlatform+'）';
                    }else{
                        msg_n = msg_n + '；'+'线上授课' +this.data.trainingHours_2 +'学时（教学平台：'+this.data.trainPlatform+'）';
                    }
                }
                if(this.data.swLM3){
                    if (msg_n==""){
                        msg_n = '现场教学' +this.data.trainingHours_3 +'学时（地点：'+this.data.trainAddress_1+'）';
                    }else{
                        msg_n = msg_n + '；'+'现场教学' +this.data.trainingHours_3 +'学时（地点：'+this.data.trainAddress_1+'）';
                    }
                } 
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break; 
            case 'swCert1':
            case 'swCert2':
            case 'swCert3':
            case 'certificateStandard_1':
            case 'certificateStandard_2':
                msg_o='';
                msg_n='';
                if (this.data.pjdata.swCert1){
                    msg_o = '不发放证书' ;
                }
                if(this.data.pjdata.swCert2){
                    if (msg_o==""){
                        msg_o = '出勤学时（' +this.data.pjdata.certificateStandard_1 +'学时）';
                    }else{
                        msg_o = msg_o + '；'+'出勤学时（' +this.data.pjdata.certificateStandard_1 +'学时）';
                    }
                }
                if(this.data.pjdata.swCert3){
                    if (msg_o==""){
                        msg_o = '其他要求（' +this.data.pjdata.certificateStandard_2 +'）';
                    }else{
                        msg_o = msg_o + '；'+'其他要求（' +this.data.pjdata.certificateStandard_2 +'）';
                    }
                }
                if (this.data.swCert1){
                    msg_n = '不发放证书';
                }
                if(this.data.swCert2){
                    if (msg_n==""){
                        msg_n = '出勤学时（' +this.data.certificateStandard_1 +'学时）';
                    }else{
                        msg_n = msg_n + '；'+'出勤学时（' +this.data.certificateStandard_1 +'学时）';
                    }
                }
                if(this.data.swCert3){
                    if (msg_n==""){
                        msg_n = '其他要求（' +this.data.certificateStandard_2 +'）';;
                    }else{
                        msg_n = msg_n + '；'+'其他要求（' +this.data.certificateStandard_2 +'）';
                    }
                } 
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break; 
            case 'datatable':
                msg_o='';
                msg_n='';
                msg_o=this.data.pjdata.timetable;
                msg_n=this.tableTostr_1(this.data.datatable.data);
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break;
            case 'courselist':
                msg_o='';
                msg_n='';
                msg_o=this.data.pjdata.timetable;
                msg_n=this.tableTostr_2(this.data.datatable.data);
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break;                
            case 'pjlist':
                msg_o='';
                msg_n='';
                msg_o=this.data.pjdata.pjlist;
                msg_n=this.tableTostr_3(this.data.datatable_1.data);
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                }
                break;  
            case 'project_profile':
                if (this.data.pjdata[key] == this.data[key]){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：（内容略）',true);
                    this.data.newmsg.add(itemNm,itemNm +'：（内容略）',true);
                }
                break; 
            case 'approved_Meet':  
            case 'meet_name':           
                msg_o='';
                msg_n='';                
                if (this.data.pjdata.approved_Meet=='其他'){
                    msg_o = this.data.pjdata.approved_Meet + '(' + this.data.pjdata.meet_name + ')';
                }else{
                    msg_o = this.data.pjdata.approved_Meet ;
                }
                if (this.data.approved_Meet=='其他'){
                    msg_n = this.data.approved_Meet + '(' + this.data.meet_name + ')';
                }else{
                    msg_n =  this.data.approved_Meet ,true;
                }
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                } 
                break;
            case 'tuitionStandard':
            case 'swTS1':
            case 'swTS2':
            case 'swTS3':
            case 'swTS4':
            case 'swTS5':
            case 'swTS6':
            case 'swTS7':
            case 'swTS8':
            case 'costOther':
                msg_o='';
                msg_n='';   
                msg_o=this.data.pjdata.tuitionStandard+"元/人·天，包含以下费用（多选）："
                if (this.data.pjdata.swTS1){msg_o=msg_o+"学费、"}
                if (this.data.pjdata.swTS2){msg_o=msg_o+"书本资料费、"}
                if (this.data.pjdata.swTS3){msg_o=msg_o+"证书费、"}
                if (this.data.pjdata.swTS4){msg_o=msg_o+"实验平台使用费、"}
                if (this.data.pjdata.swTS5){msg_o=msg_o+"拓展培训、"}
                if (this.data.pjdata.swTS6){msg_o=msg_o+"食宿费、"}
                if (this.data.pjdata.swTS7){msg_o=msg_o+"交通费、"}
                if (this.data.pjdata.swTS8){msg_o=msg_o+"其他："+this.data.pjdata.costOther}
                if (msg_o.substr(msg_o.length-1,1)=="、"){msg_o=msg_o.substr(0,msg_o.length-1)}
                msg_n=this.data.tuitionStandard+"元/人·天，包含以下费用（多选）："
                if (this.data.swTS1){msg_n=msg_n+"学费、"}
                if (this.data.swTS2){msg_n=msg_n+"书本资料费、"}
                if (this.data.swTS3){msg_n=msg_n+"证书费、"}
                if (this.data.swTS4){msg_n=msg_n+"实验平台使用费、"}
                if (this.data.swTS5){msg_n=msg_n+"拓展培训、"}
                if (this.data.swTS6){msg_n=msg_n+"食宿费、"}
                if (this.data.swTS7){msg_n=msg_n+"交通费、"}
                if (this.data.swTS8){msg_n=msg_n+"其他："+this.data.costOther}
                if (msg_n.substr(msg_n.length-1,1)=="、"){msg_n=msg_n.substr(0,msg_n.length-1)}                
                if (msg_n == msg_o){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ msg_o,true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ msg_n,true);
                } 
                break;                                               
            default:
                if (this.data.pjdata[key] == this.data[key]){
                    this.data.oldmsg.add(itemNm,"",true);
                    this.data.newmsg.add(itemNm,"",true);
                }else{
                    this.data.oldmsg.add(itemNm,itemNm +'：'+ this.data.pjdata[key],true);
                    this.data.newmsg.add(itemNm,itemNm +'：'+ this.data[key],true);
                }
                break; 
        } 
        this.data.beforeupdate=this.makemsg(this.data.oldmsg);
        this.data.afterupdate=this.makemsg(this.data.newmsg);

});
this.define("makemsg",function(json){
    msg=""
    for (let key in json) {
        if (json[key] != ""){
            if(msg==""){
                msg = json[key];
            }else{
                msg = msg + '\n' +json[key];
            }      
        }
    }
    return msg;  
});

this.define("getdiff",function(date1,date2){
    return ((new Date(Date.parse(date1.replace(/-/g,"/"))) - new Date(Date.parse(date2.replace(/-/g,"/"))))/86400000+1)
});

this.define("tableTostr_1",function(data){
    if (data.length==0){
        return "\n\t无计划课表"
    }else{
        var str="";
        for (var i=0;i<data.length;i++){
            num = i+1
            str = str+"\n\t"+num+"、"+data[i].teacher_name+"（"+data[i].teacher_type+"："+data[i].unit+"）："+data[i].courseSubject+"（"+data[i].course_hours+"课时）"
        }
        return str;
    }
});

this.define("tableTostr_2",function(data){
    if (data.length==0){
        return "\n\t开设课程及师资介绍"
    }else{
        var str="";
        for (var i=0;i<data.length;i++){
            num = i+1
            str = str+"\n\t"+num+"、【"+data[i].teacher_type+"】"+data[i].teacher_name+"（"+data[i].teacher_profile+"）："+data[i].courseSubject+"（"+data[i].course_profile+"）"
        }
        return str;
    }
});

this.define("tableTostr_3",function(data){
    if (data.length==0){
        return "\n\t无兄弟高校办学情况"
    }else{
        var str="";
        for (var i=0;i<data.length;i++){
            num = i+1
            str = str+"\n\t"+num+"、"+data[i].school_name+"："+data[i].pjName+"（"+data[i].standard+"）"
        }
        return str;
    }
});

this.define("getTotalTuition",function(){
    this.data.totalTuition_1 = this.data.teacherfees +
        this.data.managementfee +
        this.data.materialfee +
        this.data.sitecost +
        this.data.onthespot +
        this.data.platformfee +
        this.data.accommodation +
        this.data.transportation +
        this.data.othercost;
});

this.define("getCost",function(){
    this.data.totalcost = this.data.teacher_fees +
        this.data.ost_fees +
        this.data.sitecost +
        this.data.transportation +
        this.data.travel_expenses +
        this.data.copy_fee +
        this.data.printing_fee +
        this.data.auxiliary_fees +
        this.data.service_fees +
        this.data.center_sitecost +
        this.data.classteacher_fees +
        this.data.management_fees +
        this.data.other_fees;
        this.getGrossProfit();
});
this.define("getIncome",function(){
    this.data.totalincome = this.data.training_revenue + this.data.other_revenue;
    this.getGrossProfit();
});
this.define("getGrossProfit",function(){
    this.data.gross_profit=this.data.totalincome-this.data.totalcost;
    if(this.data.totalincome!=0){
        this.data.gross_profit_rate=Math.round(this.data.gross_profit/this.data.totalincome * 10000) / 100;
        this.data.cost_rate=Math.round(this.data.totalcost/this.data.totalincome * 10000) / 100;
    }
});

this.define("chkCost",function(){
    this.chkChange.bind(this)("totalincome");
    this.chkChange.bind(this)("totalcost");
    this.chkChange.bind(this)("gross_profit");
    this.chkChange.bind(this)("gross_profit_rate");
    this.chkChange.bind(this)("cost_rate");
});

this.define("getDocID",function(type,pj_id){
        var viewName="";
        var item_id="";
    switch (type) {
        case "课表":
            viewName = "课表信息";
            item_id = "docTT_id";
            break;
        case "学员":
            viewName = "学员基本信息_选择用";
            item_id = "docStu_id";
            break;
        case "证书":
            viewName = "发证信息";
            item_id = "docCert_id";
            break;   
    }
    console.log(pj_id);
    console.log(viewName);
    this.view.lookup({
        "application": "项目管理",  //数据中心中的应用
        "view": viewName,     //视图的名称
        "filter": [ //（Array of Object）可选，对视图进行过滤的条件。json数组格式，每个数组元素描述一个过滤条件。
            {
                "logic":"and",
                "path":"project_id",
                "comparison":"equals",
                "value":pj_id,
                "formatType":"textValue"
            }
        ]
    }, function(items) {
        console.log(items);
        //如果选择了某个数据，将数据赋值给表单输入框
        if (items.grid.length) {
            console.log(type+":"+items.grid[0].data.document_id)
            this.data.add(item_id, items.grid[0].data.document_id, true);
        }
    }.bind(this));
});