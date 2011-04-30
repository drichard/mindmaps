var SaveDocumentView = function() {
	var self = this;

	// create dialog
	var $saveDialog = $("<div/>", {
		id : "#save-dialog",
		title : "Save document"
	}).dialog({
		autoOpen : false,
		modal : true,
		buttons : {
			"Save" : function() {
				if (self.saveButtonClicked) {
					self.saveButtonClicked();
				}
			},
			"Cancel" : function() {
				if (self.cancelButtonClicked) {
					self.cancelButtonClicked();
				}
			}
		}
	});

	var $titleInput = $("<input/>", {
		type : "text"
	});

	// TODO optional save as button somewhere
	var $content = $("<div/>").append($("<span>Save as: <span>")).append(
			$titleInput);
	$saveDialog.html($content);

	this.showSaveDialog = function(title) {
		$saveDialog.dialog("open");
	};

	this.hideSaveDialog = function() {
		$saveDialog.dialog("close");
	};

	this.getDocumentTitle = function() {
		return $titleInput.val();
	};

	this.setDocumentTitle = function(title) {
		$titleInput.val(title);
	};
};

var SaveDocumentPresenter = function(eventBus, appModel, view) {

	view.cancelButtonClicked = function() {
		view.hideSaveDialog();
	};

	view.saveButtonClicked = function() {
		var doc = appModel.getDocument();
		var title = view.getDocumentTitle();
		doc.setTitle(title);
		var savedDoc = LocalDocumentStorage.saveDocument(doc);
		eventBus.publish(Event.DOCUMENT_SAVED);
		view.hideSaveDialog();
	};

	this.go = function() {
		var map = appModel.getMindMap();
		var rootCaption = map.getRoot().getCaption();
		view.setDocumentTitle(rootCaption);
		view.showSaveDialog(rootCaption);
	};
};