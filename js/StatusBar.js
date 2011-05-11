var mindmaps = mindmaps || {};

mindmaps.StatusBarView = function() {
	var self = this;

	this.init = function() {
	};

	this.createButton = function(id, text) {
		return $button = $("<button/>", {
			id : "statusbar-button-" + id
		}).button({
			label : text
		}).click(function() {
			if (self.buttonClicked) {
				self.buttonClicked(id);
			}
		}).prependTo($("#statusbar .buttons"));
	};
};

mindmaps.StatusBarPresenter = function(eventBus, view) {
	var buttonCounter = 0;
	var buttonIdDialogMap = {};

	view.buttonClicked = function(id) {
		buttonIdDialogMap[id].toggle();
	};

	this.go = function() {
		view.init();
	};

	this.addEntry = function(dialog) {
		var id = buttonCounter++;
		var $button = view.createButton(id, dialog.caption);
		dialog.$hideTarget = $button;
		buttonIdDialogMap[id] = dialog;
	};
};
