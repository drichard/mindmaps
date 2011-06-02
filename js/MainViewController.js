mindmaps.CanvasContainer = function() {
	var self = this;
	var $content = $("#canvas-container");

	this.getContent = function() {
		return $content;
	};

	/**
	 * Sets the height of the canvas to fit between header and footer.
	 */
	this.setSize = function() {
		var windowHeight = $(window).height();
		var headerHeight = $("#topbar").outerHeight(true);
		var footerHeight = $("#bottombar").outerHeight(true);
		var height = windowHeight - headerHeight - footerHeight;
		$content.height(height);

		var size = new mindmaps.Point($content.width(), height);
		self.publish(mindmaps.CanvasContainer.Event.RESIZED, size);
	};

	this.init = function() {
		$(window).resize(function() {
			self.setSize();
		});

		this.setSize();
	};

};
MicroEvent.mixin(mindmaps.CanvasContainer);

mindmaps.CanvasContainer.Event = {
	/**
	 * Fired when the container has been resized.
	 * 
	 * @param {mindmaps.Point} the new size
	 */
	RESIZED : "ResizedEvent"
};

mindmaps.MainView = function() {
};

mindmaps.MainViewController = function(eventBus, mindmapController,
		commandRegistry, view) {
	var zoomController = new mindmaps.ZoomController(eventBus, commandRegistry);

	this.go = function() {
		var canvasContainer = new mindmaps.CanvasContainer();
		canvasContainer.init();

		// init all presenters
		var toolbar = new mindmaps.ToolBarView();
		var toolbarPresenter = new mindmaps.ToolBarPresenter(eventBus,
				commandRegistry, toolbar);
		toolbarPresenter.go();

		var canvas = new mindmaps.DefaultCanvasView();
		var canvasPresenter = new mindmaps.CanvasPresenter(eventBus,
				commandRegistry, mindmapController, canvas, zoomController);
		canvasPresenter.go();

		var statusbar = new mindmaps.StatusBarView();
		var statusbarPresenter = new mindmaps.StatusBarPresenter(eventBus,
				statusbar);
		statusbarPresenter.go();

		// floating Panels
		var fpf = new mindmaps.FloatPanelFactory(canvasContainer);

		var inspectorView = new mindmaps.InspectorView();
		var inspectorPresenter = new mindmaps.InspectorPresenter(eventBus,
				commandRegistry, inspectorView);
		inspectorPresenter.go();

		var inspectorPanel = fpf
				.create("Inspector", inspectorView.getContent());
		inspectorPanel.show();
		statusbarPresenter.addEntry(inspectorPanel);

		var naviView = new mindmaps.NavigatorView();
		var naviPresenter = new mindmaps.NavigatorPresenter(eventBus, commandRegistry,
				naviView, canvasContainer, zoomController);
		naviPresenter.go();

		navigatorPanel = fpf.create("Navigator", naviView.getContent());
		navigatorPanel.show();
		statusbarPresenter.addEntry(navigatorPanel);
	};
};
