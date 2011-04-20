var AppView = function(toolbar, canvas, statusbar) {
	var self = this;
	this.toolbar = toolbar;
	this.canvas = canvas;
	this.statusbar = statusbar;

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

	// set initial canvas size
	this.setCanvasSize();
	
	// TODO fix scrolling
	// #scroller doesnt resize
	// #drawing-area doesnt grow
	//canvas.enableScroll();
	//$("#scroller").scrollview();
};


var AppPresenter = function(view) {
	this.view = view;
};

AppPresenter.prototype.init = function() {
};
