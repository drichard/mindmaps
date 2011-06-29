// TODO take container as argument,c reate drawing area dynamically. remove on
// clear();, recreate on init()
mindmaps.CanvasView = function() {
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
		this.scroll(w / 2, h / 2);
	};

	this.scroll = function(x, y) {
		var c = this.$getContainer();
		c.scrollLeft(x).scrollTop(y);
	};

	this.applyViewZoom = function() {
		var delta = this.zoomFactorDelta;
		// console.log(delta);

		var c = this.$getContainer();
		var sl = c.scrollLeft();
		var st = c.scrollTop();

		var cw = c.width();
		var ch = c.height();
		var cx = cw / 2 + sl;
		var cy = ch / 2 + st;

		cx *= this.zoomFactorDelta;
		cy *= this.zoomFactorDelta;

		sl = cx - cw / 2;
		st = cy - ch / 2;
		// console.log(sl, st);

		var drawingArea = this.$getDrawingArea();
		var width = drawingArea.width();
		var height = drawingArea.height();
		drawingArea.width(width * delta).height(height * delta);

		// scroll only after drawing area's width was set.
		this.scroll(sl, st);

		// adjust background size
		var backgroundSize = parseFloat(drawingArea.css("background-size"));
		if (isNaN(backgroundSize)) {
			// parsing could possibly fail in the future.
			console.warn("Could not set background-size!");
		}
		drawingArea.css("background-size", backgroundSize * delta);
	};

	this.setDimensions = function(width, height) {
		width = width * this.zoomFactor;
		height = height * this.zoomFactor;

		var drawingArea = this.$getDrawingArea();
		drawingArea.width(width).height(height);
	};

	this.setZoomFactor = function(zoomFactor) {
		this.zoomFactorDelta = zoomFactor / (this.zoomFactor || 1);
		this.zoomFactor = zoomFactor;
	};
};

mindmaps.CanvasView.prototype.drawMap = function(map) {
	throw new Error("Not implemented");
};

mindmaps.DefaultCanvasView = function() {
	var self = this;
	var nodeDragging = false;
	var creator = new Creator(this);
	var captionEditor = new CaptionEditor(this);
	var textMetrics = new TextMetrics(this);

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

	function drawLineCanvas($canvas, depth, offsetX, offsetY, $node, $parent,
			color) {
		var left, top, width, height;
		var zoomFactor = self.zoomFactor;
		offsetX = offsetX * zoomFactor;
		offsetY = offsetY * zoomFactor;

		// TODO find good solution for edge cases
		// if (offsetX <= 0) {
		// if ( offsetX + $node.width() < 0) {
		// // normal left
		// left = $node.width();
		// width = Math.abs(offsetX) - left;
		// } else {
		// left = -offsetX;
		// width = $node.width() + offsetX;
		// }
		//			
		// } else if (offsetX > 0){
		// if (offsetX > $parent.width()) {
		// // normal right
		// left = $parent.width() - offsetX;
		// width = -left;
		// } else if (offsetX > $parent.width() / 2) {
		// left = 0;
		// width = $parent.width() - offsetX;
		// } else {
		// left = -offsetX;
		// width = offsetX + $node.width();
		// }
		// }

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

		var lineWidth = self.getLineWidth(depth);
		ctx.lineWidth = lineWidth;

		ctx.strokeStyle = color;
		ctx.fillStyle = color;

		// shadow
		// ctx.shadowOffsetX = 3;
		// ctx.shadowOffsetY = 3;
		// ctx.shadowBlur = 5;
		// ctx.shadowColor = "#828282";

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
		var drawingArea = this.$getDrawingArea();
		drawingArea.children().remove();
		drawingArea.width(0).height(0);
	};

	this.getLineWidth = function(depth) {
		// var width = this.zoomFactor * (10 - depth);
		var width = this.zoomFactor * (14 - depth * 2);

		if (width < 2) {
			width = 2;
		}

		return width;
	};

	this.drawMap = function(map) {
		var now = new Date().getTime();
		var $drawingArea = this.$getDrawingArea();

		// clear map first
		$drawingArea.children().remove();

		var root = map.root;

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
	 * @param node - The model of the node.
	 * @param $parent - optional jquery parent object the new node is appended
	 *            to. Usually the parent node. If argument is omitted, the
	 *            getParent() method of the node is called to resolve the
	 *            parent.
	 * @param depth - Optional. The depth of the tree relative to the root. If
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

		if (node.isRoot()) {
			var w = this.getLineWidth(depth);
			$node.css("border-bottom-width", w);
		}

		if (!node.isRoot()) {
			// draw border and position manually only non-root nodes
			var bThickness = this.getLineWidth(depth);
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

						drawLineCanvas($canvas, depth, offsetX, offsetY,
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
		var font = node.text.font;
		var $text = $("<div/>", {
			id : "node-caption-" + node.id,
			"class" : "node-caption node-text-behaviour",
			text : node.text.caption
		}).css({
			"color" : font.color,
			"font-size" : this.zoomFactor * 100 + "%",
			"font-weight" : font.weight,
			"font-style" : font.style,
			"text-decoration" : font.decoration
		}).appendTo($node);

		var metrics = textMetrics.getTextMetrics(node);
		$text.css(metrics);

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
			drawLineCanvas($canvas, depth, offsetX, offsetY, $node, $parent,
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
		captionEditor.edit(node, this.$getDrawingArea());
	};

	this.stopEditNodeCaption = function() {
		captionEditor.stop();
	};

	this.setNodeText = function(node, value) {
		var $text = $getNodeCaption(node);
		var metrics = textMetrics.getTextMetrics(node, value);
		$text.css(metrics).text(value);
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

		drawLineCanvas($canvas, depth, offsetX, offsetY, $node, $parent, color);
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

		var metrics = textMetrics.getTextMetrics(node);

		$text.css({
			"color" : font.color,
			"font-weight" : font.weight,
			"font-style" : font.style,
			"text-decoration" : font.decoration
		}).css(metrics);

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

	this.scaleMap = function() {
		var zoomFactor = this.zoomFactor;
		var $root = this.$getDrawingArea().children().first();
		var root = $root.data("node");

		var w = this.getLineWidth(0);
		$root.css("border-bottom-width", w);

		// handle root differently
		var $text = $getNodeCaption(root);
		var metrics = textMetrics.getTextMetrics(root);
		$text.css({
			"font-size" : zoomFactor * 100 + "%",
			"left" : zoomFactor * -TextMetrics.ROOT_CAPTION_MIN_WIDTH / 2
		}).css(metrics);

		root.forEachChild(function(child) {
			scale(child, 1);
		});

		function scale(node, depth) {
			var $node = $getNode(node);

			// draw border and position manually
			var bWidth = self.getLineWidth(depth);

			$node.css({
				left : zoomFactor * node.offset.x,
				top : zoomFactor * node.offset.y,
				"border-bottom-width" : bWidth
			});

			var $text = $getNodeCaption(node);
			$text.css({
				"font-size" : zoomFactor * 100 + "%"
			});

			var metrics = textMetrics.getTextMetrics(node);
			$text.css(metrics);

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

	function CaptionEditor(view) {
		var self = this;
		var attached = false;

		// text input for node edits.
		var $editor = $("<textarea/>", {
			id : "caption-editor",
			"class" : "node-text-behaviour"
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
		}).bind("input", function() {
			var metrics = textMetrics.getTextMetrics(self.node, $editor.val());
			$editor.css(metrics);

			// slightly defer execution for better performance on slow browsers
			setTimeout(function() {
				view.redrawNodeConnectors(self.node);
			}, 1);
		});

		this.edit = function(node, $cancelArea) {
			if (attached) {
				return;
			}
			this.node = node;
			attached = true;

			// TODO put text into span and hide()
			this.$text = $getNodeCaption(node);
			this.$cancelArea = $cancelArea;

			this.text = this.$text.text();

			this.$text.css({
				width : "auto",
				height : "auto"
			}).empty().addClass("edit");

			$cancelArea.bind("mousedown.editNodeCaption", function(e) {
				self.stop();
			});

			var metrics = textMetrics.getTextMetrics(self.node, this.text);
			$editor.attr({
				value : this.text
			}).css(metrics).appendTo(this.$text).select();

		};

		this.stop = function() {
			if (attached) {
				attached = false;
				this.$text.removeClass("edit");
				$editor.detach();
				this.$cancelArea.unbind("mousedown.editNodeCaption");
				view.setNodeText(this.node, this.text);
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
		
		var $fakeNode = $("<div/>", {
			id : "creator-fakenode"
		}).appendTo($nub);

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
				drawLineCanvas($canvas, self.depth + 1, offsetX, offsetY,
						$fakeNode, $node, self.lineColor);
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

			// position the nub correctly
			$wrapper.removeClass("left right");
			if (node.offset.x > 0) {
				$wrapper.addClass("right");
			} else if (node.offset.x < 0) {
				$wrapper.addClass("left");
			}
			
			// set border on our fake node for correct line drawing
			this.depth = node.getDepth();
			var w = view.getLineWidth(this.depth + 1);
			$fakeNode.css("border-bottom-width", w);

			// remove any positioning that the draggable might have caused
			var $node = $getNode(node);
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

	/**
	 * Utitility object that calculates how much space a text would take up in a
	 * node. This is done through a dummy div that has the same formatting as
	 * the node and gets the text injected.
	 */
	function TextMetrics(view) {
		var $div = $("<div/>", {
			id : "text-metrics-dummy",
			"class" : "node-text-behaviour"
		}).css({
			position : "absolute",
			visibility : "hidden",
			height : "auto",
			width : "auto"
		}).appendTo(view.$getContainer());

		/**
		 * @param node - the node whose text is to be measured.
		 * @param text - optional, use this instead of text of node
		 * @returns object with properties width and height.
		 */
		this.getTextMetrics = function(node, text) {
			text = text || node.getCaption();
			var font = node.text.font;
			var minWidth = node.isRoot() ? TextMetrics.ROOT_CAPTION_MIN_WIDTH
					: TextMetrics.NODE_CAPTION_MIN_WIDTH;
			var maxWidth = TextMetrics.NODE_CAPTION_MAX_WIDTH;

			$div.css({
				"font-size" : view.zoomFactor * font.size,
				"min-width" : view.zoomFactor * minWidth,
				"max-width" : view.zoomFactor * maxWidth,
				"font-weight" : font.weight
			}).text(text);

			// add some safety pixels for firefox, otherwise it doesnt render
			// right on textareas
			var w = $div.width() + 2;
			var h = $div.height() + 2;

			return {
				width : w,
				height : h
			};
		};
	}
	TextMetrics.ROOT_CAPTION_MIN_WIDTH = 100;
	TextMetrics.NODE_CAPTION_MIN_WIDTH = 70;
	TextMetrics.NODE_CAPTION_MAX_WIDTH = 150;
};

// inherit from base canvas view
mindmaps.DefaultCanvasView.prototype = new mindmaps.CanvasView();