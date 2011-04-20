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
	//appPresenter.init();
	
	var map = getBinaryMapWithDepth(5);
	eventBus.publish("mindMapLoaded", map);
	
	var scroller = $("#scroller").css("cursor", "-moz-grab");
	var drawArea = $("#drawing-area").css("cursor", "-moz-grab");
	
	appView.canvas.enableScroll();
	//$("#canvas-container").scrollview({scrollArea: scroller});
});