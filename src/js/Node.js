mindmaps.Node = function() {
    this.id = mindmaps.Util.getId();
    this.parent = null;
    this.children = new mindmaps.NodeMap;
    this.pluginData = {};
    this.text = {
        caption: "New Idea"
    };
    this.setPluginData("style", "font", {
        style: "normal",
        weight: "normal",
        decoration: "none",
        fontfamily: "sans-serif",
        size: 15,
        color: "#000000"
    });
    this.setPluginData("style", "border", {
        visible: true,
        style: "dashed",
        color: "#ffa500",
        background: "#ffffff"
    });
    this.setPluginData("style", "lineWidthOffset", 0);
    this.setPluginData("style", "branchColor", "#000000");
    this.setPluginData("layout", "offset", new mindmaps.Point);
    this.setPluginData("layout", "foldChildren", false)
};
mindmaps.Node.prototype.clone = function() {
    var e = new mindmaps.Node;
    var t = {
        caption: this.text.caption
    };
    e.text = t;
    e.pluginData = $.extend(true, {}, this.pluginData);
    this.forEachChild(function(t) {
        var n = t.clone();
        e.addChild(n)
    });
    return e
};
mindmaps.Node.prototype.cloneForExport = function() {
    var e = new mindmaps.Node;
    var t = {
        caption: this.text.caption
    };
    e.id = this.id;
    e.text = t;
    e.pluginData = $.extend(true, {}, this.pluginData);
    this.forEachChild(function(t) {
        var n = t.cloneForExport();
        e.addChild(n)
    });
    return e
};
mindmaps.Node.fromJSON = function(e) {
    return mindmaps.Node.fromObject(JSON.parse(e))
};
mindmaps.Node.fromObject = function(e) {
    var t = new mindmaps.Node;
    t.id = e.id;
    t.text = e.text;
    if (e.pluginData) {
        t.pluginData = e.pluginData
    }
    _(mindmaps.migrations).each(function(n) {
        if (n.onNode) {
            n.onNode(t, e)
        }
    });
    e.children.forEach(function(e) {
        var n = mindmaps.Node.fromObject(e);
        t.addChild(n)
    });
    return t
};
mindmaps.Node.prototype.toJSON = function() {
    var e = this;
    var t = function() {
        var t = [];
        e.forEachChild(function(e) {
            t.push(e.toJSON())
        });
        return t
    }();
    var n = {
        id: this.id,
        parentId: this.parent ? this.parent.id : null,
        text: this.text,
        pluginData: this.pluginData,
        children: t
    };
    return n
};
mindmaps.Node.prototype.serialize = function() {
    return JSON.stringify(this)
};
mindmaps.Node.prototype.addChild = function(e) {
    e.parent = this;
    this.children.add(e)
};
mindmaps.Node.prototype.removeChild = function(e) {
    e.parent = null;
    this.children.remove(e)
};
mindmaps.Node.prototype.isRoot = function() {
    return this.parent === null
};
mindmaps.Node.prototype.isLeaf = function() {
    return this.children.size() === 0
};
mindmaps.Node.prototype.getParent = function() {
    return this.parent
};
mindmaps.Node.prototype.getRoot = function() {
    var e = this;
    while (e.parent) {
        e = e.parent
    }
    return e
};
mindmaps.Node.prototype.getPosition = function() {
    var e = this.getPluginData("layout", "offset");
    var t = new mindmaps.Point(e.x, e.y);
    var n = t.clone();
    var r = this.parent;
    while (r) {
        n.add(r.getPluginData("layout", "offset"));
        r = r.parent
    }
    return n
};
mindmaps.Node.prototype.getDepth = function() {
    var e = this.parent;
    var t = 0;
    while (e) {
        t++;
        e = e.parent
    }
    return t
};
mindmaps.Node.prototype.getLineWidthOffset = function() {
    var e = 0;
    this.forEachDescendant(function(t) {
        if (t.getPluginData("style", "lineWidthOffset") > e) {
            e = t.getPluginData("style", "lineWidthOffset")
        }
    });
    return this.getPluginData("style", "lineWidthOffset") + e
};
mindmaps.Node.prototype.getChildren = function(e) {
    var t = [];
    this.children.each(function(n) {
        if (e) {
            var r = n.getChildren(true);
            r.forEach(function(e) {
                t.push(e)
            })
        }
        t.push(n)
    });
    return t
};
mindmaps.Node.prototype.forEachChild = function(e) {
    this.children.each(e)
};
mindmaps.Node.prototype.forEachDescendant = function(e) {
    this.children.each(function(t) {
        e(t);
        t.forEachDescendant(e)
    })
};
mindmaps.Node.prototype.setCaption = function(e) {
    this.text.caption = e
};
mindmaps.Node.prototype.getCaption = function() {
    return this.text.caption
};
mindmaps.Node.prototype.isDescendant = function(e) {
    function t(n) {
        var r = n.children.values();
        for (var i = 0, s = r.length; i < s; i++) {
            var o = r[i];
            if (t(o)) {
                return true
            }
            if (o === e) {
                return true
            }
        }
        return false
    }
    return t(this)
};
mindmaps.Node.prototype.getPluginData = function(e, t) {
    this.pluginData = this.pluginData || {};
    this.pluginData[e] = this.pluginData[e] || {};
    return this.pluginData[e][t]
};
mindmaps.Node.prototype.setPluginData = function(e, t, n) {
    var r = $.extend(true, {}, this.pluginData);
    this.pluginData = this.pluginData || {};
    this.pluginData[e] = this.pluginData[e] || {};
    this.pluginData[e][t] = n;
    if (!this.getPluginData("style", "font")) {
        console.log("not here");
        console.log(r)
    }
}