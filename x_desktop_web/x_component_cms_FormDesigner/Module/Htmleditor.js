MWF.xApplication.cms.FormDesigner.Module = MWF.xApplication.cms.FormDesigner.Module || {};
MWF.xDesktop.requireApp("process.FormDesigner", "Module.Htmleditor", null, false);
MWF.xApplication.cms.FormDesigner.Module.Htmleditor = MWF.CMSFCHtmleditor = new Class({
	Extends: MWF.FCHtmleditor,
	Implements : [MWF.CMSFCMI]
});
