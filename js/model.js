var Node = function() {
	this.id = Util.getId();
	/** avoid circular reference to parent for serialization */
	this.parentId = null;
	this.children = new NodeMap();
	this.text = {
		caption : "New Node",
		font : {
			weight : "normal",
			size : "inherit",
			color : "black"
		}
	};
	this.offset = Point.ZERO;
	this.collapseChildren = false;
	this.edgeColor = "blue";
};

Node.prototype.addChild = function(node) {
	node.parentId = this.id;
	this.children.add(node);
};

Node.prototype.removeChild = function(node) {
	this.children.remove(node);
};

Node.prototype.isRoot = function() {
	return this.parentId == null;
};

Node.prototype.isLeaf = function() {
	return this.children.size() == 0;
};

/**
 * Gets the children of the node. Traverses the whole sub tree if recursive is
 * true.
 * 
 * @param recursive
 * @returns {Array}
 */
Node.prototype.getChildren = function(recursive) {
	var nodes = [];

	this.children.each(function(node) {
		if (recursive) {
			node.getChildren(true);
		}
		nodes.push(node);
	});

	return nodes;
};

var MindMap = function() {
	this.nodes = new NodeMap();
	this.root = new Node();

	this.nodes.add(this.root);
};

MindMap.prototype.createNode = function() {
	var node = new Node();
	this.nodes.add(node);
	return node;
};

MindMap.prototype.removeNode = function(node) {
	// detach node from parent
	var parent = this.nodes.get(node.parentId);
	parent.removeChild(node);

	// clear nodes table: remove node and its children
	var children = node.getChildren(true);

	_.each(children, _.bind(function(node) {
		this.nodes.remove(node);
	}, this));

	this.nodes.remove(node);
};

var Document = function() {
	this.id = Util.createUUID();
	this.mindmap = new MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
};