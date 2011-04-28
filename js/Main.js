$(function() {
	var eventBus = new EventBus();

	var toolbar = new ToolBarView();
	var toolbarPresenter = new ToolBarPresenter(toolbar, eventBus);

	var newDocPresenter = new NewDocumentPresenter(eventBus);
	
	var openDocView = new OpenDocumentView();
	var openDocPresenter = new OpenDocumentPresenter(openDocView, eventBus);
	
	var saveDocPresenter = new SaveDocumentPresenter(eventBus);

	var canvas = new DefaultCanvasView();
	var canvasPresenter = new CanvasPresenter(canvas, eventBus);

	var statusbar = new StatusBarView();
	var statusbarPresenter = new StatusBarPresenter(statusbar);

	var appView = new AppView(toolbar, canvas, statusbar);
	var appPresenter = new AppPresenter(appView);
	appPresenter.init();

//	var map = getBinaryMapWithDepth(5);
//	var doc = new Document();
//	doc.mindmap = map;
//	eventBus.publish("documentOpened", doc);

	eventBus.publish("newDocumentCreated", new Document());
	
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

var NewDocumentPresenter = function(eventBus) {
	eventBus.subscribe("newDocumentRequested", function() {
		var doc = new Document();
		eventBus.publish("newDocumentCreated", doc);
	});
};

var OpenDocumentView = function() {
	var self = this;
	var $openDialog = $("#open-dialog").dialog({
		autoOpen : false,
		modal : true
	});

	this.showOpenDialog = function(docs) {
		// construct list of documents in local storage
		var $list = $("<ul/>");
		_.each(docs, function(doc) {
			var $listItem = $("<li/>");
			var $openLink = $("<a/>", {
				text : doc.title,
				href : "#"
			}).click(function() {
				if (self.documentClicked) {
					self.documentClicked(doc);
				}
			}).appendTo($listItem);
			$list.append($listItem);
		});
		$openDialog.html($list);

		$openDialog.dialog("open");
	};

	this.hideOpenDialog = function() {
		$openDialog.dialog("close");
	};
};


var OpenDocumentPresenter = function(view, eventBus) {

	eventBus.subscribe("openDocumentRequested", function() {
		// present load dialog
		var docs = LocalDocumentStorage.getDocuments();
		view.showOpenDialog(docs);
	});

	eventBus.subscribe("documentSaved", function(doc) {
	});

	view.documentClicked = function(doc) {
		view.hideOpenDialog();
		eventBus.publish("documentOpened", doc);
	};

};

var SaveDocumentPresenter = function(eventBus) {
	eventBus.subscribe("documentOpened", function(doc) {
		this.doc = doc;
	});
	
	eventBus.subscribe("newDocumentCreated", function(doc) {
		this.doc = doc;
	});

	eventBus.subscribe("saveDocumentRequested", function() {
		// TODO present save dialog
		// TODO move save operation somewhere else?
		var savedDoc = LocalDocumentStorage.saveDocument(this.doc);
		eventBus.publish("documentSaved", savedDoc);
	});
};