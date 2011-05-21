mindmaps.ToolBarView = function() {
	var self = this;
	var $copyButton = null;
	var $cutButton = null;
	var $pasteButton = null;

	var $undoButton = null;
	var $redoButton = null;
	var $saveButton = null;

	this.init = function() {
		$("#toolbar button").button();
		$("#toolbar .buttonset").buttonset();

		$("#button-add").click(function() {
			if (self.addButtonClicked) {
				self.addButtonClicked();
			}
		});

		$("#button-delete").click(function() {
			if (self.deleteButtonClicked) {
				self.deleteButtonClicked();
			}
		});

		$copyButton = $("#button-copy").click(function() {
			if (self.copyButtonClicked) {
				self.copyButtonClicked();
			}
		});

		$cutButton = $("#button-cut").click(function() {
			if (self.cutButtonClicked) {
				self.cutButtonClicked();
			}
		});

		$pasteButton = $("#button-paste").click(function() {
			if (self.pasteButtonClicked) {
				self.pasteButtonClicked();
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
		}).click(function() {
			if (self.closeButtonClicked) {
				self.closeButtonClicked();
			}
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

mindmaps.ToolBarPresenter = function(eventBus, appModel, view) {
	// view callbacks

	view.addButtonClicked = function() {
		var selectedNode = appModel.selectedNode;
		
		var action = new mindmaps.action.CreateAutoPositionedNodeAction(selectedNode);
		appModel.executeAction(action);
	};

	view.deleteButtonClicked = function() {
		var selectedNode = appModel.selectedNode;
		var action = new mindmaps.action.DeleteNodeAction(selectedNode);
		appModel.executeAction(action);
	};

	view.copyButtonClicked = function() {
		eventBus.publish(mindmaps.Event.COPY_NODE);
	};

	view.cutButtonClicked = function() {
		eventBus.publish(mindmaps.Event.CUT_NODE);
	};

	view.pasteButtonClicked = function() {
		eventBus.publish(mindmaps.Event.PASTE_NODE);
	};

	view.undoButtonClicked = function() {
		eventBus.publish(mindmaps.Event.DO_UNDO);
	};

	view.redoButtonClicked = function() {
		eventBus.publish(mindmaps.Event.DO_REDO);
	};

	view.saveButtonClicked = function() {
		eventBus.publish(mindmaps.Event.SAVE_DOCUMENT);
	};

	view.openButtonClicked = function() {
		eventBus.publish(mindmaps.Event.OPEN_DOCUMENT);
	};

	view.newButtonClicked = function() {
		eventBus.publish(mindmaps.Event.NEW_DOCUMENT);
	};

	view.closeButtonClicked = function() {
		eventBus.publish(mindmaps.Event.CLOSE_DOCUMENT);
	};

	view.bigMapButtonClicked = function() {
		var map = getBinaryMapWithDepth(8);
		var doc = new mindmaps.Document();
		doc.mindmap = map;
		appModel.setDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc);
	};

	// app model events
	eventBus.subscribe(mindmaps.Event.UNDO_STATE_CHANGE, function(undoState,
			redoState) {
		view.setUndoButtonEnabled(undoState);
		view.setRedoButtonEnabled(redoState);
	});

	// global events
	eventBus.subscribe(mindmaps.Event.DOCUMENT_SAVED, function() {
		view.showSaved();
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function() {
		view.enableSaveButton();
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
		view.enableSaveButton();
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
	});

	this.go = function() {
		view.init();
	};
};