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

	this.moveNode = function(node, newOffset) {
		// register undo
		var oldOffset = node.offset;
		var undoFunc = function() {
			self.moveNode(node, oldOffset);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);

		node.offset = newOffset;
		eventBus.publish(mindmaps.Event.NODE_MOVED, node);
	};

	this.setNodeCaption = function(node, newCaption) {
		// dont update if nothing has changed
		if (node.getCaption() === newCaption) {
			return;
		}

		// register undo
		var oldCaption = node.getCaption();
		var undoFunc = function() {
			self.setNodeCaption(node, oldCaption);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);

		// update model
		node.setCaption(newCaption);

		// change document title when root was renamed
		if (node.isRoot()) {
			document.title = newCaption;
		}

		eventBus.publish(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, node);
	};

	/**
	 * origin - optional argument declaring which object created the node
	 */
	this.createNode = function(node, parent, origin) {
		var map = this.getMindMap();
		map.addNode(node);
		parent.addChild(node);

		eventBus.publish(mindmaps.Event.NODE_CREATED, node, origin);

		// register undo
		var undoFunc = function() {
			self.deleteNode(node);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	this.deleteNode = function(node) {
		var map = this.getMindMap();
		var parent = node.getParent();
		map.removeNode(node);

		eventBus.publish(mindmaps.Event.NODE_DELETED, node, parent);

		// register undo
		var undoFunc = function() {
			self.createNode(node, parent);
		};

		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	this.openNode = function(node) {
		node.collapseChildren = false;
		eventBus.publish(mindmaps.Event.NODE_OPENED, node);
	};

	this.closeNode = function(node) {
		node.collapseChildren = true;
		eventBus.publish(mindmaps.Event.NODE_CLOSED, node);
	};

	// TODO summarize, move out
	var fontStep = 4;
	this.increaseNodeFontSize = function(node) {
		var currentSize = node.text.font.size;
		var newSize = currentSize + fontStep;

		node.text.font.size = newSize;

		eventBus.publish(mindmaps.Event.NODE_FONT_CHANGED, node, newSize);

		// register undo
		var undoFunc = function() {
			self.decreaseNodeFontSize(node);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	this.decreaseNodeFontSize = function(node) {
		var currentSize = node.text.font.size;
		var newSize = currentSize - fontStep;

		// min size
		if (newSize < 4) {
			return;
		}

		node.text.font.size = newSize;

		eventBus.publish(mindmaps.Event.NODE_FONT_CHANGED, node);

		// register undo
		var undoFunc = function() {
			self.increaseNodeFontSize(node);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	this.setNodeFontWeight = function(node, bold) {
		var weight = bold ? "bold" : "normal";
		node.text.font.weight = weight;

		eventBus.publish(mindmaps.Event.NODE_FONT_CHANGED, node);

		// register undo
		var undoFunc = function() {
			self.setNodeFontWeight(node, !bold);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	this.setNodeFontStyle = function(node, italic) {
		var style = italic ? "italic" : "normal";
		node.text.font.style = style;
		eventBus.publish(mindmaps.Event.NODE_FONT_CHANGED, node);

		// register undo
		var undoFunc = function() {
			self.setNodeFontStyle(node, !italic);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	this.setNodeFontDecoration = function(node, underline) {
		var decoration = underline ? "underline" : "none";
		node.text.font.decoration = decoration;

		eventBus.publish(mindmaps.Event.NODE_FONT_CHANGED, node);

		// register undo
		var undoFunc = function() {
			self.setNodeFontDecoration(node, !underline);
		};
		eventBus.publish(mindmaps.Event.UNDO_ACTION, undoFunc);
	};

	// TODO move out
	var zoomStep = 0.25;
	var maxZoom = 3;
	var minZoom = 0.2;

	this.zoomIn = function() {
		var factor = document.zoomFactor;
		factor += zoomStep;
		if (factor > maxZoom) {
			factor -= zoomStep;
		} else {
			document.zoomFactor = factor;
			eventBus.publish(mindmaps.Event.ZOOM_CHANGED, factor);
		}
	};

	this.zoomOut = function() {
		var factor = document.zoomFactor;
		factor -= zoomStep;
		if (factor < minZoom) {
			factor += zoomStep;
		} else {
			document.zoomFactor = factor;
			eventBus.publish(mindmaps.Event.ZOOM_CHANGED, factor);
		}
	};
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