/**
 * Constructor for a tree node.
 */
var TreeNode = function() {
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
	this.edgeColor = "black";
};

/**
 * Creates a node object by parsing JSON text.
 */
TreeNode.fromJSON = function(json) {
	return TreeNode.fromObject(JSON.parse(json));
};

/**
 * Creates a node from an object as a result of a JSON parser.
 */
TreeNode.fromObject = function(obj) {
	var node = new TreeNode();
	node.id = obj.id;
	node.text = obj.text;
	node.offset = Point.fromObject(obj.offset);
	node.collapseChildren = obj.collapseChildren;
	node.edgeColor = obj.edgeColor;

	// extract all children from array of objects
	_.each(obj.children, function(child) {
		var childNode = TreeNode.fromObject(child);
		node.addChild(childNode);
	});

	return node;
};

/**
 * Returns a presentation of this node and its children ready for serialization.
 * Called by JSON.stringify().
 */
TreeNode.prototype.toJSON = function() {
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

TreeNode.prototype.serialize = function() {
	return JSON.stringify(this);
};

TreeNode.prototype.addChild = function(node) {
	node.parent = this;
	this.children.add(node);
};

TreeNode.prototype.removeChild = function(node) {
	node.parent = null;
	this.children.remove(node);
};

TreeNode.prototype.isRoot = function() {
	return this.parent === null;
};

TreeNode.prototype.isLeaf = function() {
	return this.children.size() === 0;
};

TreeNode.prototype.getParent = function() {
	return this.parent;
};

/**
 * 
 * @returns The root of the tree structure.
 */
TreeNode.prototype.getRoot = function() {
	var root = this;
	while (root.parent) {
		root = root.parent;
	}

	return root;
};

/**
 * Gets the position of the node relative to the root.
 */
TreeNode.prototype.getPosition = function() {
	var pos = this.offset.clone();
	var node = this.parent;

	while (node) {
		pos.add(node.offset);
		node = node.parent;
	}
	return pos;
};

/**
 * Gets the depth of the node. Root has a depth of 0.
 * @returns {Number}
 */
TreeNode.prototype.getDepth = function() {
	var node = this.parent;
	var depth = 0;
	
	while (node) {
		depth++;
		node = node.parent;
	}
	
	return depth;
};

/**
 * Gets the children of the node. Traverses the whole sub tree if recursive is
 * true.
 * 
 * @param recursive
 * @returns {Array}
 * @deprecated
 */
TreeNode.prototype.getChildren = function(recursive) {
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
TreeNode.prototype.forEachChild = function(func) {
	this.children.each(func);
};

/**
 * Traverses all child nodes recursively.
 */
TreeNode.prototype.forEachDescendant = function(func) {
	this.children.each(function(node) {
		func(node);
		node.forEachDescendant(func);
	});
};