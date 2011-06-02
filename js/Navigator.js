mindmaps.NavigatorView = function() {
	var self = this;

	var $content = $("#template-navigator").tmpl();
	var $contentActive = $content.children(".active").hide();
	var $contentInactive = $content.children(".inactive").hide();
	var $dragger = $("#navi-canvas-overlay", $content);
	var $canvas = $("#navi-canvas", $content);

	/**
	 * Returns a jquery object.
	 */
	this.getContent = function() {
		return $content;
	};

	this.showActiveContent = function() {
		$contentInactive.hide();
		$contentActive.show();
	};

	this.showInactiveContent = function() {
		$contentActive.hide();
		$contentInactive.show();
	};

	this.setDraggerSize = function(width, height) {
		$dragger.css({
			width : width,
			height : height
		});
	};

	this.setDraggerPosition = function(x, y) {
		$dragger.css({
			left : x,
			top : y
		});
	};

	this.setCanvasHeight = function(height) {
		$("#navi-canvas", $content).css({
			height : height
		});
	};

	this.getCanvasWidth = function() {
		return $("#navi-canvas", $content).width();
	};

	this.init = function(canvasSize) {

		$("#button-navi-zoom-in", $content).button({
			text : false,
			icons : {
				primary : "ui-icon-zoomin"
			}
		}).click(function() {
			if (self.buttonZoomInClicked) {
				self.buttonZoomInClicked();
			}
		});

		$("#button-navi-zoom-out", $content).button({
			text : false,
			icons : {
				primary : "ui-icon-zoomout"
			}
		}).click(function() {
			if (self.buttonZoomOutClicked) {
				self.buttonZoomOutClicked();
			}
		});

		$dragger.draggable({
			containment : "parent",
			start : function(e, ui) {
				if (self.dragStart) {
					self.dragStart();
				}
			},
			drag : function(e, ui) {
				if (self.dragging) {
					var x = ui.position.left;
					var y = ui.position.top;
					self.dragging(x, y);
				}
			},
			stop : function(e, ui) {
				if (self.dragStop) {
					self.dragStop();
				}
			}
		});
	};

	this.draw = function(mindmap, scaleFactor) {
		var root = mindmap.root;
		var canvas = $canvas[0];
		var width = canvas.width;
		var height = canvas.height;
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, width, height);
		ctx.lineWidth = 1.8;

		drawNode(root, width / 2, height / 2);

		// draw rect for root
		ctx.fillRect(width / 2 - 4, height / 2 - 2, 8, 4);

		function scale(value) {
			return value / scaleFactor;
		}

		function drawNode(node, x, y) {
			ctx.save();
			ctx.translate(x, y);

			if (!node.collapseChildren) {
				node.forEachChild(function(child) {
					ctx.beginPath();
					ctx.strokeStyle = child.branchColor;
					ctx.moveTo(0, 0);
					var posX = scale(child.offset.x);
					var posY = scale(child.offset.y);
					// var textWidth =
					// ctx.measureText(child.getCaption()).width;
					textWidth = 5;

					/**
					 * draw two lines: one going up to the node, and a second
					 * horizontal line for the node caption. if node is left of
					 * the parent (posX < 0), we shorten the first line and draw
					 * the rest horizontally to arrive at the node's offset
					 * position. in the other case, we draw the line to the
					 * node's offset and draw another for the text.
					 */
					if (posX < 0) {
						var firstStop = posX + textWidth;
						var secondStop = posX;
					} else {
						var firstStop = posX;
						var secondStop = posX + textWidth;
					}
					ctx.lineTo(firstStop, posY);
					ctx.lineTo(secondStop, posY);

					ctx.stroke();
					drawNode(child, secondStop, posY);
				});
			}
			ctx.restore();
		}
	};

	this.showZoomLevel = function(zoom) {
		$("#navi-zoom-level").text(zoom);
	};
};

mindmaps.NavigatorPresenter = function(eventBus, appModel, view, container,
		zoomController) {
	var self = this;
	var $container = container.getContent();
	var viewDragging = false;
	var scale = zoomController.DEFAULT_ZOOM;
	var canvasSize = mindmaps.Point.ZERO;
	var docSize = null;
	var mindmap = null;

	function calculateDraggerSize() {
		var cw = $container.width() / scale;
		var ch = $container.height() / scale;
		// doc.x / container.x = canvas.x / dragger.x
		var width = (cw * canvasSize.x) / docSize.x;
		var height = (ch * canvasSize.y) / docSize.y;

		// limit size to bounds of canvas
		if (width > canvasSize.x) {
			width = canvasSize.x;
		}

		if (height > canvasSize.y) {
			height = canvasSize.y;
		}

		view.setDraggerSize(width, height);
	}

	function calculateCanvasSize() {
		var width = view.getCanvasWidth();
		var _scale = docSize.x / width;
		var height = docSize.y / _scale;

		view.setCanvasHeight(height);

		canvasSize.x = width;
		canvasSize.y = height;
	}

	function calculateDraggerPosition() {
		var sl = $container.scrollLeft() / scale;
		var st = $container.scrollTop() / scale;

		// sl / dox = dl / cw
		// dl = sl * cw / dox
		var left = sl * canvasSize.x / docSize.x;
		var top = st * canvasSize.y / docSize.y;
		view.setDraggerPosition(left, top);
	}
	
	function calculateZoomLevel() {
		var zoomlevel = scale * 100 + "%";
		view.showZoomLevel(zoomlevel);
	}

	function documentOpened(doc) {
		docSize = doc.dimensions;
		mindmap = doc.mindmap;

		calculateCanvasSize();
		calculateDraggerPosition();
		calculateDraggerSize();
		calculateZoomLevel();
		renderView();

		view.showActiveContent();

		// move dragger when container was scrolled
		$container.bind("scroll.navigator-view", function() {
			if (!viewDragging) {
				calculateDraggerPosition();
			}
		});
	}

	function renderView() {
		// draw canvas
		var scale = docSize.x / canvasSize.x;
		view.draw(mindmap, scale);
	}

	function documentClosed() {
		docSize = null;
		mindmap = null;
		scale = 1;
		// clean up
		// remove listeners
		$container.unbind("scroll.navigator-view");

		view.showInactiveContent();
	}

	view.dragStart = function() {
		viewDragging = true;
	};

	// scroll container when the dragger is dragged
	view.dragging = function(x, y) {
		var scrollLeft = scale * docSize.x * x / canvasSize.x;
		var scrollTop = scale * docSize.y * y / canvasSize.y;
		$container.scrollLeft(scrollLeft).scrollTop(scrollTop);
	};

	view.dragStop = function() {
		viewDragging = false;
	};

	view.buttonZoomInClicked = function() {
		zoomController.zoomIn();
	};

	view.buttonZoomOutClicked = function() {
		zoomController.zoomOut();
	};

	// set dragger size when container was resized
	container.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
		if (docSize) {
			calculateDraggerSize();
		}
	});

	// document events
	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
		documentOpened(doc);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
		documentOpened(doc);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
		documentClosed();
	});

	// node events
	eventBus.subscribe(mindmaps.Event.NODE_MOVED, function() {
		renderView();
	});

	eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function() {
		renderView();
	});

	eventBus.subscribe(mindmaps.Event.NODE_CREATED, function() {
		renderView();
	});

	eventBus.subscribe(mindmaps.Event.NODE_DELETED, function() {
		renderView();
	});

	eventBus.subscribe(mindmaps.Event.NODE_OPENED, function() {
		renderView();
	});

	eventBus.subscribe(mindmaps.Event.NODE_CLOSED, function() {
		renderView();
	});

	eventBus.subscribe(mindmaps.Event.ZOOM_CHANGED, function(zoomFactor) {
		scale = zoomFactor;
		calculateDraggerPosition();
		calculateDraggerSize();
		calculateZoomLevel();
	});

	this.go = function() {
		view.init();
		view.showInactiveContent();
	};
};