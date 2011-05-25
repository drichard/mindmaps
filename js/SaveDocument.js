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

	var $hddSaveButton = $("#button-save-hdd")
			.button()
			.downloadify(
					{
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
					}).children().first().css("position", "absolute").next()
			.css("position", "relative");

	this.showSaveDialog = function() {
		$dialog.dialog("open");
	};

	this.hideSaveDialog = function() {
		$dialog.dialog("close");
	};
};

mindmaps.SaveDocumentPresenter = function(eventBus, appModel, view) {

	view.cancelButtonClicked = function() {
		view.hideSaveDialog();
	};

	view.localStorageButtonClicked = function() {
		var doc = appModel.getDocument();
		var savedDoc = mindmaps.LocalDocumentStorage.saveDocument(doc);
		eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
		view.hideSaveDialog();
	};

	view.fileNameRequested = function() {
		var doc = appModel.getDocument();
		var title = doc.title;
		return title + ".mms";
	};

	view.fileContentsRequested = function() {
		var doc = appModel.getDocument();
		doc.dates.modified = new Date();
		return doc.serialize();
	};

	this.go = function() {
		view.showSaveDialog();
	};
};