mindmaps.StatusBarView = function() {
	var self = this;
	var $statusbar = $("#statusbar");

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
		}).prependTo($statusbar.find(".buttons"));
	};

	this.getContent = function() {
		return $statusbar;
	};
};

mindmaps.StatusBarPresenter = function(eventBus, view) {
	var buttonCounter = 0;
	var buttonIdPanelMap = {};
	var statusController = new mindmaps.StatusNotificationController(eventBus,
			view.getContent());

	view.buttonClicked = function(id) {
		buttonIdPanelMap[id].toggle();
	};

	this.go = function() {
		view.init();

	};

	this.addEntry = function(panel) {
		var id = buttonCounter++;
		var $button = view.createButton(id, panel.caption);
		panel.setHideTarget($button);
		buttonIdPanelMap[id] = panel;
	};
};

mindmaps.StatusNotificationController = function(eventBus, view) {
	var $anchor = $("<div class='notification-anchor'/>").css({
		position : "absolute",
		right : 20
	}).appendTo(view);

	eventBus.subscribe(mindmaps.Event.DOCUMENT_SAVED, function() {
		var n = new mindmaps.Notification($anchor, {
			position : "topRight",
			expires : 2500,
			content : "Mind map saved"
		});
	});
};
