mindmaps.UndoController = function(eventBus, appModel) {
	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
		var undoManager = new UndoManager();
		appModel.setUndoManager(undoManager);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
		var undoManager = new UndoManager();
		appModel.setUndoManager(undoManager);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
		appModel.setUndoManager(null);
	});
};