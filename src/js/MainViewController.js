/**
 * The canvas container is the area in between the toolbar and the statusbar.
 * Inside the mind map will be drawn and the floating panels are contained
 * within this area.
 * 
 * @constructor
 */
mindmaps.CanvasContainer = function() {
	var self = this;
	var $content = $("#canvas-container");

	/**
	 * @returns {jQuery}
	 */
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
		// recalculate size when window is resized.
		$(window).resize(function() {
			self.setSize();
		});

		this.setSize();
	};

};
EventEmitter.mixin(mindmaps.CanvasContainer);

/**
 * Events fired by the container.
 * 
 * @namespace
 */
mindmaps.CanvasContainer.Event = {
	/**
	 * Fired when the container has been resized.
	 * 
	 * @event
	 * @param {mindmaps.Point} point the new size
	 */
	RESIZED : "ResizedEvent"
};

/**
 * Creates a new MainViewController. The controller is responsible for creating
 * all main ui elements.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.InspectorView} view
 */
mindmaps.MainViewController = function(eventBus, mindmapModel, commandRegistry) {
	var zoomController = new mindmaps.ZoomController(eventBus, commandRegistry);

	this.go = function() {
		var canvasContainer = new mindmaps.CanvasContainer();
		canvasContainer.init();

		// init all presenters

		// toolbar
		var toolbar = new mindmaps.ToolBarView();
		var toolbarPresenter = new mindmaps.ToolBarPresenter(eventBus,
				commandRegistry, toolbar, mindmapModel);
		toolbarPresenter.go();

		// canvas
		var canvas = new mindmaps.DefaultCanvasView();
		var canvasPresenter = new mindmaps.CanvasPresenter(eventBus,
				commandRegistry, mindmapModel, canvas, zoomController);
		canvasPresenter.go();

		// statusbar
		var statusbar = new mindmaps.StatusBarView();
		var statusbarPresenter = new mindmaps.StatusBarPresenter(eventBus,
				statusbar);
		statusbarPresenter.go();

		// floating Panels
		var fpf = new mindmaps.FloatPanelFactory(canvasContainer);

		// inspector
		var inspectorView = new mindmaps.InspectorView();
		var inspectorPresenter = new mindmaps.InspectorPresenter(eventBus,
				mindmapModel, inspectorView);
		inspectorPresenter.go();

		var inspectorPanel = fpf
				.create("Inspector", inspectorView.getContent());
		inspectorPanel.show();
		statusbarPresenter.addEntry(inspectorPanel);

		// navigator
		var naviView = new mindmaps.NavigatorView();
		var naviPresenter = new mindmaps.NavigatorPresenter(eventBus, naviView,
				canvasContainer, zoomController);
		naviPresenter.go();

		var navigatorPanel = fpf.create("Navigator", naviView.getContent());
		navigatorPanel.show();
		statusbarPresenter.addEntry(navigatorPanel);
	};
};
