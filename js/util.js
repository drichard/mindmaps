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


/**
 * Point class.
 */
var Point = function(x, y) {
	this.x = x;
	this.y = y;
};
Point.ZERO = new Point(0, 0);


/**
 * Set implementation for nodes.
 */
var NodeSet = function() {
	this.nodes = {};
	this.count = 0;
};

NodeSet.prototype.add = function(node) {
	if (!this.nodes.hasOwnProperty(node.id)) {
		this.nodes[node.id] = node;
		this.count++;
		return true;
	}
	return false;
};

NodeSet.prototype.remove = function(node) {
	if (this.nodes.hasOwnProperty(node.id)) {
		delete this.nodes[node.id];
		this.count--;
		return true;
	}
	return false;
};

NodeSet.prototype.size = function() {
	return this.count;
};

NodeSet.prototype.values = function() {
	var values = [];
	for (var node in this.nodes) {
		values.push(this.nodes[node]);
	}
	return values;
};