var mindmaps = mindmaps || {};

mindmaps.NavigatorView = function() {
	var self = this;

	var $content = $("#navigator");
	var $contentActive = $content.children(".active").hide();
	var $contentInactive = $content.children(".inactive").hide();
	var $dragger = $("#navi-canvas-overlay");

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

	this.setCanvasSize = function(width, height) {
		$("#navi-canvas").attr({
			width : width,
			height : height
		});
	};

	this.init = function(canvasSize) {
		$("#navi-buttons").children().button();

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
};

mindmaps.NavigatorPresenter = function(eventBus, appModel, view, container) {
	var $container = container.getContent();
	var CANVAS_WIDTH = 250;
	var viewDragging = false;

	function calculateDraggerSize(canvasSize, docSize) {
		var cw = $container.width();
		var ch = $container.height();
		// doc.x / container.x = canvas.x / dragger.x
		var draggerWidth = (cw * canvasSize.x) / docSize.x;
		var draggerHeight = (ch * canvasSize.y) / docSize.y;

		view.setDraggerSize(draggerWidth, draggerHeight);
	}

	function calculateCanvasHeight(docSize) {
		var width = CANVAS_WIDTH;
		var factor = docSize.x / width;
		var height = docSize.y / factor;

		view.setCanvasSize(width, height);

		return new mindmaps.Point(width, height);
	}

	function calculateDraggerPosition(canvasSize, docSize) {
		var sl = $container.scrollLeft();
		var st = $container.scrollTop();

		// sl / dox = dl / cw
		// dl = sl * cw / dox
		var left = sl * canvasSize.x / docSize.x;
		var top = st * canvasSize.y / docSize.y;
		view.setDraggerPosition(left, top);
	}

	function documentOpened(dimensions) {
		var canvasSize = calculateCanvasHeight(dimensions);

		// scroll container when the dragger is dragged
		view.dragging = function(x, y) {
			var scrollLeft = dimensions.x * x / canvasSize.x;
			var scrollTop = dimensions.y * y / canvasSize.y;
			$container.scrollLeft(scrollLeft).scrollTop(scrollTop);
		};

		// move dragger when container was scrolled
		$container.bind("scroll.navigator-view", function() {
			if (!viewDragging) {
				calculateDraggerPosition(canvasSize, dimensions);
			}
		});

		// set dragger size when container was resized
		container.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
			calculateDraggerSize(canvasSize, dimensions);
		});

		calculateDraggerSize(canvasSize, dimensions);
		view.showActiveContent();
	}

	function documentClosed() {
		container.unsubscribe(mindmaps.CanvasContainer.Event.RESIZED);
		$container.unbind("scroll.navigator-view");

		view.showInactiveContent();
	}

	view.dragStart = function() {
		viewDragging = true;
	};

	view.dragStop = function() {
		viewDragging = false;
	};

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
		documentOpened(doc.dimensions);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
		documentOpened(doc.dimensions);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
		documentClosed();
	});

	this.go = function() {
		view.init();
	};
};