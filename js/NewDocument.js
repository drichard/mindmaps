var NewDocumentView = function() {
	
};

var NewDocumentPresenter = function(eventBus, appModel, view) {
	
	this.go = function() {
		var doc = new Document();
		appModel.setDocument(doc);
		eventBus.publish("DocumentCreatedEvent");
	};
};