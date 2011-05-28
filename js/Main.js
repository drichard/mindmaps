
mindmaps.CanvasContainer = function() {
	MicroEvent.mixin(mindmaps.CanvasContainer);
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

mindmaps.MainPresenter = function(eventBus, appModel, view) {
	function bind() {

	}

	this.go = function() {
		var canvasContainer = new mindmaps.CanvasContainer();
		canvasContainer.init();

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

		var fpf = new mindmaps.FloatPanelFactory(canvasContainer);

		// floating Panels
		var inspectorView = new mindmaps.InspectorView();
		var inspectorPresenter = new mindmaps.InspectorPresenter(eventBus, appModel,
				inspectorView);
		inspectorPresenter.go();
		
		var inspectorPanel = fpf.create("Inspector", inspectorView.getContent());
		inspectorPanel.show();
		statusbarPresenter.addEntry(inspectorPanel);

		var naviView = new mindmaps.NavigatorView();
		var naviPresenter = new mindmaps.NavigatorPresenter(eventBus, appModel,
				naviView, canvasContainer);
		naviPresenter.go();

		navigatorPanel = fpf.create("Navigator", naviView.getContent());
		navigatorPanel.show();
		statusbarPresenter.addEntry(navigatorPanel);
	};

	bind();
};
