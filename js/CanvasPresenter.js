var CanvasPresenter = function(eventBus, appModel, view) {
	var self = this;
	var selectedNode = null;
	var creator = view.getCreator();

	// TODO restrict keys on canvas area?
	$(document).bind("keydown", "del", function() {
		deleteSelectedNode();
	});

	// TODO restrict keys on canvas area?
	$(document).bind("keydown", "space", function(e) {
		e.preventDefault();
		if (selectedNode) {
			toggleCollapse(selectedNode);
		}
	});

	var toggleCollapse = function(node) {
		// toggle node visibility
		if (node.collapseChildren) {
			node.collapseChildren = false;
			view.openNode(node);
		} else {
			node.collapseChildren = true;
			view.closeNode(node);
		}
	};

	var deleteSelectedNode = function() {
		var node = selectedNode;
		if (node) {
			var parent = node.getParent();
			var map = appModel.getMindMap();
			
			// remove from model
			map.removeNode(node);

			// update view
			view.deleteNode(node);
			if (parent.isLeaf()) {
				view.removeCollapseButton(parent);
			}
		}
	};

	var selectNode = function(node) {
		// dont select the same node twice
		if (selectedNode === node) {
			return;
		}

		// deselect old node
		deselectCurrentNode();

		// select node and save reference
		view.highlightNode(node);

		// show creator
		creator.attachToNode(node);
		selectedNode = node;
	};

	var deselectCurrentNode = function(node) {
		// deselect old node
		if (selectedNode) {
			view.unhighlightNode(selectedNode);
			selectedNode = null;
		}
	};

	// listen to events from view
	view.nodeMouseEnter = function(node) {
		if (view.isNodeDragging() || creator.isDragging()) {
			// dont relocate the creator if we are dragging
			//console.log("draggin: over node: ", node.id);
		} else {
			console.log("over node: ", node.id);
			creator.attachToNode(node);
		}
	};
	
	view.nodeMouseDown = function(node) {
		selectNode(node);
	};

	view.nodeMouseUp = function(node) {
	};

	view.nodeDoubleClicked = function(node) {
		view.editNodeCaption(node);
	};

	view.nodeDragging = function() {
	};

	view.nodeDragged = function(node, offset) {
		// console.log(node.id, offset.toString());

		// update model
		node.offset = offset;
	};

	// clicked the void
	view.mapClicked = function(node) {
		// deselect any node
		deselectCurrentNode();
	};

	view.collapseButtonClicked = function(node) {
		toggleCollapse(node);
	};

	// CREATOR TOOL
	creator.dragStarted = function(node) {
		// set edge color for new node. inherit from parent or random when root
		var color = node.isRoot() ? Util.randomColor() : node.edgeColor;
		creator.setLineColor(color);
	};

	creator.dragStopped = function(parent, offsetX, offsetY) {
		// disregard if the creator was only dragged a bit
		var distance = Util.distance(offsetX, offsetY);
		if (distance < 50) {
			return;
		}

		// create new node
		var map = appModel.getMindMap();
		var node = map.createNode();
		node.offset = new Point(offsetX, offsetY);
		node.edgeColor = creator.lineColor;
		parent.addChild(node);

		// open parent node when creating a new child and the other children are
		// hidden
		if (parent.collapseChildren) {
			parent.collapseChildren = false;
			view.openNode(parent);
		}
		view.createNode(node);

		// select and go into edit mode on new node
		selectNode(node);
		view.editNodeCaption(node);
	};

	view.nodeCaptionEditCommitted = function(str) {
		// avoid whitespace only strings
		var str = $.trim(str);
		if (!str) {
			return;
		}

		var node = selectedNode;
		if (!node) {
			console.error("edit for unselected node!");
			return;
		}

		// update model
		node.setCaption(str);

		// set view
		view.setNodeText(node, str);
		view.stopEditNodeCaption();
		
		// change document title when node was renamed
		if (node.isRoot()) {
			var doc = appModel.getDocument();
			doc.setTitle(str);
		}
	};

	this.go = function() {
		view.init();
	};

	function bind() {
		// listen to global events
		eventBus.subscribe(Event.DOCUMENT_OPENED, function() {
			var map = appModel.getMindMap();
			view.drawMap(map);
			view.center();
		});

		eventBus.subscribe(Event.DOCUMENT_CREATED, function() {
			var map = appModel.getMindMap();
			view.drawMap(map);
			view.center();

			var root = map.root;
			selectNode(root);
			view.editNodeCaption(root);
		});

		eventBus.subscribe(Event.DELETE_SELECTED_NODE, function() {
			deleteSelectedNode();
		});
	}

	bind();
};