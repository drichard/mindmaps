mindmaps.ApplicationModel = function(eventBus) {
	
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

	eventBus.subscribe(mindmaps.Event.NEW_NODE, function() {
		var action = new mindmaps.action.CreateAutoPositionedNodeAction(
				self.selectedNode);
		self.executeAction(action);
	});

	eventBus.subscribe(mindmaps.Event.DELETE_NODE, function() {
		var action = new mindmaps.action.DeleteNodeAction(self.selectedNode);
		self.executeAction(action);
	});

	// TODO put somewhere else?
	eventBus.subscribe(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED,
			function(node) {
				// change document title when root was renamed
				if (node.isRoot()) {
					document.title = node.getCaption();
				}
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
		var presenter = new mindmaps.SaveDocumentPresenter(eventBus, appModel,
				new mindmaps.SaveDocumentView());
		presenter.go();
	}

	this.go = function() {
		var presenter = new mindmaps.MainPresenter(eventBus, appModel,
				new mindmaps.MainView());
		presenter.go();
	};

	bind();
};