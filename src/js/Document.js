/**
 * Creates a new Document.
 * 
 * @constructor
 */
mindmaps.Document = function() {
  this.id = mindmaps.Util.createUUID();
  this.title = "New Document";
  this.mindmap = new mindmaps.MindMap();
  this.dates = {
    created : new Date(),
    modified : null
  };

  this.dimensions = new mindmaps.Point(4000, 2000);
  this.autosave = false;
};

/**
 * Creates a new document object from a JSON string.
 * 
 * @static
 * @param {String} json
 * @returns {mindmaps.Document}
 */
mindmaps.Document.fromJSON = function(json) {
  return mindmaps.Document.fromObject(JSON.parse(json))
};

/**
 * Creates a new document object from a generic object.
 * 
 * @static
 * @param {Object} json
 * @returns {mindmaps.Document}
 */
mindmaps.Document.fromObject = function(obj) {
  var doc = new mindmaps.Document();
  doc.id = obj.id;
  doc.title = obj.title;
  doc.mindmap = mindmaps.MindMap.fromObject(obj.mindmap);
  doc.dates = {
    created : new Date(obj.dates.created),
    modified : obj.dates.modified ? new Date(obj.dates.modified) : null
  };

  doc.dimensions = mindmaps.Point.fromObject(obj.dimensions);
  doc.autosave = obj.autosave;

  return doc;
};

/**
 * Called by JSON.stringify().
 * 
 * @private
 */
mindmaps.Document.prototype.toJSON = function() {
  // store dates in milliseconds since epoch
  var dates = {
    created : this.dates.created.getTime()
  };

  if (this.dates.modified) {
    dates.modified = this.dates.modified.getTime();
  }

  return {
    id : this.id,
    title : this.title,
    mindmap : this.mindmap,
    dates : dates,
    dimensions : this.dimensions,
    autosave: this.autosave
  };
};

/**
 * Returns a JSON representation of the object.
 * 
 * @returns {String} the json.
 */
mindmaps.Document.prototype.serialize = function() {
  return JSON.stringify(this);
};

/**
 * Updates modified date and title for saving.
 */
mindmaps.Document.prototype.prepareSave = function() {
  this.dates.modified = new Date();
  this.title = this.mindmap.getRoot().getCaption();
  return this;
};

/**
 * Sort function for Array.sort().
 * 
 * @static
 * @param {mindmaps.Document} doc1
 * @param {mindmaps.Document} doc2
 */
mindmaps.Document.sortByModifiedDateDescending = function(doc1, doc2) {
  if (doc1.dates.modified > doc2.dates.modified) {
    return -1;
  }
  if (doc1.dates.modified < doc2.dates.modified) {
    return 1;
  }
  return 0;
};

/**
 * Tells whether this document considerd as "new", that is has not been saved
 * yet.
 * 
 * @returns {Boolean}
 */
mindmaps.Document.prototype.isNew = function() {
  return this.dates.modified === null;
};

/**
 * Returns the created date.
 * 
 * @returns {Date}
 */
mindmaps.Document.prototype.getCreatedDate = function() {
  return this.dates.created;
};

/**
 * Gets the width of the document.
 * 
 * @returns {Number}
 */
mindmaps.Document.prototype.getWidth = function() {
  return this.dimensions.x;
};

/**
 * Gets the height of the document.
 * 
 * @returns {Number}
 */
mindmaps.Document.prototype.getHeight = function() {
  return this.dimensions.y;
};


mindmaps.Document.prototype.isAutoSave = function() {
  return this.autosave;
}


/**
 * Sets autosave setting.
 *
 * @param {Boolean}
 */
mindmaps.Document.prototype.setAutoSave = function(autosave) {
  this.autosave = autosave;
}
