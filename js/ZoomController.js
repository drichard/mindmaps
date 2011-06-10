/**
 * Object that controls the zoom.
 * 
 * @param eventBus
 * @returns {ZoomController}
 */
mindmaps.ZoomController = function(eventBus, commandRegistry) {
	var self = this;

	this.ZOOM_STEP = 0.25;
	this.MAX_ZOOM = 3;
	this.MIN_ZOOM = 0.25;
	this.DEFAULT_ZOOM = 1;

	this.zoomFactor = this.DEFAULT_ZOOM;
	
	this.zoomTo = function(factor) {
		if (factor <= this.MAX_ZOOM && factor >= this.MIN_ZOOM) {
			this.zoomFactor = factor;
			eventBus.publish(mindmaps.Event.ZOOM_CHANGED, factor);
		}
	};

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
};