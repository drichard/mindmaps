var CanvasView = function() {
	MicroEvent.mixin(CanvasView);

	this.setHeight = function(height) {
		this.$getContainer().height(height);
	};

	this.enableScroll = function() {
		this.$getContainer().scrollview();
	};

	this.$getDrawingArea = function() {
		return $("#drawing-area");
	};

	this.$getContainer = function() {
		return $("#canvas-container");
	};
};

CanvasView.prototype.drawMap = function(map) {
	throw new Error("Not implemented");
};

var DefaultCanvasView = function() {
	var self = this;

	var $getNodeCanvas = function(node) {
		return $("#node-canvas-" + node.id);
	};

	var $getNode = function(node) {
		return $("#node-" + node.id);
	};

	var $getNodeCaption = function(node) {
		return $("#node-caption-" + node.id);
	};

	var drawConnection = function(canvas, depth, offsetX, offsetY, color) {
		// console.log("drawing");
		var ctx = canvas.getContext("2d");

		var lineWidth = 10 - depth || 1;
		ctx.lineWidth = lineWidth;

		ctx.strokeStyle = color;
		ctx.fillStyle = color;

		var startX = offsetX > 0 ? 0 : -offsetX;
		var startY = offsetY > 0 ? 0 : -offsetY;

		var endX = startX + offsetX;
		var endY = startY + offsetY;

		ctx.beginPath();
		ctx.moveTo(startX, startY);

		var cp1x = startX + (offsetX / 5);
		var cp1y = startY;
		var cp2x = startX + (offsetX / 2);
		var cp2y = endY;

		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
		// ctx.lineTo(startX + offsetX, startY + offsetY);
		ctx.stroke();

		var drawControlPoints = false;

		if (drawControlPoints) {
			// control points
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.arc(cp1x, cp1y, 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = "green";
			ctx.arc(cp2x, cp2y, 4, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	var positionLineCanvas = function($canvas, offsetX, offsetY) {
		var width = Math.abs(offsetX);
		var height = Math.abs(offsetY);

		var left = offsetX < 0 ? 0 : -width;
		var top = offsetY < 0 ? 0 : -height;

		$canvas.attr({
			width : width,
			height : height
		}).css({
			left : left + "px",
			top : top + "px"
		});
	};

	this.createNode = function(node, $parent, depth) {
		var parent = node.getParent();
		var $parent = $parent || $getNode(parent);
		var depth = depth || node.getDepth();
		var offsetX = node.offset.x;
		var offsetY = node.offset.y;

		// div node container
		var $node = $("<div/>", {
			id : "node-" + node.id,
			"class" : "node-container"
		}).css({
			left : offsetX + "px",
			top : offsetY + "px"
		}).appendTo($parent);

		if (node.isRoot()) {
			$node.addClass("mindmap root");
		}

		// TODO if performance suffers: use event delegation for click and drag
		// handlers. have a look at .live(), .delegate()
		// liveDraggable:
		// http://stackoverflow.com/questions/1805210/jquery-drag-and-drop-using-live-events
		// delegation would mean that i dont have to attach event handlers to
		// newly created elements

		// node drag behaviour
		$node.draggable({
			handle : "div.node-caption:first",
			start : function() {
				// console.log("drag start");
				// cant drag root
				if (node.isRoot()) {
					return false;
				}
			},
			drag : function(e, ui) {
				// reposition and draw canvas while dragging
				var $canvas = $getNodeCanvas(node);
				var offsetX = ui.position.left;
				var offsetY = ui.position.top;
				// var depth = $node.data("depth");
				var color = node.edgeColor;

				positionLineCanvas($canvas, offsetX, offsetY);
				drawConnection($canvas[0], depth, offsetX, offsetY, color);

				// fire dragging event
				if (self.nodeDragging) {
					self.nodeDragging();
				}
			},
			stop : function(e, ui) {
				var pos = new Point(ui.position.left, ui.position.top);

				// fire dragged event
				if (self.nodeDragged) {
					self.nodeDragged(node, pos);
				}
			}
		});

		// text caption
		var $text = $("<div/>", {
			id : "node-caption-" + node.id,
			"class" : "node-caption no-select",
			text : node.text.caption
		}).mousedown(function() {
			// fire selected event
			if (self.nodeSelected) {
				self.nodeSelected(node);
			}
		}).mouseup(function() {
			if (self.nodeReleased) {
				self.nodeReleased(node);
			}
		}).dblclick(function() {
			if (self.nodeDoubleClicked) {
				self.nodeDoubleClicked(node);
			}
		}).appendTo($node);

		// create collapse button for parent if he hasn't one already
		var parentAlreadyHasCollapseButton = $parent.data("collapseButton");
		var nodeOrParentIsRoot = node.isRoot() || parent.isRoot();
		if (!parentAlreadyHasCollapseButton && !nodeOrParentIsRoot) {
			this.createCollapseButton(parent);
		}

		// toggle visibility
		if (!node.isRoot()) {
			if (parent.collapseChildren) {
				$node.hide();
			} else {
				$node.show();
			}
		}

		// red dot creator element
		var $creator = $("<div/>", {
			"class" : "creator"
		}).css({
			width : "10px",
			height : "10px",
			background : "red",
			position : "absolute",
			left : "40px",
			top : "20px",
			border : "1px solid red",
			"border-radius" : "7px",
			"z-index" : "1000"
		}).appendTo($node);

		$creator.draggable({
			distance : 15,
			revert : true,
			revertDuration : 0,
			start : function() {

			},
			drag : function(e, ui) {
			},
			stop : function(e, ui) {
				if (self.creatorDragStopped) {
					self.creatorDragStopped(node, ui.position.left,
							ui.position.top);
				}
			}
		});

		// draw canvas to parent if node is not a root
		if (!node.isRoot()) {
			// create canvas element
			var $canvas = $("<canvas/>", {
				id : "node-canvas-" + node.id,
				class : "line-canvas"
			});

			var color = node.edgeColor;

			// position and draw connection
			positionLineCanvas($canvas, offsetX, offsetY);
			drawConnection($canvas[0], depth, offsetX, offsetY, color);

			$canvas.appendTo($node);
		}

		// draw child nodes
		node.forEachChild(function(child) {
			self.createNode(child, $node, depth + 1);
		});
	};

	this.drawMap = function(map) {
		// clear map first
		var container = this.$getDrawingArea();
		container.children(".root").remove();

		var root = map.root;

		// center root
		var center = new Point(container.width() / 2, container.height() / 2);
		root.offset = center;

		self.createNode(root, container);

		// TODO deselect on click in void?
		$("#scroller").click(function() {
			// console.log("click scroller");
			self.mapClicked();
		});

	};

	this.selectNode = function(node) {
		var $text = $getNodeCaption(node);
		$text.addClass("selected");
	};

	this.deselectNode = function(node) {
		var $text = $getNodeCaption(node);
		$text.removeClass("selected");
	};

	this.closeNode = function(node) {
		// console.log("closing node ", node.id);
		var $node = $getNode(node);
		$node.children(".node-container").hide();

		var $collapseButton = $node.children(".button-collapse").first();
		$collapseButton.removeClass("open").addClass("closed");
	};

	this.openNode = function(node) {
		// console.log("opening node ", node.id);
		var $node = $getNode(node);
		$node.children(".node-container").show();

		var $collapseButton = $node.children(".button-collapse").first();
		$collapseButton.removeClass("closed").addClass("open");
	};

	this.deleteNode = function(node) {
		// TODO remove
		var n = new Date;
		var $node = $getNode(node);
		var n1 = new Date;
		$node.remove();
		var n2 = new Date;
		console.log(n1 - n, n2 - n1);
	};

	this.createCollapseButton = function(node) {
		var openClosed = node.collapseChildren ? "closed" : "open";
		var $collapseButton = $("<div/>", {
			"class" : "button-collapse no-select " + openClosed
		}).click(function(e) {
			// fire event
			if (self.collapseButtonClicked) {
				self.collapseButtonClicked(node);
			}

			e.preventDefault();
			return false;
		});

		var $node = $getNode(node);
		$node.data({
			collapseButton : true
		}).append($collapseButton);
	};

	this.removeCollapseButton = function(node) {
		var $node = $getNode(node);
		$node.data({
			collapseButton : false
		}).children(".button-collapse").remove();
	};

	// text input for node edits.
	var $captionEditor = $("<input/>", {
		type : "text"
	}).css({
		position : "absolute",
		"z-index" : 1000,
		top : "30px"
	}).bind("keydown", "esc", function() {
		$captionEditor.detach();
	}).bind("keydown", "return", function() {
		console.log("retur");
		var value = $captionEditor.val();
		self.nodeCaptionEditCommitted(value);
		$captionEditor.detach();
	});

	this.editNodeCaption = function(node) {
		var $node = $getNode(node);
		var $text = $getNodeCaption(node);

		var content = $text.text();

		// TODO show editor in place of node caption
		// show editor
		$captionEditor.attr({
			value : content
		}).appendTo($node).select();
	};

	this.cancelNodeCaptionEdit = function() {
		$captionEditor.detach();
	};

	this.setNodeText = function(node, value) {
		var $text = $getNodeCaption(node);
		$text.text(value);
	};
};

// inherit from base canvas view
DefaultCanvasView.prototype = new CanvasView();

var CanvasPresenter = function(view, eventBus) {
	var self = this;
	this.view = view;
	this.map = null;
	var selectedNode = null;

	// TODO restrict keys on canvas area?
	$(document).bind("keydown", "del", function() {
		self.deleteSelectedNode();
	});

	// TODO restrict keys on canvas area?
	$(document).bind("keydown", "space", function() {
		if (selectedNode) {
			self.toggleCollapse(selectedNode);
		}
	});

	this.deleteSelectedNode = function() {
		var node = selectedNode;
		if (node) {
			// remove from model
			var parent = node.getParent();
			parent.removeChild(node);

			// update view
			view.deleteNode(node);
			if (parent.isLeaf()) {
				view.removeCollapseButton(parent);
			}
		}
	};

	// listen to global events
	eventBus.subscribe("documentOpened", function(doc) {
		// console.log("draw doc", doc);
		self.map = doc.mindmap;
		view.drawMap(self.map);
	});

	eventBus.subscribe("deleteSelectedNodeRequested", function() {
		self.deleteSelectedNode();
	});

	var selectNode = function(node) {
		// deselect old node
		if (selectedNode) {
			view.deselectNode(selectedNode);
		}

		// remove edit input in case it was active
		view.cancelNodeCaptionEdit();

		// select node and save reference
		view.selectNode(node);
		selectedNode = node;
	};

	// listen to events from view
	view.nodeSelected = function(node) {
		if (selectedNode === node) {
			// dont select nodes twice
			return;
		}

		selectNode(node);
	};

	view.nodeDoubleClicked = function(node) {
		view.editNodeCaption(node);
	};

	view.nodeReleased = function(node) {
	};

	view.nodeDragging = function() {
	};

	view.nodeDragged = function(node, offset) {
		// console.log(node.id, offset.toString());

		// update model
		node.offset = offset;
	};

	this.toggleCollapse = function(node) {
		// toggle node visibility
		if (node.collapseChildren) {
			node.collapseChildren = false;
			view.openNode(node);
		} else {
			node.collapseChildren = true;
			view.closeNode(node);
		}
	};

	// clicked the void
	view.mapClicked = function(node) {
		// deselect old node
		if (selectedNode) {
			view.deselectNode(selectedNode);
			selectedNode = null;
		}

		view.cancelNodeCaptionEdit();
	};

	view.collapseButtonClicked = function(node) {
		self.toggleCollapse(node);
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
		// TODO sanitize value
		var node = selectedNode;
		if (!node) {
			console.error("edit for unselected node!");
			return;
		}

		node.setCaption(str);
		view.setNodeText(node, str);
	};
};