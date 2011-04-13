var Document = function() {
	this.id = Util.createUUID();
	this.title = "New Document";
	this.mindmap = new MindMap();
	this.dates = {
		created : new Date(),
		modified : new Date()
	};
};

Document.fromJSON = function(json) {
	return Document.fromObject(JSON.parse(json));
};

Document.fromObject = function(obj) {
	var doc = new Document();
	doc.id = obj.id;
	doc.title = obj.title;
	doc.mindmap = MindMap.fromObject(obj.mindmap);
	doc.dates = {
		created : new Date(obj.dates.created),
		modified : new Date(obj.dates.modified)
	};

	return doc;
};

/**
 * Called by JSON.stringify().
 */
Document.prototype.toJSON = function() {
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

Document.prototype.serialize = function() {
	return JSON.stringify(this);
};
