MWF.xDesktop.requireApp("process.Xform", "Actionbar", null, false);
MWF.xApplication.cms.Xform.Actionbar = MWF.CMSActionbar =  new Class({
	Extends: MWF.APPActionbar,

	_loadUserInterface: function(){
        if (this.form.json.mode == "Mobile"){
            this.node.empty();
        }else if (COMMON.Browser.Platform.isMobile){
            this.node.empty();
        }else{
            this.toolbarNode = this.node.getFirst("div");
            this.toolbarNode.empty();

            MWF.require("MWF.widget.SimpleToolbar", function(){
                this.toolbarWidget = new MWF.widget.SimpleToolbar(this.toolbarNode, {"style": this.json.style}, this);

                //var json = this.readonly ? this.json.sysTools.readTools : this.json.sysTools.editTools;
                //if( this.json.style == "xform_red_simple" ){
                //    json.each( function( j ){
                //        var names = j.img.split(".");
                //        j.img = names[0] + "_red." + names[1];
                //    });
                //}
                //this.setToolbars(json, this.toolbarNode);
                //this.setCustomToolbars(this.json.tools, this.toolbarNode);
                //
                //this.toolbarWidget.load();

                MWF.getJSON("/x_component_cms_Xform/$Form/toolbars.json", function(json){
                    this.setToolbars(json, this.toolbarNode, this.readonly);
                    this.setCustomToolbars(this.json.tools, this.toolbarNode);

                    this.toolbarWidget.load();
                }.bind(this), false);
            }.bind(this));
        }
	},
    setCustomToolbars: function(tools, node){
        tools.each(function(tool){
            var flag = true;
            if (this.readonly){
                flag = tool.readShow;
            }else{
                flag = tool.editShow;
            }
            if (flag){
                flag = true;
                if (tool.control){
                    flag = this.form.businessData.control[tool.control]
                }
                if (tool.condition){
                    var hideFlag = this.form.Macro.exec(tool.condition, this);
                    flag = !hideFlag;
                }
                if (flag){
                    var actionNode = new Element("div", {
                        "id": tool.id,
                        "MWFnodetype": tool.type,
                        //"MWFButtonImage": this.form.path+""+this.form.options.style+"/actionbar/"+tool.img,
                        //"MWFButtonImageOver": this.form.path+""+this.form.options.style+"/actionbar/"+tool.img_over,
                        "MWFButtonImage": "/x_component_cms_FormDesigner/Module/Actionbar/"+ (this.options.style||"default") +"/tools/"+ (this.json.style || "default") +"/"+tool.img,
                        "MWFButtonImageOver": "/x_component_cms_FormDesigner/Module/Actionbar/"+ (this.options.style||"default")+"/tools/"+ (this.json.style || "default") +"/"+tool.img_over,
                        "title": tool.title,
                        "MWFButtonAction": "runCustomAction",
                        "MWFButtonText": tool.text
                    }).inject(node);
                    if (tool.actionScript){
                        actionNode.store("script", tool.actionScript);
                    }
                    if (tool.sub){
                        var subNode = node.getLast();
                        this.setCustomToolbars(tool.sub, subNode);
                    }
                }
            }
        }.bind(this));
    },
    setToolbars: function(tools, node, readonly){
        tools.each(function(tool){
            var flag = true;
            if (tool.control){
                flag = this.form.businessData.control[tool.control]
            }
            if (tool.id == "action_processWork"){
                if (!this.form.businessData.task){
                    flag = false;
                }
            }
            if (readonly){
                if (!tool.read) flag = false;
            }else{
                if (!tool.edit) flag = false;
            }
            if (flag){
                var actionNode = new Element("div", {
                    "id": tool.id,
                    "MWFnodetype": tool.type,
                    "MWFButtonImage": "/x_component_cms_FormDesigner/Module/Actionbar/"+(this.options.style||"default") +"/tools/"+ (this.json.style || "default") +"/"+tool.img,
                    "MWFButtonImageOver": "/x_component_cms_FormDesigner/Module/Actionbar/"+(this.options.style||"default")+"/tools/"+ (this.json.style || "default") +"/"+tool.img_over,
                    "title": tool.title,
                    "MWFButtonAction": tool.action,
                    "MWFButtonText": tool.text,
                }).inject(node);
                if (tool.sub){
                    var subNode = node.getLast();
                    this.setToolbars(tool.sub, subNode);
                }
            }
        }.bind(this));
    },
    runCustomAction: function(bt){
        var script = bt.node.retrieve("script");
        this.form.Macro.exec(script, this);
    },
    saveDocument: function(){
        this.form.saveDocument();
    },
    closeDocument: function(){
        this.form.closeDocument();
    },
    publishDocument: function(){
        this.form.publishDocument();
    },
    archiveDocument: function(){
        this.form.archiveDocument();
    },
    redraftDocument: function(){
        this.form.redraftDocument();
    },
    deleteDocument: function(){
        this.form.deleteDocument();
    },
    editDocument: function(){
        this.form.editDocument();
    },
    setPopularDocument: function(){
        this.form.setPopularDocument();
    }
}); 