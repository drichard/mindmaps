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

		$pasteButton = $("#button-paste").button("disable").click(function() {
			if (self.pasteButtonClicked) {
				self.pasteButtonClicked();
			}
		});

		$undoButton = $("#button-undo").click(function() {
			if (self.undoButtonClicked) {
				self.undoButtonClicked();
			}
		});

		$redoButton = $("#button-redo").click(function() {
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

	this.createButton = function(button) {
		var $button = $("<button/>", {
			id : button.getId(),
			title : button.getToolTip()
		}).click(function() {
			button.click();
		}).button({
			label:  button.getTitle()
		});
		
		return $button;
	};


	this.addButtonSet = function(buttons) {

	};
	
	this.addToLeft = function($button) {
		$button.appendTo("#toolbar .buttons-left");
	};
	
	this.addToRight = function($button) {
		$button.appendTo("#toolbar .buttons-right");
	};
};

mindmaps.ToolBarPresenter = function(eventBus, commandRegistry, view) {
	function Button(command) {
		this.command = command;
	}

	Button.prototype.click = function() {
		this.command.execute();
	};

	Button.prototype.getTitle = function() {
		return this.command.label;
	};

	Button.prototype.getToolTip = function() {
		return this.command.description;
	};

	Button.prototype.getId = function() {
		return "button-" + this.command.id;
	};

	// view callbacks
	var pasteNodeCommand = commandRegistry.get(mindmaps.PasteNodeCommand);
	pasteNodeCommand.subscribe(mindmaps.CommandEvent.ENABLED_CHANGED, function(
			enabled) {
		$("#button-paste").button(enabled ? "enable" : "disable");
	});

//	// TODO add view buttons by command definitions
//	var nodeCommands = [ mindmaps.CreateNodeCommand, mindmaps.DeleteNodeCommand ];
//	nodeCommands.forEach(function(commandType) {
//		var command = commandRegistry.get(commandType);
//		view.createButton(new Button(command));
//	});
	var command = commandRegistry.get(mindmaps.CreateNodeCommand);
	view.addToLeft(view.createButton(new Button(command)));

	view.addButtonClicked = function() {
		var createNodeCommand = commandRegistry.get(mindmaps.CreateNodeCommand);
		createNodeCommand.execute();
		// eventBus.publish(mindmaps.Event.NEW_NODE);
	};

	view.deleteButtonClicked = function() {
		var deleteNodeCommand = commandRegistry.get(mindmaps.DeleteNodeCommand);
		deleteNodeCommand.execute();
	};

	view.copyButtonClicked = function() {
		var copyNodeCommand = commandRegistry.get(mindmaps.CopyNodeCommand);
		copyNodeCommand.execute();
	};

	view.cutButtonClicked = function() {
		var cutNodeCommand = commandRegistry.get(mindmaps.CutNodeCommand);
		cutNodeCommand.execute();
	};

	view.pasteButtonClicked = function() {
		pasteNodeCommand.execute();
	};

	view.undoButtonClicked = function() {
		var undoCommand = commandRegistry.get(mindmaps.UndoCommand);
		undoCommand.execute();
	};

	view.redoButtonClicked = function() {
		var redoCommand = commandRegistry.get(mindmaps.RedoCommand);
		redoCommand.execute();
	};

	view.saveButtonClicked = function() {
		var ndc = commandRegistry.get(mindmaps.SaveDocumentCommand);
		ndc.execute();
	};

	view.openButtonClicked = function() {
		var ndc = commandRegistry.get(mindmaps.OpenDocumentCommand);
		ndc.execute();
	};

	view.newButtonClicked = function() {
		var ndc = commandRegistry.get(mindmaps.NewDocumentCommand);
		ndc.execute();
	};

	view.closeButtonClicked = function() {
		var ndc = commandRegistry.get(mindmaps.CloseDocumentCommand);
		ndc.execute();
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