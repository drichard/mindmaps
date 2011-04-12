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
 * Returns a presentation of this node and its children ready for serialization.
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
		parentId : this.parent ? this.parent.id : null,
		text : this.text,
		offset : this.offset,
		collapseChildren : this.collapseChildren,
		edgeColor : this.edgeColor,
		children : children
	};

	return obj;
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

Node.prototype.addChild = function(node) {
	node.parent = this;
	this.children.add(node);
};

Node.prototype.removeChild = function(node) {
	node.parent = null;
	this.children.remove(node);
};

Node.prototype.isRoot = function() {
	return this.parent == null;
};

Node.prototype.isLeaf = function() {
	return this.children.size() == 0;
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

/**
 * Creates a new mind map.
 * 
 * @param root -
 *            optional root node
 */
var MindMap = function(root) {
	/**
	 * nodes is only used for quick lookup of a node by id. Each node must be
	 * registered in this map via createNode() or addNode(node).
	 */
	this.nodes = new NodeMap();
	this.root = root || new Node();
	this.addNode(this.root);
};

MindMap.fromJSON = function(json) {
	return MindMap.fromObject(JSON.parse(json));
};

MindMap.fromObject = function(obj) {
	var root = Node.fromObject(obj.root);
	var mm = new MindMap(root);

	// register all nodes in the map
	root.forEachDescendant(function(descendant) {
		mm.addNode(descendant);
	});
	
	return mm;
};

MindMap.prototype.createNode = function() {
	var node = new Node();
	this.addNode(node);
	return node;
};

MindMap.prototype.addNode = function(node) {
	this.nodes.add(node);
};

MindMap.prototype.removeNode = function(node) {
	// detach node from parent
	var parent = node.parent;
	parent.removeChild(node);

	// clear nodes table: remove node and its children
	var self = this;
	node.forEachDescendant(function(descendant) {
		self.nodes.remove(descendant);
	});

	this.nodes.remove(node);
};

/**
 * Called by JSON.stringify().
 * 
 * Only return root.
 */
MindMap.prototype.toJSON = function() {
	var obj = {
		root : this.root
	};

	return obj;
};

var Document = function() {
	this.id = Util.createUUID();
	this.mindmap = new MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
};