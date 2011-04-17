
$(function() {
	var toolbar = new ToolBar();
	
	
	var canvas = new Canvas();
	var statusbar = new StatusBar();
	
	
	
	var view = new AppView(toolbar, canvas, statusbar);
	var presenter = new AppPresenter(view);

	// TODO fix scrolling
	// #scroller doesnt resize
	// #drawing-area doesnt grow
	view.canvas.enableScroll();
});