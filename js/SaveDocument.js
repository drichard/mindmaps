mindmaps.SaveDocumentView = function() {
	var self = this;

	// create dialog
	var $saveDialog = $("<div/>", {
		id : "#save-dialog",
		title : "Save document"
	}).dialog({
		autoOpen : false,
		modal : true,
		zIndex : 5000,
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

	var $content = $("<div/>").append($("<span>Save as: <span>")).append(
			$titleInput);
	$saveDialog.html($content);

	// TODO optional save as button somewhere
	var $externalSave = $("<div/>", {
		id : "button-save-external"
	}).button({
		label : "Save"
	}).appendTo($content);

	$externalSave
			.downloadify({
				filename : function() {
					if (self.fileNameRequested) {
						return self.fileNameRequested();
					}
				},
				data : function() {
					if (self.fileContentsRequested) {
						return self.fileContentsRequested();
					}
				},
				onComplete : function() {
					self.hideSaveDialog();
				},
				onError : function() {
					alert('You must put something in the File Contents or there will be nothing to save!');
				},
				swf : '/media/downloadify.swf',
				downloadImage : '/img/transparent.png',
				width : 65,
				height : 29,
				append : true
			}).children().first().css("position", "absolute").next().css("position", "relative");

	
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

mindmaps.SaveDocumentPresenter = function(eventBus, appModel, view) {

	view.cancelButtonClicked = function() {
		view.hideSaveDialog();
	};

	view.saveButtonClicked = function() {
		var doc = appModel.getDocument();
		var title = view.getDocumentTitle();
		doc.title = title;
		var savedDoc = mindmaps.LocalDocumentStorage.saveDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
		view.hideSaveDialog();
	};
	
	view.fileNameRequested = function() {
		var doc = appModel.getDocument();
		var title = view.getDocumentTitle();
		return title + ".mms";
	};
	
	view.fileContentsRequested = function() {
		var doc = appModel.getDocument();
		doc.dates.modified = new Date();
		return doc.serialize();
	};

	this.go = function() {
		var map = appModel.getMindMap();
		var rootCaption = map.getRoot().getCaption();
		view.setDocumentTitle(rootCaption);
		view.showSaveDialog(rootCaption);
	};
};