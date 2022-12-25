mindmaps.Point = function(e, t) {
    this.x = e || 0;
    this.y = t || 0
};
mindmaps.Point.fromObject = function(e) {
    return new mindmaps.Point(e.x, e.y)
};
mindmaps.Point.prototype.clone = function() {
    return new mindmaps.Point(this.x, this.y)
};
mindmaps.Point.prototype.add = function(e) {
    this.x += e.x;
    this.y += e.y
};
mindmaps.Point.prototype.toString = function() {
    return "{x: " + this.x + " y: " + this.y + "}"
}