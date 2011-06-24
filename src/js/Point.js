/**
 * Point class.
 */
mindmaps.Point = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

mindmaps.Point.fromObject = function(obj) {
	return new mindmaps.Point(obj.x, obj.y);
};

mindmaps.Point.prototype.clone = function() {
	return new mindmaps.Point(this.x, this.y);
};

mindmaps.Point.prototype.add = function(point) {
	this.x += point.x;
	this.y += point.y;
};

mindmaps.Point.prototype.toString = function() {
	return "{x: " + this.x + " y: " + this.y + "}";
};