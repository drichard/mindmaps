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
	var captionEditor = new CaptionEditor();

	captionEditor.commit = function(text) {
		self.nodeCaptionEditCommitted(text);
	};

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

	function drawLineCanvas2($canvas, depth, offsetX, offsetY, $node, $parent,
			color) {
		var left, top, width, height;

		if (offsetX < 0) {
			left = $node.width();
			width = Math.abs(offsetX) - left;
		} else {
			left = $parent.width() - offsetX;
			width = -left;
		}

		// is the node's border bottom bar above the parent's?
		var nodeBelowParent = offsetY + $node.innerHeight() < $parent.innerHeight();
		if (nodeBelowParent) {
			top = $node.innerHeight();
			height = $parent.outerHeight() - offsetY - top;
		} else {
			top = $parent.innerHeight() - offsetY;
			height = $node.outerHeight() - top;
		}

		/**
		 * Positions the canvas correctly.
		 */
		$canvas.attr({
			width : width,
			height : height
		}).css({
			// "border" : "1px solid green",
			left : left + "px",
			top : top + "px"
		});

		// 2. draw the thing
		var canvas = $canvas[0];
		var ctx = canvas.getContext("2d");

		var lineWidth = 10 - depth || 1;
		ctx.lineWidth = lineWidth;

		ctx.strokeStyle = color;
		ctx.fillStyle = color;

		var startX, startY, endX, endY;

		if (left < 0) {
			startX = 0;
			endX = width;
		} else {
			startX = width;
			endX = 0;
		}

		if (nodeBelowParent) { // c
			startY = height - lineWidth / 2;
			endY = 0 + lineWidth / 2;
		} else {
			startY = 0 + lineWidth / 2;
			endY = height - lineWidth / 2;
		}

		ctx.beginPath();
		ctx.moveTo(startX, startY);

		var cp1x = startX < endX ? endX / 5 : startX - (startX / 5);
		var cp1y = startY;
		var cp2x = Math.abs(startX - endX) / 2;
		var cp2y = endY;
		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
		// ctx.lineTo(endX, endY);
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
		$drawingArea.delegate("div.node-caption", "mousedown", function(e) {
			var node = $(this).parent().data("node");
			if (self.nodeMouseDown) {
				self.nodeMouseDown(node);
			}
		});

		$drawingArea.delegate("div.node-caption", "mouseup", function(e) {
			var node = $(this).parent().data("node");
			if (self.nodeMouseUp) {
				self.nodeMouseUp(node);
			}
		});

		$drawingArea.delegate("div.node-caption", "dblclick", function(e) {
			var node = $(this).parent().data("node");
			if (self.nodeDoubleClicked) {
				self.nodeDoubleClicked(node);
			}
		});

		$drawingArea.delegate("div.node-container", "mouseover", function(e) {
			if (e.target === this) {
				var node = $(this).data("node");
				if (self.nodeMouseOver) {
					self.nodeMouseOver(node);
				}
			}
			return false;
		});
		
		$drawingArea.delegate("div.node-caption", "mouseover", function(e) {
			if (e.target === this) {
				var node = $(this).parent().data("node");
				if (self.nodeCaptionMouseOver) {
					self.nodeCaptionMouseOver(node);
				}
			}
			return false;
		});
	};

	this.drawMap = function(map) {
		var now = new Date().getTime();
		var $drawingArea = this.$getDrawingArea();

		// clear map first
		creator.detach();
		$drawingArea.children().remove();

		var root = map.root;
		// center root
		var center = new Point($drawingArea.width() / 2,
				$drawingArea.height() / 2);
		root.offset = center;

		// 1.5. do NOT detach for now since DIV dont have widths and heights,
		// and loading maps draws wrong canvases (or create nodes and then draw
		// canvases)

		var detach = false;
		if (detach) {
			// detach drawing area during map creation to avoid unnecessary DOM
			// repaint events. (binary7 is 3 times faster)
			var $parent = $drawingArea.parent();
			$drawingArea.detach();
			self.createNode(root, $drawingArea);
			$drawingArea.appendTo($parent);
		} else {
			self.createNode(root, $drawingArea);
		}

		console.log("draw map ms: ", new Date().getTime() - now);
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

		var bb = "none";

		if (!node.isRoot()) {
			var bThickness = 10 - depth || 1;
			var bColor = node.edgeColor;
			var bb = bThickness + "px solid " + bColor;
			console.log("ATTENTION ", bb);
		}

		// div node container
		var $node = $("<div/>", {
			id : "node-" + node.id,
			"class" : "node-container"
		}).css({
			left : offsetX + "px",
			top : offsetY + "px",
			"border-bottom" : bb
		}).data({
			node : node
		}).appendTo($parent);

		// node drag behaviour
		/**
		 * Only attach the drag handler once we mouse over it. this speeds up
		 * loading of big maps.
		 */
		$node.one("mouseenter", function() {
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
					var offsetX = ui.position.left;
					var offsetY = ui.position.top;
					var color = node.edgeColor;
					var $canvas = $getNodeCanvas(node);

					drawLineCanvas2($canvas, depth, offsetX, offsetY, $node,
							$parent, color);

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
		});

		// text caption
		var $text = $("<div/>", {
			id : "node-caption-" + node.id,
			"class" : "node-caption",
			text : node.text.caption
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
			// drawLineCanvas($canvas, depth, offsetX, offsetY, node.edgeColor);

			drawLineCanvas2($canvas, depth, offsetX, offsetY, $node, $parent,
					node.edgeColor);
			$canvas.appendTo($node);
		}

		if (node.isRoot()) {
			$node.children().andSelf().addClass("root");
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
		var position = node.offset.x > 0 ? " right" : " left";
		var openClosed = node.collapseChildren ? " closed" : " open";
		var $collapseButton = $("<div/>", {
			"class" : "button-collapse no-select" + openClosed + position
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

	this.editNodeCaption = function(node) {
		var $text = $getNodeCaption(node);
		var $cancelArea = this.$getDrawingArea();
		captionEditor.edit($text, $cancelArea);
	};

	this.stopEditNodeCaption = function(cancel) {
		captionEditor.stop(cancel);
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

	function CaptionEditor() {
		var self = this;
		var attached = false;
		var oldText = null;
		var $text = null;
		var $cancelArea = null;

		// text input for node edits.
		var $editor = $("<input/>", {
			type : "text",
			"class" : "caption-editor"
		}).bind("keydown", "esc", function() {
			self.stop(true);
		}).bind("keydown", "return", function() {
			if (self.commit) {
				self.commit($editor.val());
			}
		}).mousedown(function(e) {
			// avoid premature canceling
			e.stopPropagation();
		});

		this.edit = function($text_, $cancelArea_) {
			// TODO put text into span and hide()
			$text = $text_;
			$cancelArea = $cancelArea_;
			oldText = $text.text();
			var width = $text.width();
			var height = $text.height();
			$text.empty();

			$cancelArea.bind("mousedown.editNodeCaption", function(e) {
				self.stop(true);
			});

			$text.addClass("edit");

			// show editor
			$editor.attr({
				value : oldText
			}).css({
				width : width + "px",
				height : height + "px"
			}).appendTo($text).select();
			attached = true;
		};

		this.stop = function(cancel) {
			if (attached) {
				$text.removeClass("edit");
				attached = false;
				$editor.detach();
				$cancelArea.unbind("mousedown.editNodeCaption");
			}

			if (cancel) {
				$text.text(oldText);
			}
		};
	}

	function Creator() {
		var self = this;
		var dragging = false;

		this.node = null;
		this.lineColor = null;

		$wrapper = $("<div/>", {
			id: "creator-wrapper"
		});
		
		// red dot creator element
		var $nub = $("<div/>", {
			id : "creator-nub"
		}).appendTo($wrapper);

		// canvas used by the creator tool to draw new lines
		var $canvas = $("<canvas/>", {
			id : "creator-canvas",
			"class" : "line-canvas"
		}).hide().appendTo($wrapper);

		$wrapper.draggable({
			revert : true,
			revertDuration : 0,
			start : function() {
				dragging = true;
				// show creator canvas
				$canvas.show();
				if (self.dragStarted) {
					self.lineColor = self.dragStarted(self.node);
				}
			},
			drag : function(e, ui) {
				// update creator canvas
				var offsetX = ui.position.left;
				var offsetY = ui.position.top;

				// set depth+1 because we are drawing the canvas for the child
				// drawLineCanvas($canvas, self.depth + 1, offsetX, offsetY,
				// self.lineColor);

				var $node = $getNode(self.node);
				drawLineCanvas2($canvas, self.depth + 1, offsetX, offsetY,
						$nub, $node, self.lineColor);
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
			
			// position the nub correctly
			if (node.offset.x > 0) {
				$wrapper.removeClass("left").addClass("right");
			} else {
				$wrapper.removeClass("right").addClass("left");
			}
			
			// remove any positioning that the draggable might have caused
			$wrapper.css({
				left: "",
				top: ""
			});
			$wrapper.appendTo($node);
		};

		this.detach = function() {
			$wrapper.detach();
		};

		this.isDragging = function() {
			return dragging;
		};
	}
};

// inherit from base canvas view
DefaultCanvasView.prototype = new CanvasView();