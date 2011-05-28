mindmaps.SaveDocumentView = function() {
	var self = this;

	var $dialog = $("#template-save").tmpl().dialog({
		autoOpen : false,
		modal : true,
		zIndex : 5000,
		width : 550,
		close : function() {
			// remove dialog from DOM
			$(this).dialog("destroy");
			$(this).remove();
		}
	});

	var $localSorageButton = $("#button-save-localstorage").button().click(
			function() {
				if (self.localStorageButtonClicked) {
					self.localStorageButtonClicked();
				}
			});

	var $hddSaveButton = $("#button-save-hdd").button().downloadify({
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
			if (self.saveToHddComplete) {
				self.saveToHddComplete();
			}
		},
		onError : function() {
			console.log("error while saving to hdd");
		},
		swf : 'media/downloadify.swf',
		downloadImage : 'img/transparent.png',
		width : 65,
		height : 29,
		append : true
	});

	this.showSaveDialog = function() {
		$dialog.dialog("open");
	};

	this.hideSaveDialog = function() {
		$dialog.dialog("close");
	};
};

mindmaps.SaveDocumentPresenter = function(eventBus, appModel, view) {

	view.localStorageButtonClicked = function() {
		// update modified date
		var doc = appModel.getDocument();
		doc.dates.modified = new Date();
		var success = mindmaps.LocalDocumentStorage.saveDocument(doc);
		if (success) {
			eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
			view.hideSaveDialog();
		} else {
			// TODO display error hint
		}
	};

	view.fileNameRequested = function() {
		return appModel.getDocument().title + ".json";
	};

	view.fileContentsRequested = function() {
		var doc = appModel.getDocument();
		doc.dates.modified = new Date();
		return doc.serialize();
	};

	view.saveToHddComplete = function() {
		var doc = appModel.getDocument();
		eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
		view.hideSaveDialog();
	};

	this.go = function() {
		view.showSaveDialog();
	};
};