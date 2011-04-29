var CanvasView = function() {
	this.setHeight = function(height) {
		this.$getContainer().height(height);
	};

	this.$getDrawingArea = function() {
		return $("#drawing-area");
	};

	this.$getContainer = function() {
		return $("#canvas-container");
	};

	this.center = function() {
		var c = this.$getContainer();
		var area = this.$getDrawingArea();
		var w = area.width() - c.width();
		var h = area.height() - c.height();
		c.scrollLeft(w / 2).scrollTop(h / 2);
	};
};

CanvasView.prototype.drawMap = function(map) {
	throw new Error("Not implemented");
};

var DefaultCanvasView = function() {
	var self = this;
	var nodeDragging = false;
	var creator = new Creator();

	function makeDraggable() {
		self.$getContainer().dragscrollable({
			dragSelector : "#drawing-area, canvas.line-canvas",
			acceptPropagatedEvent : false,
			delegateMode : true
		});
	}

	function $getNodeCanvas(node) {
		return $("#node-canvas-" + node.id);
	}

	function $getNode(node) {
		return $("#node-" + node.id);
	}

	function $getNodeCaption(node) {
		return $("#node-caption-" + node.id);
	}

	function drawLineCanvas($canvas, depth, offsetX, offsetY, color) {
		/**
		 * Positions the canvas correctly.
		 */
		function setPosition($canvas, offsetX, offsetY) {
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
		}

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
	}

	this.init = function() {
		makeDraggable();
		this.center();

		var $drawingArea = this.$getDrawingArea();
		$drawingArea.addClass("mindmap");

		// setup delegates
		// FIXME mousedown delegate does not work on drawingArea. WHY? works on
		// root and container
		this.$getContainer().delegate("div.node-caption", "mousedown",
				function(e) {
					var node = $(this).data("node");
					if (self.nodeMouseDown) {
						self.nodeMouseDown(node);
					}
				});

		$drawingArea.delegate("div.node-caption", "mouseup", function(e) {
			var node = $(this).data("node");
			if (self.nodeMouseUp) {
				self.nodeMouseUp(node);
			}
		});

		$drawingArea.delegate("div.node-caption", "dblclick", function(e) {
			var node = $(this).data("node");
			if (self.nodeDoubleClicked) {
				self.nodeDoubleClicked(node);
			}
		});

		$drawingArea.delegate("div.node-caption", "mouseenter", function(e) {
			var node = $(this).data("node");
			if (self.nodeMouseEnter) {
				self.nodeMouseEnter(node);
			}
		});
	};

	this.drawMap = function(map) {
		var $drawingArea = this.$getDrawingArea();

		// clear map first
		creator.detach();
		$drawingArea.children().remove();

		var root = map.root;
		// center root
		var center = new Point($drawingArea.width() / 2,
				$drawingArea.height() / 2);
		root.offset = center;

		self.createNode(root, $drawingArea);
	};

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
				// cant drag root
				if (node.isRoot()) {
					return false;
				}
				
				nodeDragging = true;
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
				nodeDragging = false;
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
		}).data({
			node : node
		}).appendTo($node);

		// create collapse button for parent if he hasn't one already
		var parentAlreadyHasCollapseButton = $parent.data("collapseButton");
		var nodeOrParentIsRoot = node.isRoot() || parent.isRoot();
		if (!parentAlreadyHasCollapseButton && !nodeOrParentIsRoot) {
			this.createCollapseButton(parent);
		}

		if (!node.isRoot()) {
			// toggle visibility
			if (parent.collapseChildren) {
				$node.hide();
			} else {
				$node.show();
			}

			// draw canvas to parent if node is not a root
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
		// detach creator first, we need still him
		creator.detach();

		// delete all DOM below
		var $node = $getNode(node);
		$node.remove();
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
		self.stopEditNodeCaption();
	}).bind("keydown", "return", function() {
		var value = $captionEditor.val();
		if (self.nodeCaptionEditCommitted) {
			self.nodeCaptionEditCommitted(value);
		}
	}).mousedown(function(e) {
		e.stopPropagation();
	});
	var editorAttached = false;

	this.editNodeCaption = function(node) {
		var $node = $getNode(node);
		var $text = $getNodeCaption(node);
		var content = $text.text();

		// TODO show editor in place of node caption

		this.$getDrawingArea().bind("mousedown", function(e) {
			self.stopEditNodeCaption();
		});

		// show editor
		$captionEditor.attr({
			value : content
		}).appendTo($node).select();
		editorAttached = true;
	};

	this.stopEditNodeCaption = function() {
		if (editorAttached) {
			this.$getDrawingArea().unbind("mousedown");
			$captionEditor.detach();
			editorAttached = false;
		}
	};

	this.setNodeText = function(node, value) {
		var $text = $getNodeCaption(node);
		$text.text(value);
	};

	this.getCreator = function() {
		return creator;
	};
	
	this.isNodeDragging = function() {
		return nodeDragging;
	};

	function Creator() {
		var self = this;
		var dragging = false;
		
		this.node = null;
		this.lineColor = null;

		// red dot creator element
		var $nub = $("<div/>", {
			"class" : "creator-nub"
		});

		// canvas used by the creator tool to draw new lines
		var $canvas = $("<canvas/>", {
			id : "creator-canvas",
			"class" : "line-canvas"
		}).hide().appendTo($nub);

		$nub.draggable({
			revert : true,
			revertDuration : 0,
			start : function() {
				dragging = true;
				// show creator canvas
				$canvas.show();
				if (self.dragStarted) {
					self.dragStarted(self.node);
				}
			},
			drag : function(e, ui) {
				// update creator canvas
				var offsetX = ui.position.left;
				var offsetY = ui.position.top;

				// set depth+1 because we are drawing the canvas for the child
				drawLineCanvas($canvas, self.depth + 1, offsetX, offsetY,
						self.lineColor);
			},
			stop : function(e, ui) {
				dragging = false;
				// remove creator canvas, gets replaced by real canvas
				$canvas.hide();
				if (self.dragStopped) {
					self.dragStopped(self.node, ui.position.left,
							ui.position.top);
				}
			}
		});

		this.attachToNode = function(node) {
			if (this.node === node) {
				return;
			}

			this.node = node;
			this.depth = node.getDepth();

			var $node = $getNode(node);
			$nub.appendTo($node);
		};

		this.detach = function() {
			$nub.detach();
		};

		this.setLineColor = function(color) {
			this.lineColor = color;
		};
		
		this.isDragging = function() {
			return dragging;
		};
	}
};

// inherit from base canvas view
DefaultCanvasView.prototype = new CanvasView();