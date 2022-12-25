mindmaps.MindMap = function(e) {
    this.nodes = new mindmaps.NodeMap;
    if (e) {
        this.root = e
    } else {
        this.root = new mindmaps.Node;
        this.root.text = {
            caption: "Central Idea"
        };
        this.root.setPluginData("style", "font", {
            style: "normal",
            weight: "bold",
            fontfamily: "sans-serif",
            decoration: "none",
            size: 20,
            color: "#000000"
        });
        this.root.setPluginData("style", "border", {
            visible: true,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        })
    }
    this.addNode(this.root)
};
mindmaps.MindMap.fromJSON = function(e) {
    return mindmaps.MindMap.fromObject(JSON.parse(e))
};
mindmaps.MindMap.fromObject = function(e) {
    var t = mindmaps.Node.fromObject(e.root);
    var n = new mindmaps.MindMap(t);
    t.forEachDescendant(function(e) {
        n.addNode(e)
    });
    return n
};
mindmaps.MindMap.prototype.toJSON = function() {
    var e = {
        root: this.root
    };
    return e
};
mindmaps.MindMap.prototype.serialize = function() {
    return JSON.stringify(this)
};
mindmaps.MindMap.prototype.createNode = function() {
    var e = new mindmaps.Node;
    this.addNode(e);
    return e
};
mindmaps.MindMap.prototype.addNode = function(e) {
    this.nodes.add(e);
    var t = this;
    e.forEachDescendant(function(e) {
        t.nodes.add(e)
    })
};
mindmaps.MindMap.prototype.removeNode = function(e) {
    var t = e.parent;
    t.removeChild(e);
    var n = this;
    e.forEachDescendant(function(e) {
        n.nodes.remove(e)
    });
    this.nodes.remove(e)
};
mindmaps.MindMap.prototype.getRoot = function() {
    return this.root
}