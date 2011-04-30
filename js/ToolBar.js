var ToolBarView = function() {
	var self = this;
	var saveButton = null;

	this.init = function() {
		$("#toolbar button").button();
		$("#toolbar .buttonset").buttonset();

		$("#button-delete").click(function() {
			if (self.deleteButtonClicked) {
				self.deleteButtonClicked();
			}
		});

		$("#button-undo").button("disable");
		$("#button-redo").button("disable");

		$("#button-new").click(function() {
			if (self.newButtonClicked) {
				self.newButtonClicked();
			}
		});

		$("#button-open").click(function() {
			if (self.openButtonClicked) {
				self.openButtonClicked();
			}
		});

		saveButton = $("#button-save").button("option", {
			icons : {
				primary : "ui-icon-disk"
			},
			disabled : true
		}).click(function() {
			if (self.saveButtonClicked) {
				self.saveButtonClicked();
			}
		});

		$("#button-close").button("option", "icons", {
			primary : "ui-icon-circle-close"
		});

		$("#button-draw").button();
		$("#button-binaryMap").button().click(function() {
			self.bigMapButtonClicked();
		});

	};

	/**
	 * Disable button for a little while show text that we just saved.
	 */
	this.showSaved = function() {
		var timeout = 2000;

		saveButton.button("option", {
			label : "saved"
		});

		setTimeout(function() {
			saveButton.button("option", {
				label : "save"
			});
		}, timeout);
	};

	this.enableSaveButton = function() {
		saveButton.button("enable");
	};
};

var ToolBarPresenter = function(eventBus, appModel, view) {
	// view callbacks
	view.deleteButtonClicked = function() {
		eventBus.publish(Event.DELETE_SELECTED_NODE);
	};

	view.saveButtonClicked = function() {
		eventBus.publish(Event.SAVE_DOCUMENT);
	};

	view.openButtonClicked = function() {
		eventBus.publish(Event.OPEN_DOCUMENT);
	};

	view.newButtonClicked = function() {
		eventBus.publish(Event.NEW_DOCUMENT);
	};

	view.bigMapButtonClicked = function() {
		var map = getBinaryMapWithDepth(8);
		var doc = new Document();
		doc.mindmap = map;
		appModel.setDocument(doc);
		eventBus.publish(Event.DOCUMENT_OPENED, doc);
	};

	// global events
	eventBus.subscribe(Event.DOCUMENT_SAVED, function() {
		view.showSaved();
	});

	eventBus.subscribe(Event.DOCUMENT_CREATED, function() {
		view.enableSaveButton();
	});

	eventBus.subscribe(Event.DOCUMENT_OPENED, function() {
		view.enableSaveButton();
	});

	this.go = function() {
		view.init();
	};
};