var mindmaps = mindmaps || {};

mindmaps.OpenDocumentView = function() {
	var self = this;
	
	// create dialog
	var $openDialog = $("<div/>", {
		id: "#open-dialog",
		title: "Open document"
	}).dialog({
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

mindmaps.OpenDocumentPresenter = function(eventBus, appModel, view) {

	view.documentClicked = function(doc) {
		view.hideOpenDialog();
		appModel.setDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc);
	};
	
	
	this.go = function(){
		var docs = mindmaps.LocalDocumentStorage.getDocuments();
		view.showOpenDialog(docs);
	};
};