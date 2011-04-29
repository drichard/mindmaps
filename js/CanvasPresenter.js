var CanvasPresenter = function(eventBus, appModel, view) {
	var self = this;
	var selectedNode = null;

	// TODO restrict keys on canvas area?
	$(document).bind("keydown", "del", function() {
		deleteSelectedNode();
	});

	// TODO restrict keys on canvas area?
	$(document).bind("keydown", "space", function() {
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
			// remove from model
			// TODO delete from mindmap.nodes?
			var parent = node.getParent();
			parent.removeChild(node);

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

		// remove edit input in case it was active
		view.cancelNodeCaptionEdit();

		// select node and save reference
		view.highlightNode(node);
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

		// cancel the edit
		view.cancelNodeCaptionEdit();
	};

	view.collapseButtonClicked = function(node) {
		toggleCollapse(node);
	};

	view.creatorDragStopped = function(parent, offsetX, offsetY) {
		// disregard if the creator was only dragged a bit
		var distance = Util.distance(offsetX, offsetY);
		if (distance < 50) {
			return;
		}

		// create new node
		var node = new TreeNode();
		node.offset = new Point(offsetX, offsetY);
		parent.addChild(node);
		node.edgeColor = parent.edgeColor;

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
	};

	this.go = function() {
		view.makeDraggable();
		view.center();
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