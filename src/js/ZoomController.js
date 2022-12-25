mindmaps.ZoomController = function(e, t) {
    var n = this;
    this.ZOOM_STEP = .25;
    this.MAX_ZOOM = 3;
    this.MIN_ZOOM = .25;
    this.DEFAULT_ZOOM = 1;
    this.zoomFactor = this.DEFAULT_ZOOM;
    this.zoomTo = function(t) {
        if (t <= this.MAX_ZOOM && t >= this.MIN_ZOOM) {
            this.zoomFactor = t;
            e.publish(mindmaps.Event.ZOOM_CHANGED, t)
        }
    };
    this.zoomIn = function(t) {
        t = t || this.ZOOM_STEP;
        this.zoomFactor += t;
        if (this.zoomFactor > this.MAX_ZOOM) {
            this.zoomFactor -= t
        } else {
            e.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor)
        }
        return this.zoomFactor
    };
    this.zoomOut = function(t) {
        t = t || this.ZOOM_STEP;
        this.zoomFactor -= t;
        if (this.zoomFactor < this.MIN_ZOOM) {
            this.zoomFactor += t
        } else {
            e.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor)
        }
        return this.zoomFactor
    };
    this.zoomByScale = function(t) {
        t = t || 1;
        this.zoomFactor *= t;
        if (this.zoomFactor < this.MIN_ZOOM) {
            this.zoomFactor = this.MIN_ZOOM
        } else if (this.zoomFactor > this.MAX_ZOOM) {
            this.zoomFactor = this.MAX_ZOOM
        }
        e.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
        return this.zoomFactor
    };
    this.zoomToOne = function() {
        this.zoomFactor = 1;
        e.publish(mindmaps.Event.ZOOM_CHANGED, this.zoomFactor);
        return this.zoomFactor
    };
    e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(e) {
        n.zoomTo(n.DEFAULT_ZOOM)
    })
}