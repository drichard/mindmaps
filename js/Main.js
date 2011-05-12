var mindmaps = mindmaps || {};

mindmaps.MainView = function() {
	var self = this;

	this.$getCanvasContainer = function() {
		return $("#canvas-container");
	};

	/**
	 * Sets the height of the canvas to fit between header and footer.
	 */
	this.setCanvasSize = function() {
		var windowHeight = $(window).height();
		var headerHeight = $("#topbar").outerHeight(true);
		var footerHeight = $("#bottombar").outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		this.$getCanvasContainer().height(height);
	};

	this.init = function() {
		$(window).resize(function() {
			self.setCanvasSize();
		});
		this.setCanvasSize();
	};

	this.getHeaderHeight = function() {
		return $("#topbar").outerHeight(true);
	};
};

mindmaps.NavigatorView = function() {
	var self = this;
	var $content = $("#navigator");
	var $dragger = $("#navi-canvas-overlay");

	/**
	 * Returns a jquery object.
	 */
	this.getContent = function() {
		var $html = $("<div/>", {

		});
		return $content;
	};

	this.setDraggerSize = function(width, height) {
		$dragger.css({
			width : width,
			height : height
		});
	};

	this.setDraggerPosition = function(x, y) {
		console.log(x, y);
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

mindmaps.NavigatorPresenter = function(eventBus, appModel, view, $container) {
	var CANVAS_WIDTH = 250;
	var canvasSize = null;
	var viewDragging = false;

	$container.scroll(function() {
		console.log("kicking");
		if (!viewDragging) {
			console.log("moving");
			// TODO optimize
			var doc = appModel.getDocument();
			var dim = doc.dimensions;

			var sl = $container.scrollLeft();
			var st = $container.scrollTop();
			// sl / dox = dl / cw
			// dl = sl * cw / dox
			var left = sl * canvasSize.x / dim.x;
			var top = st * canvasSize.y / dim.y;
			view.setDraggerPosition(left, top);
		}
	});

	view.dragStart = function() {
		viewDragging = true;
	};

	view.dragging = function(x, y) {
		var doc = appModel.getDocument();
		var dimensions = doc.dimensions;
		var scrollLeft = dimensions.x * x / canvasSize.x;
		var scrollTop = dimensions.y * y / canvasSize.y;
		$container.scrollLeft(scrollLeft).scrollTop(scrollTop);
	};

	view.dragStop = function() {
		viewDragging = false;
	};

	// TODO event open
	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {
		// calculate canvas height
		var dimensions = doc.dimensions;
		var factor = dimensions.x / CANVAS_WIDTH;
		var height = dimensions.y / factor;
		canvasSize = new mindmaps.Point(CANVAS_WIDTH, height);
		view.setCanvasSize(CANVAS_WIDTH, height);
	});

	this.go = function() {
		view.init();
	};

	// TODO event continaer resize
	$(window).resize(function() {
		var cw = $container.width();
		var ch = $container.height();
		var dimensions = appModel.getDocument().dimensions;
		// cw = 4000
		// canvas = 250
		// 4000 / 250 = cw / dw
		// dw = cw * 250 / 4000
		var draggerWidth = (cw * canvasSize.x) / dimensions.x;
		var draggerHeight = (ch * canvasSize.y) / dimensions.y;

		view.setDraggerSize(draggerWidth, draggerHeight);

	});
};

mindmaps.MainPresenter = function(eventBus, appModel, view) {
	this.go = function() {
		// init all presenters
		var toolbar = new mindmaps.ToolBarView();
		var toolbarPresenter = new mindmaps.ToolBarPresenter(eventBus,
				appModel, toolbar);
		toolbarPresenter.go();

		var canvas = new mindmaps.DefaultCanvasView();
		var canvasPresenter = new mindmaps.CanvasPresenter(eventBus, appModel,
				canvas);
		canvasPresenter.go();

		var statusbar = new mindmaps.StatusBarView();
		var statusbarPresenter = new mindmaps.StatusBarPresenter(eventBus,
				statusbar);
		statusbarPresenter.go();

		var cdf = new mindmaps.FloatPanelFactory(view.$getCanvasContainer());

		// floating Panels
		var nodePanel = cdf.create("Properties");
		statusbarPresenter.addEntry(nodePanel);

		var naviView = new mindmaps.NavigatorView();
		var naviPresenter = new mindmaps.NavigatorPresenter(eventBus, appModel,
				naviView, view.$getCanvasContainer());
		naviPresenter.go();

		var navigatorPanel = cdf.create("Navigator", naviView.getContent());
		statusbarPresenter.addEntry(navigatorPanel);

		var chatPanel = cdf.create("Chat");
		statusbarPresenter.addEntry(chatPanel);

		view.init();
	};
};
