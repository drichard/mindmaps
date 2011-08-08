/**
 * Creates a new Application Controller.
 * 
 * @constructor
 */
mindmaps.ApplicationController = function() {
	var eventBus = new mindmaps.EventBus();
	var shortcutController = new mindmaps.ShortcutController();
	var commandRegistry = new mindmaps.CommandRegistry(shortcutController);
	var undoController = new mindmaps.UndoController(eventBus, commandRegistry);
	var mindmapModel = new mindmaps.MindMapModel(eventBus, commandRegistry);
	var clipboardController = new mindmaps.ClipboardController(eventBus,
			commandRegistry, mindmapModel);
	var helpController = new mindmaps.HelpController(eventBus, commandRegistry);

	/**
	 * Handles the new document command.
	 */
	function doNewDocument() {
		// close old document first
		var doc = mindmapModel.getDocument();
		doCloseDocument();

		var presenter = new mindmaps.NewDocumentPresenter(eventBus,
				mindmapModel, new mindmaps.NewDocumentView());
		presenter.go();
	}

	/**
	 * Handles the save document command.
	 */
	function doSaveDocument() {
		var presenter = new mindmaps.SaveDocumentPresenter(eventBus,
				mindmapModel, new mindmaps.SaveDocumentView());
		presenter.go();
	}

	/**
	 * Handles the close document command.
	 */
	function doCloseDocument() {
		var doc = mindmapModel.getDocument();
		if (doc) {
			// TODO for now simply publish events, should be intercepted by
			// someone
			mindmapModel.setDocument(null);
		}
	}

	/**
	 * Handles the open document command.
	 */
	function doOpenDocument() {
		var presenter = new mindmaps.OpenDocumentPresenter(eventBus,
				mindmapModel, new mindmaps.OpenDocumentView());
		presenter.go();
	}

	function doPrintDocument() {
		var action = mindmaps.StaticCanvas.Action.Print;
		mindmaps.StaticCanvas.launch(mindmapModel.getDocument(), action);
	}

	function doExportDocument() {
		var action = mindmaps.StaticCanvas.Action.SaveAsPNG;
		mindmaps.StaticCanvas.launch(mindmapModel.getDocument(), action);
	}

	/**
	 * Initializes the controller, registers for all commands and subscribes to
	 * event bus.
	 */
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

		var exportCommand = commandRegistry.get(mindmaps.ExportCommand);
		exportCommand.setHandler(doExportDocument);

		var printCommand = commandRegistry.get(mindmaps.PrintCommand);
		printCommand.setHandler(doPrintDocument);

		eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
			saveDocumentCommand.setEnabled(false);
			closeDocumentCommand.setEnabled(false);
			exportCommand.setEnabled(false);
			printCommand.setEnabled(false);
		});

		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
			saveDocumentCommand.setEnabled(true);
			closeDocumentCommand.setEnabled(true);
			exportCommand.setEnabled(true);
			printCommand.setEnabled(true);
		});

		// connect undo events emitted from mindmap model with undo controller
		mindmapModel.undoEvent = undoController.addUndo.bind(undoController);
	};

	/**
	 * Launches the main view controller.
	 */
	this.go = function() {
		var viewController = new mindmaps.MainViewController(eventBus,
				mindmapModel, commandRegistry);
		viewController.go();

		doNewDocument();
	};

	this.init();
};