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
		eventBus.subscribe(Event.SAVE_DOCUMENT, function(){
			var presenter = new SaveDocumentPresenter(eventBus, appModel, new SaveDocumentView());
			presenter.go();
		});
		
		eventBus.subscribe(Event.OPEN_DOCUMENT, function(){
			var presenter = new OpenDocumentPresenter(eventBus, appModel, new OpenDocumentView());
			presenter.go();
		});
		
		eventBus.subscribe(Event.NEW_DOCUMENT, function(){
			var presenter = new NewDocumentPresenter(eventBus, appModel, new NewDocumentView());
			presenter.go();
		});
			
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

	// var map = getBinaryMapWithDepth(5);
	// var doc = new Document();
	// doc.mindmap = map;
	// eventBus.publish("documentOpened", doc);
});
