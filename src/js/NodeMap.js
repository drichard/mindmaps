mindmaps.NodeMap = function() {
    this.nodes = {};
    this.indexes = [];
    this.count = 0
};
mindmaps.NodeMap.prototype.get = function(e) {
    return this.nodes[e]
};
mindmaps.NodeMap.prototype.add = function(e) {
    if (!this.nodes.hasOwnProperty(e.id)) {
        this.nodes[e.id] = e;
        this.indexes.push(e.id);
        this.count++;
        return true
    }
    return false
};
mindmaps.NodeMap.prototype.remove = function(e) {
    if (this.nodes.hasOwnProperty(e.id)) {
        delete this.nodes[e.id];
        var t = this.indexes.indexOf(e.id);
        if (t >= 0) {
            this.indexes.splice(t, 1)
        }
        this.count--;
        return true
    }
    return false
};
mindmaps.NodeMap.prototype.size = function() {
    return this.count
};
mindmaps.NodeMap.prototype.values = function() {
    return Object.keys(this.nodes).map(function(e) {
        return this.nodes[e]
    }, this)
};
mindmaps.NodeMap.prototype.each = function(e) {
    for (var t in this.nodes) {
        e(this.nodes[t])
    }
}