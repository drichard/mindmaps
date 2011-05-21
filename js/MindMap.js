/**
 * 
 * Creates a new mind map.
 * 
 * @param root -
 *            optional root node
 */
mindmaps.MindMap = function(root) {
	/**
	 * nodes is only used for quick lookup of a node by id. Each node must be
	 * registered in this map via createNode() or addNode(node).
	 */
	this.nodes = new mindmaps.NodeMap();
	this.root = root || new mindmaps.Node();
	this.root.text.font.size = 20;
	this.root.text.font.weight = "bold";
	this.addNode(this.root);
};

mindmaps.MindMap.fromJSON = function(json) {
	return mindmaps.MindMap.fromObject(JSON.parse(json));
};

mindmaps.MindMap.fromObject = function(obj) {
	var root = mindmaps.Node.fromObject(obj.root);
	var mm = new mindmaps.MindMap(root);

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
mindmaps.MindMap.prototype.toJSON = function() {
	var obj = {
		root : this.root
	};
	return obj;
};

mindmaps.MindMap.prototype.serialize = function() {
	return JSON.stringify(this);
};

mindmaps.MindMap.prototype.createNode = function() {
	var node = new mindmaps.Node();
	this.addNode(node);
	return node;
};

mindmaps.MindMap.prototype.addNode = function(node) {
	this.nodes.add(node);

	// add all children
	var self = this;
	node.forEachDescendant(function(descendant) {
		self.nodes.add(descendant);
	});
};

mindmaps.MindMap.prototype.removeNode = function(node) {
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

mindmaps.MindMap.prototype.getRoot = function() {
	return this.root;
};