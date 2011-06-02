
mindmaps.NewDocumentView = function() {

};

mindmaps.NewDocumentPresenter = function(eventBus, mindmapController, view) {

	this.go = function() {
		var doc = new mindmaps.Document();
		mindmapController.setDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc, true);
	};
};