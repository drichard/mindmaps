// global debug flag
var DEBUG = true;

var ApplicationModel = function() {
	var document = null;

	this.setDocument = function(doc) {
		document = doc;
	};

	this.getDocument = function() {
		return document;
	};

	this.getMindMap = function() {
		if (document) {
			return document.mindmap;
		}
	};
};

var AppController = function(eventBus, appModel) {
	function bind() {
		eventBus.subscribe(Event.SAVE_DOCUMENT, function() {
			doSaveDocument();
		});

		eventBus.subscribe(Event.OPEN_DOCUMENT, function() {
			var presenter = new OpenDocumentPresenter(eventBus, appModel,
					new OpenDocumentView());
			presenter.go();
		});

		eventBus.subscribe(Event.NEW_DOCUMENT, function() {
			var presenter = new NewDocumentPresenter(eventBus, appModel,
					new NewDocumentView());
			presenter.go();
		});

	}

	function doSaveDocument() {
		/**
		 * If the document doesn't have a title yet show the save as presenter,
		 * otherwise just save the document.
		 */
		var doc = appModel.getDocument();
		var title = doc.getTitle();
		if (title !== null) {
			var savedDoc = LocalDocumentStorage.saveDocument(doc);
			eventBus.publish(Event.DOCUMENT_SAVED);
		} else {
			var presenter = new SaveDocumentPresenter(eventBus, appModel,
					new SaveDocumentView());
			presenter.go();
		}
	}

	this.go = function() {
		var presenter = new MainPresenter(eventBus, appModel, new MainView());
		presenter.go();
	};

	bind();
};

// start up
$(function() {
	var eventBus = new EventBus();
	var appModel = new ApplicationModel();
	var appController = new AppController(eventBus, appModel);
	appController.go();
	
	//eventBus.publish(Event.OPEN_DOCUMENT);

	// var map = getBinaryMapWithDepth(5);
	// var doc = new Document();
	// doc.mindmap = map;
	// eventBus.publish("documentOpened", doc);
});
