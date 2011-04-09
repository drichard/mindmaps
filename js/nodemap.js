/**
 * Map implementation for nodes. The key is automatically set to the node id.
 */
var NodeMap = function() {
	this.nodes = {};
	this.count = 0;
};

NodeMap.prototype.get = function(nodeId) {
	return this.nodes[nodeId];
};

NodeMap.prototype.add = function(node) {
	if (!this.nodes.hasOwnProperty(node.id)) {
		this.nodes[node.id] = node;
		this.count++;
		return true;
	}
	return false;
};

NodeMap.prototype.remove = function(node) {
	if (this.nodes.hasOwnProperty(node.id)) {
		delete this.nodes[node.id];
		this.count--;
		return true;
	}
	return false;
};

NodeMap.prototype.size = function() {
	return this.count;
};

NodeMap.prototype.values = function() {
	return _.values(this.nodes);
};

/**
 * Iterator.
 * @param callback, first argument should be the node.
 */
NodeMap.prototype.each = function(callback) {
	_.each(this.nodes, function(value) {
		callback(value);
	});
};