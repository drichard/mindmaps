mindmaps.ApplicationController = function() {
	var eventBus = new mindmaps.EventBus();
	var shortcutController = new mindmaps.ShortcutController();
	var commandRegistry = new mindmaps.CommandRegistry(shortcutController);
	var undoController = new mindmaps.UndoController(eventBus, commandRegistry);
	var mindmapModel = new mindmaps.MindMapModel(eventBus, commandRegistry);
	var clipboardController = new mindmaps.ClipboardController(eventBus,
			commandRegistry, mindmapModel);

	function doNewDocument() {
		// close old document first
		var doc = mindmapModel.getDocument();
		// TODO for now simply publish events, should be intercepted by
		// someone
		doCloseDocument();

		var presenter = new mindmaps.NewDocumentPresenter(eventBus,
				mindmapModel, new mindmaps.NewDocumentView());
		presenter.go();
	}

	function doSaveDocument() {
		var presenter = new mindmaps.SaveDocumentPresenter(eventBus,
				mindmapModel, new mindmaps.SaveDocumentView());
		presenter.go();
	}

	function doCloseDocument() {
		var doc = mindmapModel.getDocument();
		if (doc) {
			// TODO close document presenter
			mindmapModel.setDocument(null);
		}
	}

	function doOpenDocument() {
		var presenter = new mindmaps.OpenDocumentPresenter(eventBus,
				mindmapModel, new mindmaps.OpenDocumentView());
		presenter.go();
	}

	this.init = function() {
		var newDocumentCommand = commandRegistry
				.get(mindmaps.NewDocumentCommand);
		newDocumentCommand.setHandler(doNewDocument);
		newDocumentCommand.setEnabled(true);

		var openDocumentCommand = commandRegistry
				.get(mindmaps.OpenDocumentCommand);
		openDocumentCommand.setHandler(doOpenDocument);
		openDocumentCommand.setEnabled(true);

		var saveDocumentCommand = commandRegistry
				.get(mindmaps.SaveDocumentCommand);
		saveDocumentCommand.setHandler(doSaveDocument);

		var closeDocumentCommand = commandRegistry
				.get(mindmaps.CloseDocumentCommand);
		closeDocumentCommand.setHandler(doCloseDocument);
		
		eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
			saveDocumentCommand.setEnabled(false);
			closeDocumentCommand.setEnabled(false);
		});
		
		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
			saveDocumentCommand.setEnabled(true);
			closeDocumentCommand.setEnabled(true);
		});

		// connect undo events emitted from mindmap model with undo controller
		mindmapModel.undoEvent = undoController.addUndo.bind(undoController);
	};

	this.go = function() {
		var viewController = new mindmaps.MainViewController(eventBus,
				mindmapModel, commandRegistry, new mindmaps.MainView());
		viewController.go();

		commandRegistry.get(mindmaps.NewDocumentCommand).execute();
	};
	
	this.init();
};