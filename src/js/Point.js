/**
 * Point class.
 * 
 * @constructor
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 */
mindmaps.Point = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

/**
 * Returns a new point object from generic obj.
 * 
 * @static
 * @param obj
 * @returns {mindmaps.Point}
 */
mindmaps.Point.fromObject = function(obj) {
  return new mindmaps.Point(obj.x, obj.y);
};

/**
 * Clones a the point.
 * 
 * @returns {mindmaps.Point}
 */
mindmaps.Point.prototype.clone = function() {
  return new mindmaps.Point(this.x, this.y);
};

/**
 * Adds a point to the point.
 * @param {mindmaps.Point} point
 */
mindmaps.Point.prototype.add = function(point) {
  this.x += point.x;
  this.y += point.y;
};

/**
 * Returns a String representation.
 * @returns {String}
 */
mindmaps.Point.prototype.toString = function() {
  return "{x: " + this.x + " y: " + this.y + "}";
};
