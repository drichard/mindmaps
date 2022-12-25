function getNodeFromId(n, t) {
    var o = null;
    return n.id == t && (o = n), o || n.forEachChild(function(n) {
        null !== (r = getNodeFromId(n, t)) && (o = r)
    }), o
}
mindmaps.action = {}, mindmaps.action.Action = function() {}, mindmaps.action.Action.prototype = {
    noUndo: function() {
        return delete this.undo, delete this.redo, this
    },
    noEvent: function() {
        return delete this.event, this
    },
    execute: function() {},
    cancel: function() {
        this.cancelled = !0
    }
}, mindmaps.action.MoveNodeAction = function(n, t) {
    var o = n.getPluginData("layout", "offset");
    this.execute = function() {
        n.setPluginData("layout", "offset", t), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_MOVED, n], this.undo = function() {
        return new mindmaps.action.MoveNodeAction(n, o)
    }
}, mindmaps.action.MoveNodeAction.prototype = new mindmaps.action.Action, mindmaps.action.DeleteNodeAction = function(n, t) {
    var o = n.getParent();
    this.execute = function() {
        return n.isRoot() ? !1 : (t.removeNode(n), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_DELETED, n, o], this.undo = function() {
        return new mindmaps.action.CreateNodeAction(n, o, t)
    }
}, mindmaps.action.DeleteNodeAction.prototype = new mindmaps.action.Action, mindmaps.action.CreateAutoPositionedNodeAction = function(n, t) {
    if (n.isRoot()) var o = mindmaps.Util.randomColor(),
        i = Math.random() > .49 ? 1 : -1,
        e = Math.random() > .49 ? 1 : -1,
        a = i * (100 + 250 * Math.random()),
        c = 250 * e * Math.random();
    else var o = n.getPluginData("style", "branchColor"),
        i = n.getPluginData("layout", "offset").x > 0 ? 1 : -1,
        d = mindmaps.ui.geometry.newChildPosition(n),
        a = Math.abs(d.x) * i,
        c = d.y;
    var m = new mindmaps.Node;
    return m.setPluginData("style", "branchColor", o), m.shouldEditCaption = !0, m.setPluginData("layout", "offset", new mindmaps.Point(a, c)), new mindmaps.action.CreateNodeAction(m, n, t)
}, mindmaps.action.CreateNodeAction = function(n, t, o) {
    this.execute = function() {
        o.addNode(n), t.addChild(n), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_CREATED, n], this.undo = function() {
        return new mindmaps.action.DeleteNodeAction(n, o)
    }
}, mindmaps.action.CreateNodeAction.prototype = new mindmaps.action.Action, mindmaps.action.ToggleNodeFoldAction = function(n) {
    return n.getPluginData("layout", "foldChildren") ? new mindmaps.action.OpenNodeAction(n) : new mindmaps.action.CloseNodeAction(n)
}, mindmaps.action.OpenNodeAction = function(n) {
    this.execute = function() {
        n.setPluginData("layout", "foldChildren", !1)
    }, this.event = [mindmaps.Event.NODE_OPENED, n]
}, mindmaps.action.OpenNodeAction.prototype = new mindmaps.action.Action, mindmaps.action.CloseNodeAction = function(n) {
    this.execute = function() {
        n.setPluginData("layout", "foldChildren", !0)
    }, this.event = [mindmaps.Event.NODE_CLOSED, n]
}, mindmaps.action.CloseNodeAction.prototype = new mindmaps.action.Action, mindmaps.action.ChangeNodeCaptionAction = function(n, t) {
    var o = n.getCaption();
    this.execute = function() {
        return o === t ? !1 : (n.setCaption(t), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, n], this.undo = function() {
        return new mindmaps.action.ChangeNodeCaptionAction(n, o)
    }
}, mindmaps.action.ChangeNodeCaptionAction.prototype = new mindmaps.action.Action, mindmaps.action.ChangeNodeBorderStyleAction = function(n, t) {
    var o = n.getPluginData("style", "border") || {
            visible: !0,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        },
        i = o.style;
    this.execute = function() {
        return t === o.style ? !1 : (o.style = t, n.setPluginData("style", "border", o), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_BORDER_CHANGED, n], this.undo = function() {
        return new mindmaps.action.ChangeNodeBorderStyleAction(n, i)
    }
}, mindmaps.action.ChangeNodeBorderStyleAction.prototype = new mindmaps.action.Action, mindmaps.action.ChangeNodeFontFaceAction = function(n, t) {
    var o = n.getPluginData("style", "font"),
        i = o.fontfamily;
    this.execute = function() {
        return o.fontfamily === t ? !1 : (o.fontfamily = t, n.setPluginData("style", "font", o), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_FONT_CHANGED, n], this.undo = function() {
        return new mindmaps.action.ChangeNodeFontFaceAction(n, i)
    }
}, mindmaps.action.ChangeNodeFontFaceAction.prototype = new mindmaps.action.Action, mindmaps.action.ChangeNodeFontSizeAction = function(n, t) {
    this.execute = function() {
        var o = n.getPluginData("style", "font");
        o.size = o.size + t, n.setPluginData("style", "font", o), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_FONT_CHANGED, n], this.undo = function() {
        return new mindmaps.action.ChangeNodeFontSizeAction(n, -t)
    }
}, mindmaps.action.ChangeNodeFontSizeAction.prototype = new mindmaps.action.Action, mindmaps.action.DecreaseNodeFontSizeAction = function(n) {
    return new mindmaps.action.ChangeNodeFontSizeAction(n, -4)
}, mindmaps.action.IncreaseNodeFontSizeAction = function(n) {
    return new mindmaps.action.ChangeNodeFontSizeAction(n, 4)
}, mindmaps.action.ChangeNodeLineWidthAction = function(n, t) {
    this.execute = function() {
        var o = n.getPluginData("style", "lineWidthOffset");
        n.setPluginData("style", "lineWidthOffset", o + t), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_LINE_WIDTH_CHANGED, n], this.undo = function() {
        return new mindmaps.action.ChangeNodeLineWidthAction(n, -t)
    }
}, mindmaps.action.ChangeNodeLineWidthAction.prototype = new mindmaps.action.Action, mindmaps.action.DecreaseNodeLineWidthAction = function(n) {
    return new mindmaps.action.ChangeNodeLineWidthAction(n, -2)
}, mindmaps.action.IncreaseNodeLineWidthAction = function(n) {
    return new mindmaps.action.ChangeNodeLineWidthAction(n, 2)
}, mindmaps.action.ToggleBorderButtonAction = function(n) {
    this.execute = function() {
        if (!n.isRoot()) {
            var t = n.getPluginData("style", "border") || {
                visible: !0,
                style: "dashed",
                color: "#ffa500",
                background: "#ffffff"
            };
            t.visible = !t.visible, n.setPluginData("style", "border", t), mindmaps.isMapLoadingConfirmationRequired = !0
        }
    }, this.event = [mindmaps.Event.NODE_BORDER_CHANGED, n], this.undo = function() {
        return new mindmaps.action.ToggleBorderButtonAction(n)
    }
}, mindmaps.action.ToggleBorderButtonAction.prototype = new mindmaps.action.Action, mindmaps.action.SetFontWeightAction = function(n, t) {
    this.execute = function() {
        var o = n.getPluginData("style", "font"),
            i = t ? "bold" : "normal";
        o.weight = i, n.setPluginData("style", "font", o), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_FONT_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetFontWeightAction(n, !t)
    }
}, mindmaps.action.SetFontWeightAction.prototype = new mindmaps.action.Action, mindmaps.action.SetFontStyleAction = function(n, t) {
    this.execute = function() {
        var o = n.getPluginData("style", "font"),
            i = t ? "italic" : "normal";
        o.style = i, n.setPluginData("style", "font", o), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_FONT_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetFontStyleAction(n, !t)
    }
}, mindmaps.action.SetFontStyleAction.prototype = new mindmaps.action.Action, mindmaps.action.SetFontDecorationAction = function(n, t) {
    var o = n.getPluginData("style", "font"),
        i = o.decoration;
    this.execute = function() {
        o.decoration = t, n.setPluginData("style", "font", o), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.NODE_FONT_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetFontDecorationAction(n, i)
    }
}, mindmaps.action.SetFontDecorationAction.prototype = new mindmaps.action.Action, mindmaps.action.SetBorderBackgroundColorAction = function(n, t) {
    var o = n.getPluginData("style", "border") || {
            visible: !0,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        },
        i = o.background;
    this.execute = function() {
        return t === o.background ? !1 : (o.background = t, n.setPluginData("style", "border", o), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_BORDER_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetBorderBackgroundColorAction(n, i)
    }
}, mindmaps.action.SetBorderBackgroundColorAction.prototype = new mindmaps.action.Action, mindmaps.action.SetBorderColorAction = function(n, t) {
    var o = n.getPluginData("style", "border") || {
            visible: !0,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        },
        i = o.color;
    this.execute = function() {
        return t === o.color ? !1 : (o.color = t, n.setPluginData("style", "border", o), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_BORDER_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetBorderColorAction(n, i)
    }
}, mindmaps.action.SetBorderColorAction.prototype = new mindmaps.action.Action, mindmaps.action.SetConnectColorAction = function(n, t, o) {
    var i = mindmaps.getConnectedNodes().filter(function(o) {
        return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
    });
    if (i.length) var e = i[0].color;
    this.execute = function() {
        var i = mindmaps.getConnectedNodes().filter(function(o) {
            return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
        });
        if (!i.length) return !1;
        if (i[0].color == o) return !1;
        i[0].color = o;
        var e = mindmaps.getConnectedNodes().filter(function(o) {
            return !(o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id)
        });
        e.push(i[0]), mindmaps.setConnectedNodes(e), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.CONNECTION_COLOR_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetConnectColorAction(n, t, e)
    }
}, mindmaps.action.SetConnectColorAction.prototype = new mindmaps.action.Action, mindmaps.action.SetConnectArrowAction = function(n, t, o) {
    var i = mindmaps.getConnectedNodes().filter(function(o) {
        return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
    });
    if (i.length) var e = i[0].arrow;
    this.execute = function() {
        var i = mindmaps.getConnectedNodes().filter(function(o) {
            return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
        });
        if (!i.length) return !1;
        if (i[0].arrow == o) return !1;
        i[0].arrow = o;
        var e = mindmaps.getConnectedNodes().filter(function(o) {
            return !(o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id)
        });
        e.push(i[0]), mindmaps.setConnectedNodes(e), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.CONNECTION_COLOR_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetConnectArrowAction(n, t, e)
    }
}, mindmaps.action.SetConnectArrowAction.prototype = new mindmaps.action.Action, mindmaps.action.SetConnectStyleAction = function(n, t, o) {
    var i = mindmaps.getConnectedNodes().filter(function(o) {
        return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
    });
    if (i.length) var e = i[0].style;
    this.execute = function() {
        var i = mindmaps.getConnectedNodes().filter(function(o) {
            return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
        });
        if (!i.length) return !1;
        if (i[0].style == o) return !1;
        i[0].style = o;
        var e = mindmaps.getConnectedNodes().filter(function(o) {
            return !(o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id)
        });
        e.push(i[0]), mindmaps.setConnectedNodes(e), mindmaps.isMapLoadingConfirmationRequired = !0
    }, this.event = [mindmaps.Event.CONNECTION_COLOR_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetConnectStyleAction(n, t, e)
    }
}, mindmaps.action.SetConnectStyleAction.prototype = new mindmaps.action.Action, mindmaps.action.ConnectTwoNodesAction = function(n, t, o, i, e) {
    this.execute = function() {
        return console.log(n.id + " to " + t.id), console.log("ConnectTwoNodesAction "), mindmaps.addTwoNodes(n, t, o, i, e)
    }, this.event = [mindmaps.Event.TWO_NODES_CONNECTED, n, t], this.undo = function() {
        return new mindmaps.action.ConnectNodeRemoveClickAction(n, t)
    }
}, mindmaps.action.ConnectTwoNodesAction.prototype = new mindmaps.action.Action, mindmaps.action.ConnectNodeRemoveClickAction = function(n, t) {
    this.execute = function() {
        console.log("ConnectNodeRemoveClickAction " + n.id + " to " + t.id);
        var o = mindmaps.getConnectedNodes().filter(function(o) {
            return o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id
        });
        if (!o.length) return !1;
        cfnode = o[0];
        var i = mindmaps.getConnectedNodes().filter(function(o) {
            return !(o.from == t.id && o.to == n.id || o.from == n.id && o.to == t.id)
        });
        $("#node-" + cfnode.from).length && $("#node-connector-canvas-" + cfnode.from + "-" + cfnode.canvasId).length && ($("#node-connector-canvas-" + cfnode.from + "-" + cfnode.canvasId).remove(), console.log("removed canvas")), mindmaps.setConnectedNodes(i), mindmaps.isMapLoadingConfirmationRequired = !0, $("#node-connect-styles-row").hide(), $("#inspector-button-connect-node-remove").hide()
    }, this.event = [mindmaps.Event.TWO_NODES_DISCONNECTED, n, t], this.undo = function() {
        return new mindmaps.action.ConnectTwoNodesAction(n, t, cfnode.style, cfnode.color, cfnode.arrow)
    }
}, mindmaps.action.ConnectNodeRemoveClickAction.prototype = new mindmaps.action.Action, mindmaps.action.SetFontColorAction = function(n, t) {
    var o = n.getPluginData("style", "font"),
        i = o.color;
    this.execute = function() {
        return t === o.color ? !1 : (o.color = t, n.setPluginData("style", "font", o), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_FONT_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetFontColorAction(n, i)
    }
}, mindmaps.action.SetFontColorAction.prototype = new mindmaps.action.Action, mindmaps.action.SetBranchColorAction = function(n, t) {
    console.log("SetBranchColorAction i");
    var o = n.getPluginData("style", "branchColor");
    this.execute = function() {
        return console.log("SetBranchColorAction ii"), t === o ? !1 : (n.setPluginData("style", "branchColor", t), void(mindmaps.isMapLoadingConfirmationRequired = !0))
    }, this.event = [mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, n], this.undo = function() {
        return new mindmaps.action.SetBranchColorAction(n, o)
    }
}, mindmaps.action.SetBranchColorAction.prototype = new mindmaps.action.Action, mindmaps.action.CompositeAction = function() {
    this.actions = []
}, mindmaps.action.CompositeAction.prototype.addAction = function(n) {
    this.actions.push(n)
}, mindmaps.action.CompositeAction.prototype.forEachAction = function(n) {
    this.actions.forEach(n)
}, mindmaps.action.ConnectNodeClickAction = function(n, t) {
    console.log("ConnectNodeClickAction"), this.execute = function() {
        0 == t ? mindmaps.connectMode = !1 : mindmaps.connectMode && mindmaps.connectStartNode == n ? mindmaps.connectMode = !1 : (mindmaps.connectStartNode = n, mindmaps.connectMode = !0, console.log("connect start node " + mindmaps.connectStartNode.getCaption()))
    }, this.event = [mindmaps.Event.CONNECT_BUTTON_CLICKED, n], this.undo = function() {
        return new mindmaps.action.ConnectNodeClickAction(n, !1)
    }
}, mindmaps.action.ConnectNodeClickAction.prototype = new mindmaps.action.Action, mindmaps.action.SetChildrenBranchColorAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "branchColor"),
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.SetBranchColorAction(n, t))
    })
}, mindmaps.action.SetChildrenBranchColorAction.prototype = new mindmaps.action.CompositeAction, mindmaps.action.SetChildrenBackgroundColorAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "border") || {
            visible: !0,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        },
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.SetBorderBackgroundColorAction(n, t.background))
    })
}, mindmaps.action.SetChildrenBackgroundColorAction.prototype = new mindmaps.action.CompositeAction, mindmaps.action.SetChildrenFontColorAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "font"),
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.SetFontColorAction(n, t.color))
    })
}, mindmaps.action.SetChildrenFontColorAction.prototype = new mindmaps.action.CompositeAction, mindmaps.action.SetChildrenFontStyleAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "font"),
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.SetFontWeightAction(n, "bold" === t.weight)), o.addAction(new mindmaps.action.SetFontStyleAction(n, "italic" === t.style)), o.addAction(new mindmaps.action.SetFontDecorationAction(n, t.decoration))
    })
}, mindmaps.action.SetChildrenFontStyleAction.prototype = new mindmaps.action.CompositeAction, mindmaps.action.SetChildrenFontFaceAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "font"),
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.ChangeNodeFontFaceAction(n, t.fontfamily))
    })
}, mindmaps.action.SetChildrenFontFaceAction.prototype = new mindmaps.action.CompositeAction, mindmaps.action.SetChildrenBorderColorAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "border") || {
            visible: !0,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        },
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.SetBorderColorAction(n, t.color))
    })
}, mindmaps.action.SetChildrenBorderColorAction.prototype = new mindmaps.action.CompositeAction, mindmaps.action.SetChildrenBorderStyleAction = function(n) {
    mindmaps.action.CompositeAction.call(this);
    var t = n.getPluginData("style", "border") || {
            visible: !0,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        },
        o = this;
    n.forEachDescendant(function(n) {
        o.addAction(new mindmaps.action.ChangeNodeBorderStyleAction(n, t.style))
    })
}, mindmaps.action.SetChildrenBorderStyleAction.prototype = new mindmaps.action.CompositeAction;