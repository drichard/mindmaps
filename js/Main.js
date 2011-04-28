$(function() {
	var eventBus = new EventBus();

	var toolbar = new ToolBarView();
	var toolbarPresenter = new ToolBarPresenter(toolbar, eventBus);

	var saveDocPresenter = new SaveDocumentPresenter(eventBus);
	
	var openDocView = new OpenDocumentView();
	var openDocPresenter = new OpenDocumentPresenter(openDocView, eventBus);
	
	var canvas = new DefaultCanvasView();
	var canvasPresenter = new CanvasPresenter(canvas, eventBus);

	var statusbar = new StatusBarView();
	var statusbarPresenter = new StatusBarPresenter(statusbar);

	var appView = new AppView(toolbar, canvas, statusbar);
	var appPresenter = new AppPresenter(appView);
	appPresenter.init();

	var map = getBinaryMapWithDepth(5);
	var doc = new Document();
	doc.mindmap = map;
	
	eventBus.publish("documentOpened", doc);

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

var OpenDocumentView = function() {
	var $openDialog = $("#open-dialog");
	$openDialog.dialog({
		autoOpen: false,
		modal: true
	});
	
	this.showOpenDialog = function(docs){
		// clear dialog
		$openDialog.children().remove();
		
		var $list = $("<ul/>");
		_.each(docs, function(doc) {
			var $listItem = $("<li/>", {
				text: doc.id
			});
			$list.append($listItem);
		});
		$openDialog.append($list);
		
		$openDialog.dialog("open");
	};
};

var OpenDocumentPresenter = function(view, eventBus) {
	var recentDocId = null;
	
	eventBus.subscribe("openDocumentRequested", function(){
		// TODO present load dialog
		var docs = LocalDocumentStorage.getDocuments();
		
		view.showOpenDialog(docs);
		
		
//		var docId;
//		if (recentDocId) {
//			docId = recentDocId;
//		} else {
//			// get any
//			var docs = LocalDocumentStorage.getDocuments();
//			docId = docs[0].id;
//		}
//
//		var loadedDoc = LocalDocumentStorage.loadDocument(docId);
//		eventBus.publish("documentOpened", loadedDoc);
	});
	
	eventBus.subscribe("documentSaved", function(doc) {
		recentDocId = doc.id;
	});

};

var SaveDocumentPresenter = function(eventBus) {
	eventBus.subscribe("documentOpened", function(doc){
		this.doc = doc;
	});
	
	eventBus.subscribe("saveDocumentRequested", function(){
		// TODO present save dialog
		//TODO move save operation somewhere else?
		var savedDoc = LocalDocumentStorage.saveDocument(this.doc);
		eventBus.publish("documentSaved", savedDoc);
	});
};