// global debug flag
var DEBUG = true;

var ApplicationModel = function(eventBus, undoManager) {
	MicroEvent.mixin(ApplicationModel);
	var self = this;
	var document = null;

	function bind() {
		// eventBus.subscribe(Event.UNDO_ACTION, doUndo);
		// eventBus.subscribe(Event.REDO_ACTION, doRedo);

		undoManager.stateChanged = function() {
			var undoState = undoManager.canUndo();
			var redoState = undoManager.canRedo();
			self.publish(ApplicationModel.Event.UNDO_STATE_CHANGE, undoState,
					redoState);
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

	this.moveNode = function(node, newOffset, undoable) {
		var addUndo = undoable === undefined || undoable === true;
		if (addUndo) {
			var oldOffset = node.offset;
			var undoFunc = function() {
				self.moveNode(node, oldOffset, false);
			};

			var redoFunc = function() {
				self.moveNode(node, newOffset, false);
			};

			undoManager.addAction(undoFunc, redoFunc);
		}

		node.offset = newOffset;
		eventBus.publish(Event.NODE_MOVED, node);
	};

	this.setNodeCaption = function(node, newCaption, undoable) {
		// dont update if nothing has changed
		if (node.getCaption() === newCaption) {
			return;
		}

		var addUndo = undoable === undefined || undoable === true;
		if (addUndo) {
			var oldCaption = node.getCaption();
			var undoFunc = function() {
				self.setNodeCaption(node, oldCaption, false);
			};

			var redoFunc = function() {
				self.setNodeCaption(node, newCaption, false);
			};

			undoManager.addAction(undoFunc, redoFunc);
		}

		// update model
		node.setCaption(newCaption);

		// change document title when root was renamed
		if (node.isRoot()) {
			document.setTitle(newCaption);
		}

		eventBus.publish(Event.NODE_TEXT_CAPTION_CHANGED, node);
	};

	/**
	 * origin - optional argument declaring which object created the node
	 */
	this.createNode = function(parent, offset, edgeColor, origin, undoable) {
		var map = this.getMindMap();
		if (!map) {
			console.error("can't create node without a map");
			return;
		}

		var node = map.createNode();
		node.offset = offset;
		node.edgeColor = edgeColor;
		parent.addChild(node);

		eventBus.publish(Event.NODE_CREATED, node, origin);
		
		
		var addUndo = undoable === undefined || undoable === true;
		if (addUndo) {
			var undoFunc = function() {
				self.deleteNode(node, false);
			};
			
			var redoFunc = function() {
				self.restoreNode(node, parent);
			};
			
			undoManager.addAction(undoFunc, redoFunc);
		}
	};
	
	this.restoreNode = function(node, parent) {
		var map = this.getMindMap();
		map.addNode(node);
		parent.addChild(node);
		
		eventBus.publish(Event.NODE_CREATED, node);
	};
	
	this.deleteNode = function(node, undoable) {
		var map = this.getMindMap();
		var parent = node.getParent();
		map.removeNode(node);
		
		eventBus.publish(Event.NODE_DELETED, node, parent);
		
		var addUndo = undoable === undefined || undoable === true;
		if (addUndo) {
			var undoFunc = function() {
				self.restoreNode(node, parent);
			};
			
			var redoFunc = function() {
				self.deleteNode(node, false);
			};
			
			undoManager.addAction(undoFunc, redoFunc);
		}
	};

	bind();
};

ApplicationModel.Event = {
	UNDO_STATE_CHANGE : "UndoStateChangeEvent"
};

var AppController = function(eventBus, appModel) {
	function bind() {
		eventBus.subscribe(Event.SAVE_DOCUMENT, doSaveDocument);

		eventBus.subscribe(Event.OPEN_DOCUMENT, function() {
			var presenter = new OpenDocumentPresenter(eventBus, appModel,
					new OpenDocumentView());
			presenter.go();
		});

		eventBus.subscribe(Event.NEW_DOCUMENT, function() {
			var presenter = new NewDocumentPresenter(eventBus, appModel,
					new NewDocumentView());
			presenter.go();
		});
	}

	function doSaveDocument() {
		/**
		 * If the document doesn't have a title yet show the save as presenter,
		 * otherwise just save the document.
		 */
		var doc = appModel.getDocument();
		var title = doc.getTitle();
		if (title !== null) {
			var savedDoc = LocalDocumentStorage.saveDocument(doc);
			eventBus.publish(Event.DOCUMENT_SAVED);
		} else {
			var presenter = new SaveDocumentPresenter(eventBus, appModel,
					new SaveDocumentView());
			presenter.go();
		}
	}

	this.go = function() {
		var presenter = new MainPresenter(eventBus, appModel, new MainView());
		presenter.go();
	};

	bind();
};

// start up
$(function() {
	var eventBus = new EventBus();
	var undoManager = new UndoManager();
	var appModel = new ApplicationModel(eventBus, undoManager);
	var appController = new AppController(eventBus, appModel);
	appController.go();

	// eventBus.publish(Event.OPEN_DOCUMENT);

	// var map = getBinaryMapWithDepth(5);
	// var doc = new Document();
	// doc.mindmap = map;
	// eventBus.publish("documentOpened", doc);
});
