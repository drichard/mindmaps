var mindmaps = mindmaps || {};

mindmaps.CanvasPresenter = function(eventBus, appModel, view) {
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
			// remove from model
			appModel.deleteNode(node);
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
	view.nodeMouseOver = function(node) {
		if (view.isNodeDragging() || creator.isDragging()) {
			// dont relocate the creator if we are dragging
			// console.log("draggin: over node: ", node.id);
		} else {
			// console.log("over node: ", node.id);
			creator.attachToNode(node);
		}
	};

	// listen to events from view
	view.nodeCaptionMouseOver = function(node) {
		if (view.isNodeDragging() || creator.isDragging()) {
			// dont relocate the creator if we are dragging
			// console.log("draggin: over node: ", node.id);
		} else {
			// console.log("over node: ", node.id);
			creator.attachToNode(node);
		}
	};

	view.nodeMouseDown = function(node) {
		selectNode(node);
		// show creator
		creator.attachToNode(node);
	};

	view.nodeMouseUp = function(node) {
	};

	view.nodeDoubleClicked = function(node) {
		view.editNodeCaption(node);
	};

	view.nodeDragging = function() {
	};

	view.nodeDragged = function(node, offset) {
		// view has updated itself

		// update model
		appModel.moveNode(node, offset);
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
		var color = node.isRoot() ? mindmaps.Util.randomColor()
				: node.edgeColor;
		return color;
	};

	creator.dragStopped = function(parent, offsetX, offsetY, distance) {
		// disregard if the creator was only dragged a bit
		if (distance < 50) {
			return;
		}

		// update the model
		appModel.createNode(parent, new mindmaps.Point(offsetX, offsetY),
				creator.lineColor, self);
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

		view.stopEditNodeCaption(true);
		appModel.setNodeCaption(node, str);
	};

	this.go = function() {
		view.init();
	};

	function bind() {
		// listen to global events
		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
			// TODO DRY
			var dimensions = doc.dimensions;
			view.setDimensions(dimensions.x, dimensions.y);
			var map = appModel.getMindMap();
			view.drawMap(map);
			view.center();
		});

		eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
			// TODO DRY
			var dimensions = doc.dimensions;
			view.setDimensions(dimensions.x, dimensions.y);
			var map = appModel.getMindMap();
			view.drawMap(map);
			view.center();

			var root = map.root;
			selectNode(root);
			view.editNodeCaption(root);
		});

		eventBus.subscribe(mindmaps.Event.DELETE_SELECTED_NODE, function() {
			deleteSelectedNode();
		});

		eventBus.subscribe(mindmaps.Event.NODE_MOVED, function(node) {
			view.positionNode(node);
		});

		eventBus.subscribe(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function(
				node) {
			view.setNodeText(node, node.getCaption());

			// redraw node in case height has changed
			// TODO maybe only redraw if height has changed
			view.redrawNodeConnectors(node);
		});

		eventBus.subscribe(mindmaps.Event.NODE_CREATED, function(node, origin) {
			view.createNode(node);

			// did we create this node inside the prenter ourselves?
			if (origin === self) {
				// open parent node when creating a new child and the other
				// children are hidden
				var parent = node.getParent();
				if (parent.collapseChildren) {
					// TODO not visible for nagivator
					parent.collapseChildren = false;
					view.openNode(parent);
				}

				// select and go into edit mode on new node
				selectNode(node);
				view.editNodeCaption(node);
			}
		});

		eventBus.subscribe(mindmaps.Event.NODE_DELETED, function(node, parent) {
			// reset selectedNode if we are deleting this one
			if (node === selectedNode) {
				selectedNode = null;
			}

			// update view
			view.deleteNode(node);
			if (parent.isLeaf()) {
				view.removeCollapseButton(parent);
			}
		});
	}

	bind();
};