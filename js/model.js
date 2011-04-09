var Node = function() {
	this.id = Util.getId();
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
	node.parentId = null;
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
	console.log("get children");
	var nodes = [];

	this.children.each(function(node) {
		if (recursive) {
			var childNodes = node.getChildren(true);
			_.each(childNodes, function(child) {
				nodes.push(child);
			});
		}
		nodes.push(node);
	});

	return nodes;
};

/**
 * Traverses all child nodes.
 */
Node.prototype.forEachChild = function(func) {
	this.children.each(func);
};

/**
 * Traverses all child nodes recursively.
 */
Node.prototype.forEachDescendant = function(func) {
	this.children.each(function(node) {
		func(node);
		node.forEachDescendant(func);
	});
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
	var self = this;
	node.forEachDescendant(function(node) {
		self.nodes.remove(node);
	});

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