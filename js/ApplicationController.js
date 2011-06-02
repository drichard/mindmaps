mindmaps.ApplicationController = function() {
	var eventBus = new mindmaps.EventBus();
	var shortcutController = new mindmaps.ShortcutController();
	var commandRegistry = new mindmaps.CommandRegistry(shortcutController);
	var mindmapController = new mindmaps.MindMapController(eventBus,
			commandRegistry);
	var clipboardController = new mindmaps.ClipboardController(eventBus,
			commandRegistry, mindmapController);

	function doNewDocument() {
		// close old document first
		var doc = mindmapController.getDocument();
		// TODO for now simply publish events, should be intercepted by
		// someone
		doCloseDocument();

		var presenter = new mindmaps.NewDocumentPresenter(eventBus,
				mindmapController, new mindmaps.NewDocumentView());
		presenter.go();
	}

	function doSaveDocument() {
		var presenter = new mindmaps.SaveDocumentPresenter(eventBus,
				mindmapController, new mindmaps.SaveDocumentView());
		presenter.go();
	}

	function doCloseDocument() {
		var doc = mindmapController.getDocument();
		if (doc) {
			// TODO close document presenter
			mindmapController.setDocument(null);
		}
	}

	function doOpenDocument() {
		var presenter = new mindmaps.OpenDocumentPresenter(eventBus,
				mindmapController, new mindmaps.OpenDocumentView());
		presenter.go();
	}

	this.init = function() {
		var newDocumentCommand = commandRegistry
				.get(mindmaps.NewDocumentCommand);
		newDocumentCommand.setHandler(doNewDocument);

		var openDocumentCommand = commandRegistry
				.get(mindmaps.OpenDocumentCommand);
		openDocumentCommand.setHandler(doOpenDocument);

		var saveDocumentCommand = commandRegistry
				.get(mindmaps.SaveDocumentCommand);
		saveDocumentCommand.setHandler(doSaveDocument);

		var closeDocumentCommand = commandRegistry
				.get(mindmaps.CloseDocumentCommand);
		closeDocumentCommand.setHandler(doCloseDocument);
	};

	this.go = function() {
		var viewController = new mindmaps.MainViewController(eventBus,
				mindmapController, commandRegistry, new mindmaps.MainView());
		viewController.go();

		commandRegistry.get(mindmaps.NewDocumentCommand).execute();
	};
};