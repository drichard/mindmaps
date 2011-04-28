var SaveDocumentView = function() {
	
};

var SaveDocumentPresenter = function(eventBus, appModel, view) {
	this.go = function() {
		var doc = appModel.getDocument();
		var savedDoc = LocalDocumentStorage.saveDocument(doc);
		eventBus.publish("DocumentSavedEvent");
	};
};