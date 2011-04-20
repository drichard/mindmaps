var ToolBarView = function() {
	var self = this;
	MicroEvent.mixin(ToolBarView);
	
	this.$toolbar = $("#toolbar");
	
	$("#toolbar button").button();
	$("#toolbar .buttonset").buttonset();
	$("#button-undo").button("disable");
	$("#button-redo").button("disable");

	$("#button-save").button("option", "icons", {
		primary : "ui-icon-disk"
	});
	$("#button-close").button("option", "icons", {
		primary : "ui-icon-circle-close"
	});
	
	$("#button-draw").button();
	$("#button-draw").click(function() {
		self.publish("buttonDrawClicked");
	});
};


var ToolBarPresenter = function(view) {
	this.view = view;
};