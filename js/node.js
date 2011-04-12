/**
 * Constructor for a tree node.
 */
var Node = function() {
	this.id = Util.getId();
	this.parent = null;
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


/**
 * Creates a node object by parsing JSON text.
 */
Node.fromJSON = function(json) {
	return Node.fromObject(JSON.parse(json));
};

/**
 * Creates a node from an object as a result of a JSON parser.
 */
Node.fromObject = function(obj) {
	var node = new Node();
	node.id = obj.id;
	node.text = obj.text;
	node.offset = Point.fromObject(obj.offset);
	node.collapseChildren = obj.collapseChildren;
	node.edgeColor = obj.edgeColor;

	// extract all children from array of objects
	_.each(obj.children, function(child) {
		var childNode = Node.fromObject(child);
		node.addChild(childNode);
	});

	return node;
};

/**
 * Returns a presentation of this node and its children ready for serialization.
 * Called by JSON.stringify().
 */
Node.prototype.toJSON = function() {
	// copy all children into array
	var self = this;
	var children = (function() {
		var result = [];
		self.forEachChild(function(child) {
			result.push(child.toJSON());
		});
		return result;
	})();

	var obj = {
		id : this.id,
		// store parent as id since we have to avoid circular references
		parentId : this.parent ? this.parent.id : null,
		text : this.text,
		offset : this.offset,
		collapseChildren : this.collapseChildren,
		edgeColor : this.edgeColor,
		children : children
	};

	return obj;
};

Node.prototype.serialize = function() {
	return JSON.stringify(this);
};

Node.prototype.addChild = function(node) {
	node.parent = this;
	this.children.add(node);
};

Node.prototype.removeChild = function(node) {
	node.parent = null;
	this.children.remove(node);
};

Node.prototype.isRoot = function() {
	return this.parent === null;
};

Node.prototype.isLeaf = function() {
	return this.children.size() === 0;
};

/**
 * 
 * @returns The root of the tree structure.
 */
Node.prototype.getRoot = function() {
	var root = this;
	while (root.parent) {
		root = root.parent;
	}

	return root;
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