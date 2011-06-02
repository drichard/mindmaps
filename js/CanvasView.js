// TODO take container as argument,c reate drawing area dynamically. remove on
// clear();, recreate on init()
mindmaps.CanvasView = function() {
	var BACKGROUND_SIZE = 24;

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

	this.scroll = function(x, y) {
		var c = this.$getContainer();
		c.scrollLeft(x).scrollTop(y);
	};

	this.scrollBy = function(x, y) {
		var c = this.$getContainer();
		c.scrollLeft(c.scrollLeft() + x).scrollTop(c.scrollTop() + y);
	};

	this.setDimensions = function(width, height, scroll) {
		width = width * this.zoomFactor;
		height = height * this.zoomFactor;

		var drawingArea = this.$getDrawingArea();

		// TODO fix this
		if (scroll) {
			var oldWidth = drawingArea.width();
			var oldHeight = drawingArea.height();
			var scrollW = (width - oldWidth) / 2;
			var scrollH = (height - oldHeight) / 2;
			// var c = this.$getContainer();
			// var sl = c.scrollLeft();
			// var st = c.scrollTop();
			//			
			// var cw = c.width();
			// var ch = c.height();
			//			
			// var cx = cw / 2 + sl;
			// var cy = ch / 2 + st;
			//			
			// var dw = oldWidth / 2 - cx;
			// var dh = oldHeight / 2 - cy;
			var dw = 0;
			var dh = 0;

			this.scrollBy(scrollW - dw, scrollH - dh);
		}

		drawingArea.width(width).height(height);

		// change background image size
		drawingArea.css("background-size", BACKGROUND_SIZE * this.zoomFactor);
	};

	this.setZoomFactor = function(zoomFactor) {
		this.zoomFactor = zoomFactor;
	};
};

mindmaps.CanvasView.prototype.drawMap = function(map) {
	throw new Error("Not implemented");
};

mindmaps.DefaultCanvasView = function() {
	// TODO solve this mess?
	var NODE_CAPTION_WIDTH = 50;
	var ROOT_NODE_CAPTION_WIDTH = 100;

	var self = this;
	var nodeDragging = false;
	var creator = new Creator(this);
	var captionEditor = new CaptionEditor();

	captionEditor.commit = function(text) {
		self.nodeCaptionEditCommitted(text);
	};

	function makeDraggable() {
		self.$getContainer().dragscrollable({
			dragSelector : "#drawing-area, canvas.line-canvas",
			acceptPropagatedEvent : false,
			delegateMode : true,
			preventDefault : true
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
		var zoomFactor = self.zoomFactor;
		offsetX = offsetX * zoomFactor;
		offsetY = offsetY * zoomFactor;

		// TODO find good solution for edge cases
//		if (offsetX <= 0) {
//			if ( offsetX + $node.width() < 0) {
//				// normal left
//				left = $node.width();
//				width = Math.abs(offsetX) - left;
//			} else {
//				left = -offsetX;
//				width = $node.width() + offsetX;
//			}
//			
//		} else if (offsetX > 0){
//			if (offsetX > $parent.width()) {
//				// normal right
//				left = $parent.width() - offsetX;
//				width = -left;
//			} else if (offsetX > $parent.width() / 2) {
//				left = 0;
//				width = $parent.width() - offsetX;
//			} else {
//				left = -offsetX;
//				width = offsetX + $node.width();
//			}
//		}
		
		if (offsetX < 0) {
			left = $node.width();
			width = Math.abs(offsetX) - left;
		} else {
			left = $parent.width() - offsetX;
			width = -left;
		}

		if (width < 0) {
			width = 1;
		}
		
		// is the node's border bottom bar above the parent's?
		var nodeBelowParent = offsetY + $node.innerHeight() < $parent
				.innerHeight();
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
			left : left,
			top : top
		});

		// 2. draw the thing
		var canvas = $canvas[0];
		var ctx = canvas.getContext("2d");
		
		var lineWidth = zoomFactor * (10 - depth) || 1;
		ctx.lineWidth = lineWidth;

		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		
		// shadow
//		ctx.shadowOffsetX = 3;
//		ctx.shadowOffsetY = 3;
//		ctx.shadowBlur    = 5;
//		ctx.shadowColor   = "#828282";

		var startX, startY, endX, endY;

		if (left < 0) {
			startX = 0;
			endX = width;
		} else {
			startX = width;
			endX = 0;
		}

		if (nodeBelowParent) {
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

		this.$getContainer().bind("mousewheel", function(e, delta) {
			if (self.mouseWheeled) {
				self.mouseWheeled(delta);
			}
		});
	};

	this.clear = function() {
		this.$getDrawingArea().children().remove();
		this.setDimensions(0, 0);
	};

	this.drawMap = function(map) {
		var now = new Date().getTime();
		var $drawingArea = this.$getDrawingArea();

		// clear map first
		$drawingArea.children().remove();

		var root = map.root;
		// // center root
		// var center = new mindmaps.Point($drawingArea.width() / 2,
		// $drawingArea
		// .height() / 2);
		// root.offset = center;

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

		console.debug("draw map ms: ", new Date().getTime() - now);
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
		}).data({
			node : node
		}).css({
			"font-size" : node.text.font.size
		});
		$node.appendTo($parent);

		if (!node.isRoot()) {
			// draw border and position manually only non-root nodes
			var bThickness = this.zoomFactor * (10 - depth) || 1;
			var bColor = node.branchColor;
			var bb = bThickness + "px solid " + bColor;

			$node.css({
				left : this.zoomFactor * offsetX,
				top : this.zoomFactor * offsetY,
				"border-bottom" : bb
			});

			// node drag behaviour
			/**
			 * Only attach the drag handler once we mouse over it. this speeds
			 * up loading of big maps.
			 */
			$node.one("mouseenter", function() {
				$node.draggable({
					// could be set
					// revert: true,
					// revertDuration: 0,
					handle : "div.node-caption:first",
					start : function() {
						nodeDragging = true;
					},
					drag : function(e, ui) {
						// reposition and draw canvas while dragging
						var offsetX = ui.position.left / self.zoomFactor;
						var offsetY = ui.position.top / self.zoomFactor;
						var color = node.branchColor;
						var $canvas = $getNodeCanvas(node);

						drawLineCanvas2($canvas, depth, offsetX, offsetY,
								$node, $parent, color);

						// fire dragging event
						if (self.nodeDragging) {
							self.nodeDragging();
						}
					},
					stop : function(e, ui) {
						nodeDragging = false;
						var pos = new mindmaps.Point(ui.position.left
								/ self.zoomFactor, ui.position.top
								/ self.zoomFactor);

						// fire dragged event
						if (self.nodeDragged) {
							self.nodeDragged(node, pos);
						}
					}
				});
			});
		}

		// text caption
		var minWidth = node.isRoot() ? ROOT_NODE_CAPTION_WIDTH
				: NODE_CAPTION_WIDTH;
		var font = node.text.font;
		var $text = $("<div/>", {
			id : "node-caption-" + node.id,
			"class" : "node-caption",
			text : node.text.caption
		}).css({
			"color" : font.color,
			"font-size" : this.zoomFactor * 100 + "%",
			"min-width" : this.zoomFactor * minWidth,
			"font-weight" : font.weight,
			"font-style" : font.style,
			"text-decoration" : font.decoration
		}).appendTo($node);

		// create fold button for parent if he hasn't one already
		var parentAlreadyHasFoldButton = $parent.data("foldButton");
		var nodeOrParentIsRoot = node.isRoot() || parent.isRoot();
		if (!parentAlreadyHasFoldButton && !nodeOrParentIsRoot) {
			this.createFoldButton(parent);
		}

		if (!node.isRoot()) {
			// toggle visibility
			if (parent.foldChildren) {
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
			drawLineCanvas2($canvas, depth, offsetX, offsetY, $node, $parent,
					node.branchColor);
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
		// creator.detach();

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

		var $foldButton = $node.children(".button-fold").first();
		$foldButton.removeClass("open").addClass("closed");
	};

	this.openNode = function(node) {
		// console.log("opening node ", node.id);
		var $node = $getNode(node);
		$node.children(".node-container").show();

		var $foldButton = $node.children(".button-fold").first();
		$foldButton.removeClass("closed").addClass("open");
	};

	this.createFoldButton = function(node) {
		var position = node.offset.x > 0 ? " right" : " left";
		var openClosed = node.foldChildren ? " closed" : " open";
		var $foldButton = $("<div/>", {
			"class" : "button-fold no-select" + openClosed + position
		}).click(function(e) {
			// fire event
			if (self.foldButtonClicked) {
				self.foldButtonClicked(node);
			}

			e.preventDefault();
			return false;
		});

		// remember that foldButton was set and attach to node
		var $node = $getNode(node);
		$node.data({
			foldButton : true
		}).append($foldButton);
	};

	this.removeFoldButton = function(node) {
		var $node = $getNode(node);
		$node.data({
			foldButton : false
		}).children(".button-fold").remove();
	};

	this.editNodeCaption = function(node) {
		var $text = $getNodeCaption(node);
		var $cancelArea = this.$getDrawingArea();
		captionEditor.edit($text, $cancelArea);
	};

	this.stopEditNodeCaption = function() {
		captionEditor.stop();
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

	function drawNodeCanvas(node) {
		// TODO inline
		var parent = node.getParent();
		var depth = node.getDepth();
		var offsetX = node.offset.x;
		var offsetY = node.offset.y;
		var color = node.branchColor;

		var $node = $getNode(node);
		var $parent = $getNode(parent);
		var $canvas = $getNodeCanvas(node);

		drawLineCanvas2($canvas, depth, offsetX, offsetY, $node, $parent, color);
	}

	this.redrawNodeConnectors = function(node) {

		// redraw canvas to parent
		if (!node.isRoot()) {
			drawNodeCanvas(node);
		}

		// redraw all child canvases
		if (!node.isLeaf()) {
			node.forEachChild(function(child) {
				drawNodeCanvas(child);
			});
		}
	};

	this.updateNode = function(node) {
		var $node = $getNode(node);
		var $text = $getNodeCaption(node);
		var font = node.text.font;
		$node.css({
			"font-size" : font.size,
			"border-bottom-color" : node.branchColor
		});

		$text.css({
			"color" : font.color,
			"font-weight" : font.weight,
			"font-style" : font.style,
			"text-decoration" : font.decoration
		});

		this.redrawNodeConnectors(node);
	};

	this.positionNode = function(node) {
		var $node = $getNode(node);
		// TODO try animate
		// position
		$node.css({
			left : this.zoomFactor * node.offset.x,
			top : this.zoomFactor * node.offset.y
		});

		// redraw canvas to parent
		drawNodeCanvas(node);
	};

	this.scale = function() {
		var zoomFactor = this.zoomFactor;
		var $root = this.$getDrawingArea().children().first();
		var root = $root.data("node");

		// handle root differently
		var $text = $getNodeCaption(root);
		$text.css({
			"font-size" : zoomFactor * 100 + "%",
			"min-width" : zoomFactor * ROOT_NODE_CAPTION_WIDTH,
			"left" : zoomFactor * -ROOT_NODE_CAPTION_WIDTH / 2
		});

		root.forEachChild(function(child) {
			scale(child, 1);
		});

		function scale(node, depth) {
			var $node = $getNode(node);

			// position
			$node.css({
				left : zoomFactor * node.offset.x,
				top : zoomFactor * node.offset.y
			});

			// draw border and position manually only non-root nodes
			var bWidth = zoomFactor * (10 - depth) || 1;

			$node.css({
				"border-bottom-width" : bWidth
			});

			var $text = $getNodeCaption(node);
			$text.css({
				"font-size" : zoomFactor * 100 + "%",
				"min-width" : zoomFactor * NODE_CAPTION_WIDTH
			});

			// redraw canvas to parent
			drawNodeCanvas(node);

			// redraw all child canvases
			if (!node.isLeaf()) {
				node.forEachChild(function(child) {
					scale(child, depth + 1);
				});
			}
		}

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
			id : "caption-editor"
		}).bind("keydown", "esc", function() {
			self.stop();
		}).bind("keydown", "return", function() {
			if (self.commit) {
				self.commit($editor.val());
			}
		}).mousedown(function(e) {
			// avoid premature canceling
			e.stopPropagation();
		}).blur(function() {
			self.stop();
		});

		this.edit = function($text_, $cancelArea_) {
			if (attached) {
				return;
			}
			attached = true;

			// TODO put text into span and hide()
			$text = $text_;
			$cancelArea = $cancelArea_;
			oldText = $text.text();
			var width = $text.width();
			var height = $text.innerHeight();
			$text.empty();

			$cancelArea.bind("mousedown.editNodeCaption", function(e) {
				self.stop();
			});

			$text.addClass("edit");

			// show editor
			$editor.attr({
				value : oldText
			}).css({
				width : width,
				height : height
			}).appendTo($text).select();
		};

		this.stop = function() {
			if (attached) {
				attached = false;
				$text.removeClass("edit");
				$editor.detach();
				$cancelArea.unbind("mousedown.editNodeCaption");
				$text.text(oldText);
			}

		};
	}

	function Creator(view) {
		var self = this;
		var dragging = false;

		this.node = null;
		this.lineColor = null;

		var $wrapper = $("<div/>", {
			id : "creator-wrapper"
		}).bind("remove", function(e) {
			// detach the creator when some removed the node or opened a new map
			self.detach();
			// and avoid removing from DOM
			e.stopImmediatePropagation();

			console.debug("creator detached.");
			return false;
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
				var offsetX = ui.position.left / view.zoomFactor;
				var offsetY = ui.position.top / view.zoomFactor;

				// set depth+1 because we are drawing the canvas for the child
				var $node = $getNode(self.node);
				drawLineCanvas2($canvas, self.depth + 1, offsetX, offsetY,
						$nub, $node, self.lineColor);
			},
			stop : function(e, ui) {
				dragging = false;
				// remove creator canvas, gets replaced by real canvas
				$canvas.hide();
				if (self.dragStopped) {
					var $wp = $wrapper.position();
					var nubLeft = ui.position.left / view.zoomFactor;
					var nubTop = ui.position.top / view.zoomFactor;
					var distance = mindmaps.Util.distance($wp.left - nubLeft,
							$wp.top - nubTop);
					self.dragStopped(self.node, nubLeft, nubTop, distance);
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
			$wrapper.removeClass("left right");
			if (node.offset.x > 0) {
				$wrapper.addClass("right");
			} else if (node.offset.x < 0) {
				$wrapper.addClass("left");
			}

			// remove any positioning that the draggable might have caused
			$wrapper.css({
				left : "",
				top : ""
			}).appendTo($node);
		};

		this.detach = function() {
			$wrapper.detach();
			this.node = null;
		};

		this.isDragging = function() {
			return dragging;
		};
	}
};

// inherit from base canvas view
mindmaps.DefaultCanvasView.prototype = new mindmaps.CanvasView();