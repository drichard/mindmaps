mindmaps.OpenDocumentView = function() {
	var self = this;

	// create dialog
	var $dialog = $("#template-open").tmpl().dialog({
		autoOpen : false,
		modal : true,
		zIndex : 5000,
		width : 550,
		close : function() {
			$(this).dialog("destroy");
			$(this).remove();
		}
	});

	$dialog.find("input").bind("change", function(e) {
		if (self.openExernalFileClicked) {
			self.openExernalFileClicked(e);
		}
	});

	var $table = $dialog.find(".localstorage-filelist");
	$table.delegate("a.title", "click", function() {
		if (self.documentClicked) {
			var t = $(this).tmplItem();
			self.documentClicked(t.data);
		}
	}).delegate("a.delete", "click", function() {
		if (self.deleteDocumentClicked) {
			var t = $(this).tmplItem();
			self.deleteDocumentClicked(t.data);
		}
	});

	this.render = function(docs) {
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
	};

	this.showOpenDialog = function(docs) {
		this.render(docs);
		$dialog.dialog("open");
	};

	this.hideOpenDialog = function() {
		$dialog.dialog("close");
	};
};

mindmaps.OpenDocumentPresenter = function(eventBus, mindmapController, view) {

	// TODO experimental, catch errrs
	// http://www.w3.org/TR/FileAPI/#dfn-filereader
	view.openExernalFileClicked = function(e) {
		var files = e.target.files;
		var file = files[0];

		var reader = new FileReader();
		reader.onload = function() {
			var doc = mindmaps.Document.fromJSON(reader.result);
			view.hideOpenDialog();
			mindmapController.setDocument(doc);
		};

		reader.readAsText(file);
	};

	view.documentClicked = function(doc) {
		view.hideOpenDialog();
		mindmapController.setDocument(doc);
	};

	view.deleteDocumentClicked = function(doc) {
		// TODO event
		mindmaps.LocalDocumentStorage.deleteDocument(doc);
		var docs = mindmaps.LocalDocumentStorage.getDocuments();
		view.render(docs);
	};

	this.go = function() {
		var docs = mindmaps.LocalDocumentStorage.getDocuments();
		docs.sort(mindmaps.Document.sortByModifiedDateDescending);
		view.showOpenDialog(docs);
	};
};