mindmaps.OpenDocumentView = function() {
	var self = this;

	// create dialog
	var $openDialog = $("<div/>", {
		id : "#open-dialog",
		title : "Open document"
	}).dialog({
		autoOpen : false,
		modal : true,
		zIndex : 5000
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

		var $openExternal = $("<input/>", {
			type : "file"
		}).button().bind("change", function(e) {
			if (self.externalFileSelected) {
				self.externalFileSelected(e);
			}
		});

		$openDialog.append($openExternal);

		$openDialog.dialog("open");
	};

	this.hideOpenDialog = function() {
		$openDialog.dialog("close");
	};
};

mindmaps.OpenDocumentPresenter = function(eventBus, appModel, view) {

	// TODO experimental
	//http://www.w3.org/TR/FileAPI/#dfn-filereader
	view.externalFileSelected = function(e) {
		var files = e.target.files;
		var file = files[0];

		var reader = new FileReader();
		reader.onload = function() {
			var doc = mindmaps.Document.fromJSON(reader.result);
			view.hideOpenDialog();
			appModel.setDocument(doc);
			eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc);

		};
		
		reader.readAsText(file);
	};

	view.documentClicked = function(doc) {
		view.hideOpenDialog();
		appModel.setDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc);
	};

	this.go = function() {
		var docs = mindmaps.LocalDocumentStorage.getDocuments();
		view.showOpenDialog(docs);
	};
};