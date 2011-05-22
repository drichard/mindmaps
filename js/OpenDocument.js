mindmaps.OpenDocumentView = function() {
	var self = this;

	// create dialog
	var $dialog = $("#template-open").tmpl().dialog({
		autoOpen : false,
		modal : true,
		zIndex : 5000
	}).delegate("a.title", "click", function() {
		var t = $(this).tmplItem();
		if (self.documentClicked) {
			self.documentClicked(t.data);
		}
	});

	$dialog.find("input").bind("change", function(e) {
		if (self.externalFileSelected) {
			self.externalFileSelected(e);
		}
	});


	this.showOpenDialog = function(docs) {
		// empty list and insert list of documents
		var $list = $(".document-list", $dialog).empty();

		$("#template-open-table-item").tmpl(docs, {
			format : function(date) {
				var day = date.getDate();
				var month = date.getMonth() + 1;
				var year = date.getFullYear();
				return day + "/" + month + "/" + year;
			}
		}).appendTo($list);

		$dialog.dialog("open");
	};

	this.hideOpenDialog = function() {
		$dialog.dialog("close");
	};
};

mindmaps.OpenDocumentPresenter = function(eventBus, appModel, view) {

	// TODO experimental
	// http://www.w3.org/TR/FileAPI/#dfn-filereader
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