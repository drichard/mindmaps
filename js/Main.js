$(function() {
	var eventBus = new EventBus();

	var toolbar = new ToolBarView();
	var toolbarPresenter = new ToolBarPresenter(toolbar, eventBus);

	var saveDocPresenter = new SaveDocumentPresenter(eventBus);
	var loadDocPresenter = new LoadDocumentPresenter(eventBus);
	
	var canvas = new CanvasView();
	var canvasPresenter = new CanvasPresenter(canvas, eventBus);

	var statusbar = new StatusBarView();
	var statusbarPresenter = new StatusBarPresenter(statusbar);

	var appView = new AppView(toolbar, canvas, statusbar);
	var appPresenter = new AppPresenter(appView);
	// appPresenter.init();

	var map = getBinaryMapWithDepth(5);
	var doc = new Document();
	doc.mindmap = map;
	
	eventBus.publish("documentLoaded", doc);

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

var LoadDocumentPresenter = function(eventBus) {
	var recentDocId = null;
	
	eventBus.subscribe("openDocumentRequested", function(){
		// TODO present load dialog
		
		var docId;
		if (recentDocId) {
			docId = recentDocId;
		} else {
			// get any
			var docs = LocalDocumentStorage.getDocuments();
			docId = docs[0].id;
		}

		var loadedDoc = LocalDocumentStorage.loadDocument(docId);
		eventBus.publish("documentLoaded", loadedDoc);
	});
	
	eventBus.subscribe("documentSaved", function(doc) {
		recentDocId = doc.id;
	});

};

var SaveDocumentPresenter = function(eventBus) {
	eventBus.subscribe("documentLoaded", function(doc){
		this.doc = doc;
	});
	
	eventBus.subscribe("saveDocumentRequested", function(){
		// TODO present save dialog
		//TODO move save operation somewhere else?
		var savedDoc = LocalDocumentStorage.saveDocument(this.doc);
		eventBus.publish("documentSaved", savedDoc);
	});
};