// TODO raise event on collapse
mindmaps.CanvasPresenter = function(eventBus, appModel, view) {
	var self = this;
	var selectedNode = null;
	var creator = view.getCreator();

	// TODO restrict keys on canvas area?, move out
	$(document).bind("keydown", "del", function() {
		deleteSelectedNode();
	});

	$(document).bind("keydown", "F2", function() {
		if (selectedNode) {
			view.editNodeCaption(selectedNode);
		}
	});

	$(document).bind("keydown", "space", function(e) {
		e.preventDefault();
		if (selectedNode) {
			toggleCollapse(selectedNode);
		}
	});

	var toggleCollapse = function(node) {
		// toggle node visibility
		var action =  new mindmaps.action.ToggleNodeCollapseAction(node);
		appModel.executeAction(action);
	};

	var deleteSelectedNode = function() {
		var node = selectedNode;
		if (node) {
			// remove from model
			var action =  new mindmaps.action.DeleteNodeAction(node);
			appModel.executeAction(action);
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

		// publish event
		eventBus.publish(mindmaps.Event.NODE_SELECTED, node);
	};
	var deselectCurrentNode = function() {
		// deselect old node
		if (selectedNode) {
			view.unhighlightNode(selectedNode);
			eventBus.publish(mindmaps.Event.NODE_DESELECTED, selectedNode);
			selectedNode = null;
		}
	};

	view.mouseWheeled = function(delta) {
		if (delta > 0) {
			appModel.zoomIn();
		} else {
			appModel.zoomOut();
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
		var action =  new mindmaps.action.MoveNodeAction(node, offset);
		appModel.executeAction(action);
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
		var node = new mindmaps.Node();
		node.edgeColor = creator.lineColor;
		node.offset = new mindmaps.Point(offsetX, offsetY);

		// appModel.createNode(node, parent, self);
		var action =  new mindmaps.action.CreateNodeAction(node, parent, self);
		appModel.executeAction(action);
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
		var action =  new mindmaps.action.ChangeNodeCaptionAction(node, str);
		appModel.executeAction(action);
	};

	this.go = function() {
		view.init();
	};

	function bind() {
		// listen to global events
		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
			// TODO DRY
			var zoomFactor = doc.zoomFactor;
			view.setZoomFactor(zoomFactor);
			var dimensions = doc.dimensions;
			view.setDimensions(dimensions.x, dimensions.y);
			var map = appModel.getMindMap();
			view.drawMap(map);
			view.center();
		});

		eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
			// TODO DRY
			var zoomFactor = doc.zoomFactor;
			view.setZoomFactor(zoomFactor);

			var dimensions = doc.dimensions;
			view.setDimensions(dimensions.x, dimensions.y);
			var map = appModel.getMindMap();
			view.drawMap(map);
			view.center();

			var root = map.root;
			selectNode(root);
			view.editNodeCaption(root);
		});

		eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
			view.clear();
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
					var action =  new mindmaps.action.OpenNodeAction(parent);
					appModel.executeAction(action);
				}

				// select and go into edit mode on new node
				selectNode(node);
				view.editNodeCaption(node);
			}
		});

		// TODO select previous node
		eventBus.subscribe(mindmaps.Event.NODE_DELETED, function(node, parent) {
			// reset selectedNode if we are deleting this one
			if (node === selectedNode) {
				deselectCurrentNode();
			}

			// update view
			view.deleteNode(node);
			if (parent.isLeaf()) {
				view.removeCollapseButton(parent);
			}
		});

		eventBus.subscribe(mindmaps.Event.NODE_OPENED, function(node) {
			view.openNode(node);
		});

		eventBus.subscribe(mindmaps.Event.NODE_CLOSED, function(node) {
			view.closeNode(node);
		});

		eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(node) {
			view.updateNode(node);
		});
		
		eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function(node) {
			view.updateNode(node);
		});

		eventBus.subscribe(mindmaps.Event.ZOOM_CHANGED, function(zoomFactor) {
			view.setZoomFactor(zoomFactor);
			var doc = appModel.getDocument();
			var dimX = doc.dimensions.x;
			var dimY = doc.dimensions.y;
			view.setDimensions(dimX, dimY, true);

			// TODO remove this and scroll to right position
			// view.center();
			view.scale();
		});
	}

	bind();
};