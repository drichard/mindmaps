var CanvasView = function() {
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

	var drawLineCanvas = function($canvas, depth, offsetX, offsetY, color) {
		/**
		 * Positions the canvas correctly.
		 */
		var setPosition = function($canvas, offsetX, offsetY) {
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

		// 1. set position of canvas
		setPosition($canvas, offsetX, offsetY);

		// 2. draw the thing
		var canvas = $canvas[0];
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

	this.drawMap = function(map) {
		var $drawingArea = this.$getDrawingArea();
		$drawingArea.addClass("mindmap");

		// clear map first
		$drawingArea.children().remove();

		var root = map.root;

		// center root
		var center = new Point($drawingArea.width() / 2,
				$drawingArea.height() / 2);
		root.offset = center;

		self.createNode(root, $drawingArea);

		// TODO deselect on click in void?
		$("#scroller").click(function() {
			// console.log("click scroller");
			self.mapClicked();
		});
	};

	// canvas used by the creator tool to draw new lines
	var $creatorCanvas = $("<canvas/>", {
		id : "creator-canvas",
		"class" : "line-canvas"
	});

	/**
	 * Inserts a new node including all of its children into the DOM.
	 * 
	 * @param node -
	 *            The model of the node.
	 * @param $parent -
	 *            optional jquery parent object the new node is appended to.
	 *            Usually the parent node. If argument is omitted, the
	 *            getParent() method of the node is called to resolve the
	 *            parent.
	 * @param depth -
	 *            Optional. The depth of the tree relative to the root. If
	 *            argument is omitted the getDepth() method of the node is
	 *            called to resolve the depth.
	 */
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
			$node.addClass("root");
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
				var color = node.edgeColor;

				drawLineCanvas($canvas, depth, offsetX, offsetY, color);

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
		
		
		// TODO check this out
//		$node.mousedown(function(e){ 
//			console.log(e.target, e.currentTarget);
//		});

		// text caption
		var $text = $("<div/>", {
			id : "node-caption-" + node.id,
			"class" : "node-caption no-select",
			text : node.text.caption
		}).mousedown(function() {
			// fire selected event
			if (self.nodeMouseDown) {
				self.nodeMouseDown(node);
			}
		}).mouseup(function() {
			if (self.nodeMouseUp) {
				self.nodeMouseUp(node);
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
			"class" : "creator-nub"
		}).appendTo($node);

		$creator.draggable({
			revert : true,
			revertDuration : 0,
			start : function() {
				// show creator canvas
				$creatorCanvas.appendTo($creator);
			},
			drag : function(e, ui) {
				// update creator canvas
				var offsetX = ui.position.left;
				var offsetY = ui.position.top;
				var color = node.edgeColor;

				// set depth+1 because we are drawing the canvas for the child
				drawLineCanvas($creatorCanvas, depth + 1, offsetX, offsetY,
						color);
			},
			stop : function(e, ui) {
				// remove creator canvas, gets replaced by real canvas
				$creatorCanvas.detach();
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
				"class" : "line-canvas"
			});

			// position and draw connection
			drawLineCanvas($canvas, depth, offsetX, offsetY, node.edgeColor);
			$canvas.appendTo($node);
		}

		// draw child nodes
		node.forEachChild(function(child) {
			self.createNode(child, $node, depth + 1);
		});
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

	this.highlightNode = function(node) {
		var $text = $getNodeCaption(node);
		$text.addClass("selected");
	};

	this.unhighlightNode = function(node) {
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

		// remember that collapseButton was set and attach to node
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