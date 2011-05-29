mindmaps.CanvasPresenter = function(eventBus, appModel, view, zoomController) {
	var self = this;
	var selectedNode = null;
	var creator = view.getCreator();

	// TODO restrict keys on canvas area?, move out
	$(document).bind("keydown", "F2", function() {
		view.editNodeCaption(selectedNode);
	});

	$(document).bind("keydown", "space", function(e) {
		e.preventDefault();
		toggleCollapse(selectedNode);
	});

	var toggleCollapse = function(node) {
		// toggle node visibility
		var action = new mindmaps.action.ToggleNodeCollapseAction(node);
		appModel.executeAction(action);
	};

	var deleteSelectedNode = function() {
		// remove from model
		var action = new mindmaps.action.DeleteNodeAction(selectedNode);
		appModel.executeAction(action);
	};

	var selectNode = function(node) {
		// dont select the same node twice
		if (selectedNode === node) {
			return;
		}

		// deselect old node
		if (selectedNode) {
			view.unhighlightNode(selectedNode);
		}
		view.highlightNode(node);
		selectedNode = node;
		
		// publish event
		eventBus.publish(mindmaps.Event.NODE_SELECTED, node);
	};

	view.mouseWheeled = function(delta) {
		if (delta > 0) {
			zoomController.zoomIn();
			//eventBus.publish(mindmaps.Event.ZOOM_IN);
		} else {
			zoomController.zoomOut();
			//eventBus.publish(mindmaps.Event.ZOOM_OUT);
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
		var action = new mindmaps.action.MoveNodeAction(node, offset);
		appModel.executeAction(action);
	};

	view.collapseButtonClicked = function(node) {
		toggleCollapse(node);
	};

	// CREATOR TOOL
	creator.dragStarted = function(node) {
		// set edge color for new node. inherit from parent or random when root
		var color = node.isRoot() ? mindmaps.Util.randomColor()
				: node.branchColor;
		return color;
	};

	creator.dragStopped = function(parent, offsetX, offsetY, distance) {
		// disregard if the creator was only dragged a bit
		if (distance < 50) {
			return;
		}

		// update the model
		var node = new mindmaps.Node();
		node.branchColor = creator.lineColor;
		node.offset = new mindmaps.Point(offsetX, offsetY);
		// indicate that we want to set this nodes caption after creation
		node.shouldEditCaption = true;

		var action = new mindmaps.action.CreateNodeAction(node, parent);
		appModel.executeAction(action);
	};

	view.nodeCaptionEditCommitted = function(str) {
		// avoid whitespace only strings
		var str = $.trim(str);
		if (!str) {
			return;
		}

		var node = selectedNode;

		view.stopEditNodeCaption();
		var action = new mindmaps.action.ChangeNodeCaptionAction(node, str);
		appModel.executeAction(action);
	};

	this.go = function() {
		view.init();
	};

	function showMindMap(doc) {
		view.setZoomFactor(zoomController.DEFAULT_ZOOM);
		var dimensions = doc.dimensions;
		view.setDimensions(dimensions.x, dimensions.y);
		var map = doc.mindmap;
		view.drawMap(map);
		view.center();

		var root = map.root;
		selectNode(root);
	}
	
	function bind() {
		// listen to global events
		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
			showMindMap(doc);
		});

		eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
			showMindMap(doc);
			
			// edit root node on start
			var root = doc.mindmap.root;
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

		eventBus.subscribe(mindmaps.Event.NODE_CREATED, function(node) {
			view.createNode(node);

			// edit node caption immediately if requested
			if (node.shouldEditCaption) {
				delete node.shouldEditCaption;
				// open parent node when creating a new child and the other
				// children are hidden
				var parent = node.getParent();
				if (parent.collapseChildren) {
					var action = new mindmaps.action.OpenNodeAction(parent);
					appModel.executeAction(action);
				}

				// select and go into edit mode on new node
				selectNode(node);
				view.editNodeCaption(node);
			}
		});

		// TODO select previous node
		eventBus.subscribe(mindmaps.Event.NODE_DELETED, function(node, parent) {
			// select parent if we are deleting a selected node or a descendant
			if (node === selectedNode || node.isDescendant(selectedNode)) {
				// deselectCurrentNode();
				selectNode(parent);
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

		eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function(
				node) {
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