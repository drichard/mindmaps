var mindmaps = mindmaps || {};

mindmaps.MainView = function() {
	var self = this;

	this.$getCanvasContainer = function() {
		return $("#canvas-container");
	};

	/**
	 * Sets the height of the canvas to fit between header and footer.
	 */
	this.setCanvasSize = function() {
		var windowHeight = $(window).height();
		var headerHeight = $("#topbar").outerHeight(true);
		var footerHeight = $("#bottombar").outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		this.$getCanvasContainer().height(height);
	};

	
	this.init = function() {
		$(window).resize(function() {
			self.setCanvasSize();
		});
		this.setCanvasSize();
	};
};

mindmaps.MainPresenter = function(eventBus, appModel, view) {
	this.go = function() {
		var toolbar = new mindmaps.ToolBarView();
		var toolbarPresenter = new mindmaps.ToolBarPresenter(eventBus,
				appModel, toolbar);
		toolbarPresenter.go();

		var canvas = new mindmaps.DefaultCanvasView();
		canvas.container = view.$getCanvasContainer();
		var canvasPresenter = new mindmaps.CanvasPresenter(eventBus, appModel,
				canvas);
		canvasPresenter.go();

		var statusbar = new mindmaps.StatusBarView();
		var statusbarPresenter = new mindmaps.StatusBarPresenter(eventBus,
				statusbar);
		statusbarPresenter.go();

		var nodePropertiesDialog = new mindmaps.CanvasDialog("Properties");
		statusbarPresenter.addEntry(nodePropertiesDialog);

		var navigatorDialog = new mindmaps.CanvasDialog("Navigator");
		statusbarPresenter.addEntry(navigatorDialog);

		var chatDialog = new mindmaps.CanvasDialog("Chat");
		statusbarPresenter.addEntry(chatDialog);

		view.init();
	};
};
