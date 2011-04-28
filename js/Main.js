var MainView = function(toolbar, canvas, statusbar) {
	var self = this;

	/**
	 * Sets the height of the canvas to fit between header and footer.
	 */
	this.setCanvasSize = function() {
		var windowHeight = $(window).height();
		var headerHeight = $("#topbar").outerHeight(true);
		var footerHeight = $("#bottombar").outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		this.canvas.setHeight(height);
	};

	
	$(window).resize(function() {
		self.setCanvasSize();
	});

//	this.setToolBar = function(toolbar) {
//		this.toolbar = toolbar;
//	};
//	
	this.setCanvas = function(canvas) {
		this.canvas = canvas;
	};
	
//	this.setStatusBar = function(statusbar) {
//		this.statusbar = statusbar;
//	};
};


var MainPresenter = function(eventBus, appModel, view) {
	this.go = function() {
		var toolbar = new ToolBarView();
		//view.setToolBar(toolbar);
		var toolbarPresenter = new ToolBarPresenter(eventBus, toolbar);
		
		var canvas = new DefaultCanvasView();
		var canvasPresenter = new CanvasPresenter(eventBus, appModel, canvas);
		
		var statusbar = new StatusBarView();
		//view.setStatusBar(statusbar);
		var statusbarPresenter = new StatusBarPresenter(eventBus, statusbar);
		
		view.setCanvas(canvas);
		view.setCanvasSize();
	};
};


