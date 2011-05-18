
mindmaps.NewDocumentView = function() {

};

mindmaps.NewDocumentPresenter = function(eventBus, appModel, view) {

	this.go = function() {
		var doc = new mindmaps.Document();
		appModel.setDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_CREATED, doc);
	};
};