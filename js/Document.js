var mindmaps = mindmaps || {};

mindmaps.Document = function() {
	this.id = mindmaps.Util.createUUID();
	this.title = null;
	this.mindmap = new mindmaps.MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
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

	return doc;
};

/**
 * Called by JSON.stringify().
 */
mindmaps.Document.prototype.toJSON = function() {
	var obj = {
		id : this.id,
		title: this.title,
		mindmap : this.mindmap,
		dates : {
			// store dates in milliseconds since epoch
			created : this.dates.created.getTime(),
			modified : this.dates.modified.getTime()
		}
	};

	return obj;
};

mindmaps.Document.prototype.serialize = function() {
	return JSON.stringify(this);
};

mindmaps.Document.prototype.getTitle = function() {
	return this.title;
};

mindmaps.Document.prototype.setTitle = function(title) {
	this.title = title;
};