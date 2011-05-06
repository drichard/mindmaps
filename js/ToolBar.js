var ToolBarView = function() {
	var self = this;
	var $undoButton = null;
	var $redoButton = null;
	var $saveButton = null;

	this.init = function() {
		$("#toolbar button").button();
		$("#toolbar .buttonset").buttonset();

		$("#button-delete").click(function() {
			if (self.deleteButtonClicked) {
				self.deleteButtonClicked();
			}
		});

		$undoButton = $("#button-undo").button("disable").click(function() {
			if (self.undoButtonClicked) {
				self.undoButtonClicked();
			}
		});

		$redoButton = $("#button-redo").button("disable").click(function() {
			if (self.redoButtonClicked) {
				self.redoButtonClicked();
			}
		});

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

		$saveButton = $("#button-save").button("option", {
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

		$saveButton.button("option", {
			label : "saved"
		});

		setTimeout(function() {
			$saveButton.button("option", {
				label : "save"
			});
		}, timeout);
	};

	this.enableSaveButton = function() {
		$saveButton.button("enable");
	};

	this.setUndoButtonEnabled = function(enabled) {
		$undoButton.button(enabled ? "enable" : "disable");
	};

	this.setRedoButtonEnabled = function(enabled) {
		$redoButton.button(enabled ? "enable" : "disable");
	};
};

var ToolBarPresenter = function(eventBus, appModel, view) {
	// view callbacks
	view.deleteButtonClicked = function() {
		eventBus.publish(Event.DELETE_SELECTED_NODE);
	};

	view.undoButtonClicked = function() {
		// eventBus.publish(Event.UNDO_ACTION);
		appModel.doUndo();
	};

	view.redoButtonClicked = function() {
		// eventBus.publish(Event.REDO_ACTION);
		appModel.doRedo();
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

	// app model events
	appModel.subscribe(ApplicationModel.Event.UNDO_STATE_CHANGE, function(
			undoState, redoState) {
		view.setUndoButtonEnabled(undoState);
		view.setRedoButtonEnabled(redoState);
	});

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