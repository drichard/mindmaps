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

	this.getHeaderHeight = function() {
		return $("#topbar").outerHeight(true);
	};
};

mindmaps.MainPresenter = function(eventBus, appModel, view) {
	this.go = function() {
		// init all presenters
		var toolbar = new mindmaps.ToolBarView();
		var toolbarPresenter = new mindmaps.ToolBarPresenter(eventBus,
				appModel, toolbar);
		toolbarPresenter.go();

		var canvas = new mindmaps.DefaultCanvasView();
		var canvasPresenter = new mindmaps.CanvasPresenter(eventBus, appModel,
				canvas);
		canvasPresenter.go();

		var statusbar = new mindmaps.StatusBarView();
		var statusbarPresenter = new mindmaps.StatusBarPresenter(eventBus,
				statusbar);
		statusbarPresenter.go();

		var cdf = new mindmaps.CanvasDialogFactory(view.$getCanvasContainer());
		// floating dialogs
		
		var nodeDialog = cdf.create("Properties");
		statusbarPresenter.addEntry(nodeDialog);

		var navigatorDialog = cdf.create("Navigator");
		statusbarPresenter.addEntry(navigatorDialog);

		var chatDialog = cdf.create("Chat");
		statusbarPresenter.addEntry(chatDialog);

		view.init();
	};
};
