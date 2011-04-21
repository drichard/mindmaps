var ToolBarView = function() {
	var self = this;
	MicroEvent.mixin(ToolBarView);
	
	this.$toolbar = $("#toolbar");
	
	$("#toolbar button").button();
	$("#toolbar .buttonset").buttonset();
	$("#button-undo").button("disable");
	$("#button-redo").button("disable");

	$("#button-open").click(function() {
		if (self.openButtonClicked) {
			self.openButtonClicked();
		}
	});
	
	
	$("#button-save").button("option", "icons", {
		primary : "ui-icon-disk"
	});
	
	$("#button-save").click(function() {
		if (self.saveButtonClicked) {
			self.saveButtonClicked();
		}
	});
	
	$("#button-close").button("option", "icons", {
		primary : "ui-icon-circle-close"
	});
	
	$("#button-draw").button();
	$("#button-draw").click(function() {
		self.publish("buttonDrawClicked");
	});
	
};


var ToolBarPresenter = function(view, eventBus) {
	this.view = view;
	
	view.saveButtonClicked = function() {
		eventBus.publish("saveDocumentRequested");
	};
	
	view.openButtonClicked = function() {
		eventBus.publish("openDocumentRequested");
	};
};