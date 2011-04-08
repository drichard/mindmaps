/**
 * 
 */
$(function() {
	var toolbar = new ToolBar();
	var canvas = new Canvas();
	var statusbar = new StatusBar();
	var view = new View(toolbar, canvas, statusbar);
	var presenter = new AppPresenter(view);
});

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

var View = function(toolbar, canvas, statusbar) {
	this.toolbar = toolbar;
	this.canvas = canvas;
	this.statusbar = statusbar;

	this.resizeCanvas = function() {
		var windowHeight = $(window).height();
		var headerHeight = this.toolbar.$toolbar.outerHeight(true);
		var footerHeight = this.statusbar.$statusbar.outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		this.canvas.setHeight(height);
	};

	
	$(window).resize(function() {
		this.resizeCanvas();
	});

	// set initial canvas size
	this.resizeCanvas();
	this.canvas.enableScroll();
};


var AppPresenter = function(view) {
	this.view = view;
};
