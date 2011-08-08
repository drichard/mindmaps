mindmaps.start = function() {
	var action = mindmaps.StaticCanvas.getAction();
	var options = mindmaps.StaticCanvas.getOptions();
	var document = mindmaps.StaticCanvas.getDocument();

	console.log(action);
	console.log(options);
	console.log(document.title);

	if (!(document && action)) {
		// nothing to render
		return;
	}
	
	var view = new mindmaps.StaticCanvasView($("#container"));
	var viewPresenter = new mindmaps.StaticCanvasPresenter(document, action, options, view);
	viewPresenter.go();
};