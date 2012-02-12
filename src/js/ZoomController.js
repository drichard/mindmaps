/**
 * Creates a new ZoomController. Object that controls the zoom setting.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 */
mindmaps.ZoomController = function(eventBus, commandRegistry) {
  var self = this;

  /**
   * @constant
   */
  this.ZOOM_STEP = 0.25;

  /**
   * @constant
   */
  this.MAX_ZOOM = 3;

  /**
   * @constant
   */
  this.MIN_ZOOM = 0.25;

  /**
   * @constant
   */
  this.DEFAULT_ZOOM = 1;

  /**
   * @private
   */
  this.zoomFactor = this.DEFAULT_ZOOM;

  /**
   * Sets the zoom factor if param is within MIN_ZOOM and MAX_ZOOM bounds.
   * 
   * @param {Number} factor
   */
  this.zoomTo = function(factor) {
    if (factor <= this.MAX_ZOOM && factor >= this.MIN_ZOOM) {
      this.zoomFactor = factor;
      eventBus.publish(mindmaps.Event.ZOOM_CHANGED, factor);
    }
  };

  /**
   * Zooms in by ZOOM_STEP.
   * 
   * @returns {Number} the new zoomFactor.
   */
  this.zoomIn = function() {
    this.zoomFactor += this.ZOOM_STEP;
    if (this.zoomFactor > this.MAX_ZOOM) {
      this.zoomFactor -= this.ZOOM_STEP;
    } else {
      eventBus.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
    }

    return this.zoomFactor;
  };

  /**
   * Zooms out by ZOOM_STEP,
   * 
   * @returns {Number} the new zoomFactor.
   */
  this.zoomOut = function() {
    this.zoomFactor -= this.ZOOM_STEP;
    if (this.zoomFactor < this.MIN_ZOOM) {
      this.zoomFactor += this.ZOOM_STEP;
    } else {
      eventBus.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
    }

    return this.zoomFactor;
  };

  /**
   * Reset zoom factor when document was closed.
   * 
   * @ignore
   */
  eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
    self.zoomTo(self.DEFAULT_ZOOM);
  });
};
