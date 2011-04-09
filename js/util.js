var Util = Util || {};

/**
 * Creates a UUID in compliance with RFC4122.
 * @returns a unique id as a String
 */
Util.createUUID = function() {
	// http://www.ietf.org/rfc/rfc4122.txt
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

// TODO
var id = 0;
Util.getId = function() {
	return id++;
};


/**
 * Point class.
 */
var Point = function(x, y) {
	this.x = x;
	this.y = y;
};
Point.ZERO = new Point(0, 0);