// global debug flag
var DEBUG = true;
var mindmaps = mindmaps || {};

mindmaps.ApplicationModel = function(eventBus, undoManager) {
	MicroEvent.mixin(mindmaps.ApplicationModel);
	var self = this;
	var document = null;

	function bind() {
		// eventBus.subscribe(Event.UNDO_ACTION, doUndo);
		// eventBus.subscribe(Event.REDO_ACTION, doRedo);

		undoManager.stateChanged = function() {
			var undoState = undoManager.canUndo();
			var redoState = undoManager.canRedo();
			self.publish(mindmaps.ApplicationModel.Event.UNDO_STATE_CHANGE,
					undoState, redoState);
		};
	}

	this.doUndo = function() {
		undoManager.undo();
	};

	this.doRedo = function() {
		undoManager.redo();
	};

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
		undoManager.addUndo(undoFunc);

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
		undoManager.addUndo(undoFunc);

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
	this.createNode = function(parent, offset, edgeColor, origin) {
		var map = this.getMindMap();
		if (!map) {
			console.error("can't create node without a map");
			return;
		}

		var node = map.createNode();
		node.offset = offset;
		node.edgeColor = edgeColor;
		parent.addChild(node);

		eventBus.publish(mindmaps.Event.NODE_CREATED, node, origin);

		// register undo
		var undoFunc = function() {
			self.deleteNode(node);
		};

		var redoFunc = function() {
			self.restoreNode(node, parent);
		};
		undoManager.addUndo(undoFunc, redoFunc);
	};

	this.restoreNode = function(node, parent) {
		var map = this.getMindMap();
		map.addNode(node);
		parent.addChild(node);

		eventBus.publish(mindmaps.Event.NODE_CREATED, node);
	};

	this.deleteNode = function(node) {
		var map = this.getMindMap();
		var parent = node.getParent();
		map.removeNode(node);

		eventBus.publish(mindmaps.Event.NODE_DELETED, node, parent);

		// register undo
		var undoFunc = function() {
			self.restoreNode(node, parent);
		};

		var redoFunc = function() {
			self.deleteNode(node);
		};
		undoManager.addUndo(undoFunc, redoFunc);
	};

	bind();
};

mindmaps.ApplicationModel.Event = {
	UNDO_STATE_CHANGE : "UndoStateChangeEvent"
};

mindmaps.AppController = function(eventBus, appModel) {
	function bind() {
		eventBus.subscribe(mindmaps.Event.SAVE_DOCUMENT, doSaveDocument);

		eventBus.subscribe(mindmaps.Event.OPEN_DOCUMENT, function() {
			var presenter = new mindmaps.OpenDocumentPresenter(eventBus,
					appModel, new mindmaps.OpenDocumentView());
			presenter.go();
		});

		eventBus.subscribe(mindmaps.Event.NEW_DOCUMENT, function() {
			var presenter = new mindmaps.NewDocumentPresenter(eventBus,
					appModel, new mindmaps.NewDocumentView());
			presenter.go();
		});
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

// start up
$(function() {
	var eventBus = new mindmaps.EventBus();
	var undoManager = new UndoManager();
	var appModel = new mindmaps.ApplicationModel(eventBus, undoManager);
	var appController = new mindmaps.AppController(eventBus, appModel);
	appController.go();

	// eventBus.publish(Event.OPEN_DOCUMENT);

	// var map = getBinaryMapWithDepth(5);
	// var doc = new Document();
	// doc.mindmap = map;
	// eventBus.publish("documentOpened", doc);
});
