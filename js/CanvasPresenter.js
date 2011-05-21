mindmaps.CanvasPresenter = function(eventBus, appModel, view) {
	var self = this;
	var selectedNode = null;
	var creator = view.getCreator();
	var zoomControl = new ZoomControl(eventBus);

	// TODO restrict keys on canvas area?, move out
	$(document).bind("keydown", "del", function() {
		deleteSelectedNode();
	});

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
			eventBus.publish(mindmaps.Event.ZOOM_IN);
		} else {
			eventBus.publish(mindmaps.Event.ZOOM_OUT);
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

		var action = new mindmaps.action.CreateNodeAction(node, parent, self);
		appModel.executeAction(action);
	};

	view.nodeCaptionEditCommitted = function(str) {
		// avoid whitespace only strings
		var str = $.trim(str);
		if (!str) {
			return;
		}

		var node = selectedNode;

		view.stopEditNodeCaption(true);
		var action = new mindmaps.action.ChangeNodeCaptionAction(node, str);
		appModel.executeAction(action);
	};

	this.go = function() {
		view.init();
	};

	function showMindMap(doc) {
		view.setZoomFactor(1);
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

		eventBus.subscribe(mindmaps.Event.NODE_CREATED, function(node, origin) {
			view.createNode(node);

			// did we create this node inside the prenter ourselves?
			if (origin === self) {
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
	
	// TODO how to set default zoom on seperate objects
	/**
	 * Object that controls the zoom.
	 * @param eventBus
	 * @returns {ZoomControl}
	 */
	function ZoomControl(eventBus) {
		var self = this;
		var ZOOM_STEP = 0.25;
		var MAX_ZOOM = 3;
		var MIN_ZOOM = 0.2;
		
		this.DEFAULT_ZOOM = 1;
		this.zoomFactor = this.DEFAULT_ZOOM;

		this.zoomIn = function() {
			this.zoomFactor += ZOOM_STEP;
			if (this.zoomFactor > MAX_ZOOM) {
				this.zoomFactor -= ZOOM_STEP;
			} else {
				eventBus.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
			}
			
			return this.zoomFactor;
		};

		this.zoomOut = function() {
			this.zoomFactor -= ZOOM_STEP;
			if (this.zoomFactor < MIN_ZOOM) {
				this.zoomFactor += ZOOM_STEP;
			} else {
				eventBus.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
			}
			
			return this.zoomFactor;
		};
		
		eventBus.subscribe(mindmaps.Event.ZOOM_IN, function() {
			self.zoomIn();
		});
		
		eventBus.subscribe(mindmaps.Event.ZOOM_OUT, function() {
			self.zoomOut();
		});
	}
};