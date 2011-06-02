mindmaps.CanvasPresenter = function(eventBus, commandRegistry,
		mindmapModel, view, zoomController) {
	var self = this;
	var selectedNode = null;
	var creator = view.getCreator();

	this.init = function() {
		var editCaptionCommand = commandRegistry
				.get(mindmaps.EditNodeCaptionCommand);
		editCaptionCommand.setHandler(this.editNodeCaption.bind(this));

		var toggleNodeFoldedCommand = commandRegistry
				.get(mindmaps.ToggleNodeFoldedCommand);
		toggleNodeFoldedCommand.setHandler(toggleFold);
	};

	this.editNodeCaption = function(node) {
		if (!node) {
			node = mindmapModel.selectedNode;
		}
		view.editNodeCaption(node);
	};

	var toggleFold = function(node) {
		if (!node) {
			node = mindmapModel.selectedNode;
		}

		// toggle node visibility
		var action = new mindmaps.action.ToggleNodeFoldAction(node);
		mindmapModel.executeAction(action);
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

		mindmapModel.selectNode(node);
	};

	view.mouseWheeled = function(delta) {
		if (delta > 0) {
			zoomController.zoomIn();
		} else {
			zoomController.zoomOut();
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

//	view.nodeMouseUp = function(node) {
//	};

	view.nodeDoubleClicked = function(node) {
		view.editNodeCaption(node);
	};

//	view.nodeDragging = function() {
//	};

	view.nodeDragged = function(node, offset) {
		// view has updated itself

		// update model
		var action = new mindmaps.action.MoveNodeAction(node, offset);
		mindmapModel.executeAction(action);
	};

	view.foldButtonClicked = function(node) {
		toggleFold(node);
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

		mindmapModel.createNode(node, parent);
	};

	view.nodeCaptionEditCommitted = function(str) {
		// avoid whitespace only strings
		var str = $.trim(str);
		if (!str) {
			return;
		}

		view.stopEditNodeCaption();
		var action = new mindmaps.action.ChangeNodeCaptionAction(selectedNode,
				str);
		mindmapModel.executeAction(action);
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
		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc,
				newDocument) {
			showMindMap(doc);

			if (newDocument) {
				// edit root node on start
				var root = doc.mindmap.root;
				view.editNodeCaption(root);
			}
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
				if (parent.foldChildren) {
					var action = new mindmaps.action.OpenNodeAction(parent);
					mindmapModel.executeAction(action);
				}

				// select and go into edit mode on new node
				selectNode(node);
				view.editNodeCaption(node);
			}
		});

		eventBus.subscribe(mindmaps.Event.NODE_DELETED, function(node, parent) {
			// select parent if we are deleting a selected node or a descendant
			if (node === selectedNode || node.isDescendant(selectedNode)) {
				// deselectCurrentNode();
				selectNode(parent);
			}

			// update view
			view.deleteNode(node);
			if (parent.isLeaf()) {
				view.removeFoldButton(parent);
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
			var doc = mindmapModel.getDocument();
			view.setZoomFactor(zoomFactor);
			var dimX = doc.dimensions.x;
			var dimY = doc.dimensions.y;
			view.setDimensions(dimX, dimY, true);

			// TODO remove this and scroll to right position
			// view.center();
			view.scale();
		});
	}

	bind();
	this.init();
};