mindmaps.Document = function() {
    this.id = mindmaps.Util.createUUID();
    this.title = "New Document";
    this.mindmap = new mindmaps.MindMap;
    this.dates = {
        created: new Date,
        modified: null
    };
    this.dimensions = new mindmaps.Point(16e3, 8e3);
    this.autosave = false;
    this.cnodes = []
};
mindmaps.Document.fromJSON = function(e) {
    return mindmaps.Document.fromObject(JSON.parse(e))
};
mindmaps.Document.fromObject = function(e) {
    var t = new mindmaps.Document;
    t.id = e.id;
    t.title = e.title;
    t.mindmap = mindmaps.MindMap.fromObject(e.mindmap);
    t.pluginData = e.pluginData || {};
    _(t.pluginData).each(function(e, n) {
        _(e).each(function(e, r) {
            var i = t.mindmap.nodes.get(r).pluginData || {};
            i[n] = e;
            t.mindmap.nodes.get(r).pluginData = i
        })
    });
    t.dates = {
        created: new Date(e.dates.created),
        modified: e.dates.modified ? new Date(e.dates.modified) : null
    };
    t.dimensions = mindmaps.Point.fromObject(e.dimensions);
    t.autosave = e.autosave;
    t.cnodes = e.cnodes || [];
    return t
};
mindmaps.Document.prototype.toJSON = function() {
    var e = {
        created: this.dates.created.getTime()
    };
    if (this.dates.modified) {
        e.modified = this.dates.modified.getTime()
    }
    var t = {};
    var n = mindmaps.MindMap.fromJSON(this.mindmap.serialize());
    n.nodes.each(function(e) {
        _(e.pluginData).each(function(n, r) {
            t[r] = t[r] || {};
            t[r][e.id] = n
        });
        delete e["pluginData"]
    });
    return {
        id: this.id,
        title: this.title,
        mindmap: n,
        dates: e,
        dimensions: this.dimensions,
        autosave: this.autosave,
        pluginData: t,
        cnodes: this.cnodes || []
    }
};
mindmaps.Document.prototype.serialize = function(e) {
    if (e) return JSON.stringify(this, null, e);
    else return JSON.stringify(this)
};
mindmaps.Document.prototype.prepareSave = function() {
    this.dates.modified = new Date;
    this.title = this.mindmap.getRoot().getCaption();
    return this
};
mindmaps.Document.sortByModifiedDateDescending = function(e, t) {
    if (e.dates.modified > t.dates.modified) {
        return -1
    }
    if (e.dates.modified < t.dates.modified) {
        return 1
    }
    return 0
};
mindmaps.Document.sortByModifiedDateDescendingCustom = function(e, t) {
    if (e.dates > t.dates) {
        return -1
    }
    if (e.dates < t.dates) {
        return 1
    }
    return 0
};
mindmaps.Document.prototype.isNew = function() {
    return this.dates.modified === null
};
mindmaps.Document.prototype.getCreatedDate = function() {
    return this.dates.created
};
mindmaps.Document.prototype.getWidth = function() {
    return this.dimensions.x
};
mindmaps.Document.prototype.getHeight = function() {
    return this.dimensions.y
};
mindmaps.Document.prototype.isAutoSave = function() {
    return this.autosave
};
mindmaps.Document.prototype.setAutoSave = function(e) {
    this.autosave = e
};
mindmaps.Document.prototype.addConnectedNode = function(e) {
    this.cnodes.push(e)
};
mindmaps.Document.prototype.getConnectedNodes = function() {
    return this.cnodes || []
};
mindmaps.Document.prototype.setConnectedNodes = function(e) {
    this.cnodes = e
}