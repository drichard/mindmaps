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
	this.root = root || new TreeNode();
	this.addNode(this.root);
};

MindMap.fromJSON = function(json) {
	return MindMap.fromObject(JSON.parse(json));
};

MindMap.fromObject = function(obj) {
	var root = TreeNode.fromObject(obj.root);
	var mm = new MindMap(root);

	// register all nodes in the map
	root.forEachDescendant(function(descendant) {
		mm.addNode(descendant);
	});

	return mm;
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

MindMap.prototype.serialize = function() {
	return JSON.stringify(this);
};

MindMap.prototype.createNode = function() {
	var node = new TreeNode();
	this.addNode(node);
	return node;
};

MindMap.prototype.addNode = function(node) {
	this.nodes.add(node);
	
	// add all children
	var self = this;
	node.forEachDescendant(function(descendant) {
		self.nodes.add(descendant);
	});
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

MindMap.prototype.getRoot = function() {
	return this.root;
};