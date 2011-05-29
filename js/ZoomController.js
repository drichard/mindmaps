/**
 * Object that controls the zoom.
 * 
 * @param eventBus
 * @returns {ZoomController}
 */
mindmaps.ZoomController = function(eventBus) {
	var self = this;

	this.ZOOM_STEP = 0.25;
	this.MAX_ZOOM = 3;
	this.MIN_ZOOM = 0.2;
	this.DEFAULT_ZOOM = 1;

	this.zoomFactor = this.DEFAULT_ZOOM;

	this.zoomIn = function() {
		this.zoomFactor += this.ZOOM_STEP;
		if (this.zoomFactor > this.MAX_ZOOM) {
			this.zoomFactor -= this.ZOOM_STEP;
		} else {
			eventBus.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
		}

		return this.zoomFactor;
	};

	this.zoomOut = function() {
		this.zoomFactor -= this.ZOOM_STEP;
		if (this.zoomFactor < this.MIN_ZOOM) {
			this.zoomFactor += this.ZOOM_STEP;
		} else {
			eventBus.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
		}

		return this.zoomFactor;
	};

	// listen to outside event
	eventBus.subscribe(mindmaps.Event.ZOOM_IN, function() {
		self.zoomIn();
	});

	eventBus.subscribe(mindmaps.Event.ZOOM_OUT, function() {
		self.zoomOut();
	});
};