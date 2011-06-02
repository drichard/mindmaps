
mindmaps.NewDocumentView = function() {

};

mindmaps.NewDocumentPresenter = function(eventBus, mindmapModel, view) {

	this.go = function() {
		var doc = new mindmaps.Document();
		mindmapModel.setDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc, true);
	};
};