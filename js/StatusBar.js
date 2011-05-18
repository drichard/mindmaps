mindmaps.StatusBarView = function() {
	var self = this;

	this.init = function() {
	};

	this.createButton = function(id, text) {
		return $("<button/>", {
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
	var buttonIdPanelMap = {};

	view.buttonClicked = function(id) {
		buttonIdPanelMap[id].toggle();
	};

	this.go = function() {
		view.init();
	};

	this.addEntry = function(panel) {
		var id = buttonCounter++;
		var $button = view.createButton(id, panel.caption);
		panel.$hideTarget = $button;
		buttonIdPanelMap[id] = panel;
	};
};
