/**
 * 
 * Creates a new mind map.
 * 
 * @constructor
 * @param {mindmaps.Node} [root]
 */
mindmaps.MindMap = function(root) {
  /**
   * nodes is only used for quick lookup of a node by id. Each node must be
   * registered in this map via createNode() or addNode(node).
   */
  this.nodes = new mindmaps.NodeMap();

  if (root) {
    this.root = root;
  } else {
    this.root = new mindmaps.Node();
    this.root.text.font.size = 20;
    this.root.text.font.weight = "bold";
    this.root.text.caption = "Central Idea";
  }

  this.addNode(this.root);
};

/**
 * Creates a new mind map object from JSON String.
 * 
 * @static
 * @param {String} json
 * @returns {mindmaps.MindMap}
 */
mindmaps.MindMap.fromJSON = function(json) {
  return mindmaps.MindMap.fromObject(JSON.parse(json));
};

/**
 * Creates a new mind map object from generic object.
 * 
 * @static
 * @param {Object} obj
 * @returns {mindmaps.MindMap}
 */
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
 * @private
 * 
 */
mindmaps.MindMap.prototype.toJSON = function() {
  var obj = {
    root : this.root
  };
  return obj;
};

/**
 * Creates a JSON representation of the mind map.
 * 
 * @returns {String}
 */
mindmaps.MindMap.prototype.serialize = function() {
  return JSON.stringify(this);
};

/**
 * Create a node and add to nodes map.
 * 
 * @returns {mindmaps.Node}
 */
mindmaps.MindMap.prototype.createNode = function() {
  var node = new mindmaps.Node();
  this.addNode(node);
  return node;
};

/**
 * Adds an existing node and all its children to the nodes map.
 * 
 * @param {mindmaps.Node} node
 */
mindmaps.MindMap.prototype.addNode = function(node) {
  this.nodes.add(node);

  // add all children
  var self = this;
  node.forEachDescendant(function(descendant) {
    self.nodes.add(descendant);
  });
};

/**
 * Removes a node from the mind map. Severs tie to the parent.
 * 
 * @param {mindmaps.Node} node
 */
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

/**
 * Get the root of the mind map.
 * 
 * @returns {mindmaps.Node}
 */
mindmaps.MindMap.prototype.getRoot = function() {
  return this.root;
};
