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
		parentId : this.parentId,
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
	node.parentId = obj.parentId;
	node.text = obj.text;
	node.offset = obj.offset;
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
	node.parentId = this.id;
	this.children.add(node);
};

Node.prototype.removeChild = function(node) {
	node.parentId = null;
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
	this.root = this.createNode();
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
	return this.root;
};

function testSer() {
	var mm = getSimpleMap();
	var str = JSON.stringify(mm);
	console.log(str);
	var parsedMap = JSON.parse(str, function(key, value) {
		console.log(key, value);
		return value;
	});

	return parsedMap;
}

MindMap.load = function(mapAsJson) {
	var mm = new MindMap();
	var parsedMap = JSON.parse(mapAsJson, function(key, value) {
		if (value instanceof Object) {
			console.log(key, value, value[key]);
		}
	});

	function makeNodes(obj) {
		var node = new Node();

		_.each(obj.children, function(child) {

		});
	}

	return mm;
};

var Document = function() {
	this.id = Util.createUUID();
	this.mindmap = new MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
};