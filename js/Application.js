mindmaps.ApplicationModel = function(eventBus) {
	var self = this;
	var document = null;

	this.setDocument = function(doc) {
		document = doc;
	};

	this.getDocument = function() {
		return document;
	};

	this.getMindMap = function() {
		if (document) {
			return document.mindmap;
		}
	};

	this.executeAction = function(action) {
		// do the action and give it context
		var executed = action.execute(this);
		
		// cancel action if false was returned
		if (executed !== undefined && !executed) {
			return false;
		}
		
		// publish event
		if (action.event) {
			if (!_.isArray(action.event)) {
				action.event = [ action.event ];
			}
			eventBus.publish.apply(eventBus, action.event);
		}

		// register undo function if available
		if (action.undo) {
			var undoFunc = function() {
				self.executeAction(action.undo());
			};
			
			// register redo function
			var redoFunc = null;
			if (action.redo) {
				redoFunc = function() {
					self.executeAction(action.redo());
				};
			}
			eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc, redoFunc);
		}
	};

	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		self.selectedNode = node;
	});
};

mindmaps.AppController = function(eventBus, appModel) {
	function bind() {
		eventBus.subscribe(mindmaps.Event.NEW_DOCUMENT, doNewDocument);

		eventBus.subscribe(mindmaps.Event.SAVE_DOCUMENT, doSaveDocument);

		eventBus.subscribe(mindmaps.Event.OPEN_DOCUMENT, function() {
			var presenter = new mindmaps.OpenDocumentPresenter(eventBus,
					appModel, new mindmaps.OpenDocumentView());
			presenter.go();
		});

		eventBus.subscribe(mindmaps.Event.CLOSE_DOCUMENT, function() {
			var doc = appModel.getDocument();
			if (doc) {
				// TODO close document presenter
				appModel.setDocument(null);
				eventBus.publish(mindmaps.Event.DOCUMENT_CLOSED, doc);
			}
		});
	}

	function doNewDocument() {
		// close old document first
		var doc = appModel.getDocument();
		if (doc) {
			// TODO for now simply publish events, should be intercepted by
			// someone
			eventBus.publish(mindmaps.Event.CLOSE_DOCUMENT);
			eventBus.publish(mindmaps.Event.DOCUMENT_CLOSED, doc);
		}

		var presenter = new mindmaps.NewDocumentPresenter(eventBus, appModel,
				new mindmaps.NewDocumentView());
		presenter.go();
	}

	function doSaveDocument() {
		/**
		 * If the document doesn't have a title yet show the save as presenter,
		 * otherwise just save the document.
		 */
		var doc = appModel.getDocument();
		var title = doc.title;
		if (title !== null) {
			var savedDoc = mindmaps.LocalDocumentStorage.saveDocument(doc);
			eventBus.publish(mindmaps.Event.DOCUMENT_SAVED);
		} else {
			var presenter = new mindmaps.SaveDocumentPresenter(eventBus,
					appModel, new mindmaps.SaveDocumentView());
			presenter.go();
		}
	}

	this.go = function() {
		var presenter = new mindmaps.MainPresenter(eventBus, appModel,
				new mindmaps.MainView());
		presenter.go();
	};

	bind();
};