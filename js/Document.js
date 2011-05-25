mindmaps.Document = function() {
	this.id = mindmaps.Util.createUUID();
	this.title = null;
	this.mindmap = new mindmaps.MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
	this.dimensions = new mindmaps.Point(4000, 2000);
};

mindmaps.Document.fromJSON = function(json) {
	return mindmaps.Document.fromObject(JSON.parse(json));
};

mindmaps.Document.fromObject = function(obj) {
	var doc = new mindmaps.Document();
	doc.id = obj.id;
	doc.title = obj.title;
	doc.mindmap = mindmaps.MindMap.fromObject(obj.mindmap);
	doc.dates = {
		created : new Date(obj.dates.created),
		modified : new Date(obj.dates.modified)
	};

	doc.dimensions = mindmaps.Point.fromObject(obj.dimensions);

	return doc;
};

/**
 * Called by JSON.stringify().
 */
mindmaps.Document.prototype.toJSON = function() {
	return {
		id : this.id,
		title : this.title,
		mindmap : this.mindmap,
		dates : {
			// store dates in milliseconds since epoch
			created : this.dates.created.getTime(),
			modified : this.dates.modified.getTime()
		},
		dimensions : this.dimensions
	};
};

mindmaps.Document.prototype.serialize = function() {
	return JSON.stringify(this);
};

mindmaps.Document.sortByModifiedDateDescending = function(doc1, doc2) {
	if (doc1.dates.modified > doc2.dates.modified) {
		return -1;
	}
	if (doc1.dates.modified < doc2.dates.modified) {
		return 1;
	}
	return 0;
};