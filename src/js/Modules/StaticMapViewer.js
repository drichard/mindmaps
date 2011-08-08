mindmaps.start = function() {
	var action = mindmaps.StaticCanvasViewController.getAction();
	var options = mindmaps.StaticCanvasViewController.getOptions();
	var document = mindmaps.StaticCanvasViewController.getDocument();

	console.log(action);
	console.log(options);
	console.log(document.title);

	if (!(document && action)) {
		// nothing to render
		return;
	}
	
	var view = new mindmaps.StaticCanvasView($("#content"));
	var viewPresenter = new mindmaps.StaticCanvasPresenter(document, action, options, view);
	viewPresenter.go();
};