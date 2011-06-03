mindmaps.UndoController = function(eventBus, commandRegistry) {
	this.init = function() {
		this.undoCommand = commandRegistry.get(mindmaps.UndoCommand);
		this.undoCommand.setHandler(this.doUndo.bind(this));

		this.redoCommand = commandRegistry.get(mindmaps.RedoCommand);
		this.redoCommand.setHandler(this.doRedo.bind(this));
	};

	this.createUndoManager = function() {
		this.undoManager = new UndoManager();
		this.undoManager.stateChanged = this.undoStateChanged.bind(this);
		this.init();
	};

	this.undoStateChanged = function() {
		this.undoCommand.setEnabled(this.undoManager.canUndo());
		this.redoCommand.setEnabled(this.undoManager.canRedo());
		
//		// TODO remove
//		eventBus.publish(mindmaps.Event.UNDO_STATE_CHANGE, this.undoManager
//				.canUndo(), this.undoManager.canRedo());
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
		this.createUndoManager();
	};

	this.documentClosed = function() {
		eventBus.publish(mindmaps.Event.UNDO_STATE_CHANGE, false, false);
		this.undoManager = null;
		this.undoCommand.removeHandler();
		this.redoCommand.removeHandler();
	};

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened
			.bind(this));

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed
			.bind(this));
};