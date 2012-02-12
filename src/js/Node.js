/**
 * Creates a new node.
 * 
 * @constructor
 */
mindmaps.Node = function() {
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
  this.offset = new mindmaps.Point();
  this.foldChildren = false;
  this.branchColor = "#000000";
};

/**
 * Creates a deep copy of this node, where all nodes have a new IDs.
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
  clone.foldChildren = this.foldChildren;
  clone.branchColor = this.branchColor;

  this.forEachChild(function(child) {
    var childClone = child.clone();
    clone.addChild(childClone);
  });

  return clone;
};

/**
 * Creates a new node object from JSON String.
 * 
 * @param {String} json
 * @returns {mindmaps.Node}
 */
mindmaps.Node.fromJSON = function(json) {
  return mindmaps.Node.fromObject(JSON.parse(json));
};

/**
 * Creates a new node object from a generic object.
 * 
 * @param {Object} obj
 * @returns {mindmaps.Node}
 */
mindmaps.Node.fromObject = function(obj) {
  var node = new mindmaps.Node();
  node.id = obj.id;
  node.text = obj.text;
  node.offset = mindmaps.Point.fromObject(obj.offset);
  node.foldChildren = obj.foldChildren;
  node.branchColor = obj.branchColor;

  // extract all children from array of objects
  obj.children.forEach(function(child) {
    var childNode = mindmaps.Node.fromObject(child);
    node.addChild(childNode);
  });

  return node;
};

/**
 * Returns a presentation of this node and its children ready for serialization.
 * Called by JSON.stringify().
 * 
 * @private
 */
mindmaps.Node.prototype.toJSON = function() {
  // TODO see if we cant improve this
  // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
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
    foldChildren : this.foldChildren,
    branchColor : this.branchColor,
    children : children
  };

  return obj;
};

/**
 * Creates a JSON representation of the node.
 * 
 * @returns {String}
 */
mindmaps.Node.prototype.serialize = function() {
  return JSON.stringify(this);
};

/**
 * Adds a child to the node.
 * 
 * @param {mindmaps.Node} node
 */
mindmaps.Node.prototype.addChild = function(node) {
  node.parent = this;
  this.children.add(node);
};

/**
 * Removes a direct child.
 * 
 * @param {mindmaps.Node} node
 */
mindmaps.Node.prototype.removeChild = function(node) {
  node.parent = null;
  this.children.remove(node);
};

/**
 * Returns whether this node is a root.
 * 
 * @returns {Boolean}
 */
mindmaps.Node.prototype.isRoot = function() {
  return this.parent === null;
};

/**
 * Returns whether this node is a leaf.
 * 
 * @returns {Boolean}
 */
mindmaps.Node.prototype.isLeaf = function() {
  return this.children.size() === 0;
};

/**
 * Returns the parent node.
 * 
 * @returns {mindmaps.Node}
 */
mindmaps.Node.prototype.getParent = function() {
  return this.parent;
};

/**
 * Returns the root if this node is part of a tree structure, otherwise it
 * returns itself.
 * 
 * @returns {mindmaps.Node} The root of the tree structure.
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
 * 
 * @returns {mindmaps.Point}
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
      childNodes.forEach(function(child) {
        nodes.push(child);
      });
    }
    nodes.push(node);
  });

  return nodes;
};

/**
 * Iterator. Traverses all child nodes.
 * 
 * @param {Function} func
 */
mindmaps.Node.prototype.forEachChild = function(func) {
  this.children.each(func);
};

/**
 * Iterator. Traverses all child nodes recursively.
 * 
 * @param {Function} func
 */
mindmaps.Node.prototype.forEachDescendant = function(func) {
  this.children.each(function(node) {
    func(node);
    node.forEachDescendant(func);
  });
};

/**
 * Sets the caption for the node
 * 
 * @param {String} caption
 */
mindmaps.Node.prototype.setCaption = function(caption) {
  this.text.caption = caption;
};

/**
 * Gets the caption for the node.
 * 
 * @returns {String}
 */
mindmaps.Node.prototype.getCaption = function() {
  return this.text.caption;
};

/**
 * Tests (depth-first) whether the other node is a descendant of this node.
 * 
 * @param {mindmaps.Node} other
 * @returns {Boolean} true if descendant, false otherwise.
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
