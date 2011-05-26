/**
 * Constructor for a tree node.
 */
mindmaps.Node = function() {
	// var defaults = {
	// id : Util.getId(),
	// parent : null,
	// children : new NodeMap(),
	// text : {
	// caption : "Node " + id,
	// font : {
	// weight : "normal",
	// size : "inherit",
	// color : "black"
	// }
	// },
	// offset : Point.ZERO,
	// collapeChildren : false,
	// branchColor : "black"
	// };
	//	
	// _.extend(this, defaults, options);

	this.id = mindmaps.Util.getId();
	this.parent = null;
	this.children = new mindmaps.NodeMap();
	this.text = {
		caption : "New Idea",
		font : {
			style : "normal",
			weight : "normal",
			decoration : "none",
			/** unit: pixel */
			size : 15,
			color : "#000000"
		}
	};
	this.offset = mindmaps.Point.ZERO;
	this.collapseChildren = false;
	this.branchColor = "#000000";
};

// TODO test case
/**
 * Create a deep copy of this node, where all nodes have a new IDs.
 * 
 * @returns {mindmaps.Node} the cloned node
 */
mindmaps.Node.prototype.clone = function() {
	var clone = new mindmaps.Node();
	var text = {
		caption : this.text.caption
	};
	var font = {
		weight : this.text.font.weight,
		style : this.text.font.style,
		decoration : this.text.font.decoration,
		size : this.text.font.size,
		color : this.text.font.color
	};
	text.font = font;
	clone.text = text;
	clone.offset = this.offset.clone();
	clone.collapseChildren = this.collapseChildren;
	clone.branchColor = this.branchColor;

	this.forEachChild(function(child) {
		var childClone = child.clone();
		clone.addChild(childClone);
	});

	return clone;
};

/**
 * Creates a node object by parsing JSON text.
 */
mindmaps.Node.fromJSON = function(json) {
	return mindmaps.Node.fromObject(JSON.parse(json));
};

/**
 * Creates a node from an object as a result of a JSON parser.
 */
mindmaps.Node.fromObject = function(obj) {
	var node = new mindmaps.Node();
	node.id = obj.id;
	node.text = obj.text;
	node.offset = mindmaps.Point.fromObject(obj.offset);
	node.collapseChildren = obj.collapseChildren;
	node.branchColor = obj.branchColor;

	// extract all children from array of objects
	_.each(obj.children, function(child) {
		var childNode = mindmaps.Node.fromObject(child);
		node.addChild(childNode);
	});

	return node;
};

/**
 * Returns a presentation of this node and its children ready for serialization.
 * Called by JSON.stringify().
 */
mindmaps.Node.prototype.toJSON = function() {
	// TODO see if we cant improve this http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
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
		branchColor : this.branchColor,
		children : children
	};

	return obj;
};

mindmaps.Node.prototype.serialize = function() {
	return JSON.stringify(this);
};

mindmaps.Node.prototype.addChild = function(node) {
	node.parent = this;
	this.children.add(node);
};

mindmaps.Node.prototype.removeChild = function(node) {
	node.parent = null;
	this.children.remove(node);
};

mindmaps.Node.prototype.isRoot = function() {
	return this.parent === null;
};

mindmaps.Node.prototype.isLeaf = function() {
	return this.children.size() === 0;
};

mindmaps.Node.prototype.getParent = function() {
	return this.parent;
};

/**
 * 
 * @returns The root of the tree structure.
 */
mindmaps.Node.prototype.getRoot = function() {
	var root = this;
	while (root.parent) {
		root = root.parent;
	}

	return root;
};

/**
 * Gets the position of the node relative to the root.
 */
mindmaps.Node.prototype.getPosition = function() {
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
 * 
 * @returns {Number}
 */
mindmaps.Node.prototype.getDepth = function() {
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
mindmaps.Node.prototype.getChildren = function(recursive) {
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
mindmaps.Node.prototype.forEachChild = function(func) {
	this.children.each(func);
};

/**
 * Traverses all child nodes recursively.
 */
mindmaps.Node.prototype.forEachDescendant = function(func) {
	this.children.each(function(node) {
		func(node);
		node.forEachDescendant(func);
	});
};

mindmaps.Node.prototype.setCaption = function(caption) {
	this.text.caption = caption;
};

mindmaps.Node.prototype.getCaption = function() {
	return this.text.caption;
};

/**
 * Tests (depth-first) whether the other node is a descendant of this node.
 * 
 * @param other
 * @returns true if descendant
 */
mindmaps.Node.prototype.isDescendant = function(other) {
	function test(node) {
		var children = node.children.values();
		for ( var i = 0, len = children.length; i < len; i++) {
			var child = children[i];
			if (test(child)) {
				return true;
			}

			if (child === other) {
				return true;
			}
		}
		return false;
	}

	return test(this);
};