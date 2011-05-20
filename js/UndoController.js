mindmaps.UndoController = function(eventBus) {
	var undoManager = null;

	function createUndoManager() {
		undoManager = new UndoManager();
		undoManager.stateChanged = function() {
			var undoState = this.canUndo();
			var redoState = this.canRedo();
			eventBus.publish(mindmaps.Event.UNDO_STATE_CHANGE, undoState,
					redoState);
		};
	}

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
		createUndoManager();
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
		createUndoManager();
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
		// send explicit undo state event that no more undo or redo is possible
		// after document closing.
		eventBus.publish(mindmaps.Event.UNDO_STATE_CHANGE, false, false);
		undoManager = null;
	});

	eventBus.subscribe(mindmaps.Event.DO_UNDO, function() {
		undoManager.undo();
	});

	eventBus.subscribe(mindmaps.Event.DO_REDO, function() {
		undoManager.redo();
	});

	eventBus.subscribe(mindmaps.Event.UNDO_ACTION,
			function(undoFunc, redoFunc) {
				undoManager.addUndo(undoFunc, redoFunc);
			});
};