var Node = function() {
	this.id = Util.createUUID();
	/** avoid circular reference to parent for serialization */
	this.parentId = null;
	this.children = new NodeSet();
	this.text = {
		caption : "New Node",
		font : {
			weight: "normal",
			size: "inherit",
			color: "black"
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
	return parent == null;
};

Node.prototype.isLeaf = function() {
	return this.children.size() == 0; 
};

var MindMap = function() {
	this.nodes = new NodeSet();
	this.root = new Node();
	
	this.nodes.add(this.root);
};

MindMap.prototype.createNode = function() {
	var node = new Node();
	this.nodes.add(node);
	return node;
};

MindMap.prototype.removeNode = function(node) {
	function removeNodeFromNodeSet(node) {
		if (node == null) {
			console.log("null");
		}
		var childNodes = node.children.values();
		for (var child in childNodes) {
			removeNodeFromNodeSet(child);
		}
		this.nodes.remove(node);
	}
	
	// clear master table
	removeNodeFromNodeSet(node);
	
	// detach from parent
	var parent = this.nodes[node.parentId];
	parent.removeChild(node);
};

var Document = function() {
	this.id = Util.createUUID();
	this.mindmap = new MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
};