mindmaps.UndoController = function(eventBus, commandRegistry) {
	this.init = function() {
		this.undoManager = new UndoManager(64);
		this.undoManager.stateChanged = this.undoStateChanged.bind(this);

		this.undoCommand = commandRegistry.get(mindmaps.UndoCommand);
		this.undoCommand.setHandler(this.doUndo.bind(this));

		this.redoCommand = commandRegistry.get(mindmaps.RedoCommand);
		this.redoCommand.setHandler(this.doRedo.bind(this));
	};

	this.undoStateChanged = function() {
		this.undoCommand.setEnabled(this.undoManager.canUndo());
		this.redoCommand.setEnabled(this.undoManager.canRedo());
	};

	this.addUndo = function(undoFunc, redoFunc) {
		this.undoManager.addUndo(undoFunc, redoFunc);
	};

	this.doUndo = function() {
		this.undoManager.undo();
	};

	this.doRedo = function() {
		this.undoManager.redo();
	};

	this.documentOpened = function() {
	};

	this.documentClosed = function() {
		this.undoManager.reset();
		this.undoCommand.setEnabled(false);
		this.redoCommand.setEnabled(false);
	};

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened
			.bind(this));

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed
			.bind(this));

	this.init();
};