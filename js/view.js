var Canvas = function() {
	this.$canvasContainer = $("#canvas-container");
	this.$canvas = $("#canvas");
	
	this.setHeight = function(height) {
		this.$canvasContainer.height(height);
	};
	
	this.enableScroll = function() {
		this.$canvasContainer.scrollview();
	};
};

var ToolBar = function() {
	var self = this;
	this.$toolbar = $("#header");
	
	$("#toolbar button").button();
	$("#toolbar .buttonset").buttonset();
	$("#button-undo").button("disable");
	$("#button-redo").button("disable");

	$("#button-save").button("option", "icons", {
		primary : "ui-icon-disk"
	});
	$("#button-close").button("option", "icons", {
		primary : "ui-icon-circle-close"
	});
};

var StatusBar = function() {
	this.$statusbar = $("#footer");
};

var AppView = function(toolbar, canvas, statusbar) {
	var self = this;
	this.toolbar = toolbar;
	this.canvas = canvas;
	this.statusbar = statusbar;

	/**
	 * Sets the height of the canvas to fit between header and footer.
	 */
	this.resizeCanvas = function() {
		var windowHeight = $(window).height();
		var headerHeight = this.toolbar.$toolbar.outerHeight(true);
		var footerHeight = this.statusbar.$statusbar.outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		this.canvas.setHeight(height);
	};

	
	$(window).resize(function() {
		self.resizeCanvas();
	});

	// set initial canvas size
	this.resizeCanvas();
	this.canvas.enableScroll();
};