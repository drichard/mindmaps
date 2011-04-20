$(function() {
	var eventBus = new EventBus();

	var toolbar = new ToolBarView();
	var toolbarPresenter = new ToolBarPresenter(toolbar);

	var canvas = new CanvasView();
	var canvasPresenter = new CanvasPresenter(canvas, eventBus);

	var statusbar = new StatusBarView();
	var statusbarPresenter = new StatusBarPresenter(statusbar);

	var appView = new AppView(toolbar, canvas, statusbar);
	var appPresenter = new AppPresenter(appView);
	// appPresenter.init();

	var map = getBinaryMapWithDepth(5);
	eventBus.publish("mindMapLoaded", map);

	// TODO fix scrolling
	// #scroller doesnt resize
	// #drawing-area doesnt grow
	// canvas.enableScroll();
	// $("#scroller").scrollview();
	var scroller = $("#scroller");
	var drawArea = $("#drawing-area");

	// appView.canvas.enableScroll();
	$("#canvas-container").scrollview({
		scrollArea : scroller,
		doubleClick : false
	});
});