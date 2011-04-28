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

var OpenDocumentPresenter = function(eventBus, appModel, view) {

	view.documentClicked = function(doc) {
		view.hideOpenDialog();
		appModel.setDocument(doc);
		eventBus.publish("DocumentOpenedEvent");
	};
	
	this.go = function(){
		var docs = LocalDocumentStorage.getDocuments();
		view.showOpenDialog(docs);
	};
};