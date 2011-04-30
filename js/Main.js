var MainView = function() {
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
	
	this.getSizeForCanvas = function() {
		var windowHeight = $(window).height();
		var headerHeight = $("#topbar").outerHeight(true);
		var footerHeight = $("#bottombar").outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		return height;
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
		var toolbarPresenter = new ToolBarPresenter(eventBus, appModel, toolbar);
		toolbarPresenter.go();
		
		var canvas = new DefaultCanvasView();
		view.setCanvas(canvas);
		view.setCanvasSize();
		var canvasPresenter = new CanvasPresenter(eventBus, appModel, canvas);
		canvasPresenter.go();
		
		var statusbar = new StatusBarView();
		//view.setStatusBar(statusbar);
		var statusbarPresenter = new StatusBarPresenter(eventBus, statusbar);
		
	};
};


