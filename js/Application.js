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
		eventBus.subscribe("SaveDocumentEvent", function(){
			var presenter = new SaveDocumentPresenter(eventBus, appModel, new SaveDocumentView());
			presenter.go();
		});
		
		eventBus.subscribe("OpenDocumentEvent", function(){
			var presenter = new OpenDocumentPresenter(eventBus, appModel, new OpenDocumentView());
			presenter.go();
		});
		
		eventBus.subscribe("NewDocumentEvent", function(){
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

	// TODO fix scrolling
	// #scroller doesnt resize
	// #drawing-area doesnt grow
	// canvas.enableScroll();
	// $("#scroller").scrollview();
	var scroller = $("#scroller");
	var drawArea = $("#drawing-area");

	// appView.canvas.enableScroll();
	$("#canvas-container").scrollview({
		scrollArea : scroller,
		doubleClick : false
	});
});
