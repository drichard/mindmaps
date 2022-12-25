mindmaps.MindMapModel = function(e, t, n) {
    var r = this;
    this.document = null;
    this.selectedNode = null;
    this.getDocument = function() {
        return this.document
    };
    this.setDocument = function(t) {
        this.document = t;
        if (t) {
            e.publish(mindmaps.Event.DOCUMENT_OPENED, t)
        } else {
            e.publish(mindmaps.Event.DOCUMENT_CLOSED)
        }
    };
    this.getMindMap = function() {
        if (this.document) {
            return this.document.mindmap
        }
        return null
    };
    this.init = function() {
        var n = t.get(mindmaps.CreateNodeCommand);
        n.setHandler(this.createNode.bind(this));
        var i = t.get(mindmaps.CreateSiblingNodeCommand);
        i.setHandler(this.createSiblingNode.bind(this));
        var s = t.get(mindmaps.DeleteNodeCommand);
        s.setHandler(this.deleteNode.bind(this));
        var o = t.get(mindmaps.SelectParentNodeCommand);
        o.setHandler(this.selectParent.bind(this));
        var u = t.get(mindmaps.SelectChildFirstNodeCommand);
        u.setHandler(this.selectChildFirst.bind(this));
        var a = t.get(mindmaps.SelectSiblingNextNodeCommand);
        a.setHandler(this.selectSiblingN.bind(this));
        var f = t.get(mindmaps.SelectSiblingPrevNodeCommand);
        f.setHandler(this.selectSiblingP.bind(this));
        e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
            n.setEnabled(false);
            i.setEnabled(false);
            s.setEnabled(false);
            o.setEnabled(false);
            u.setEnabled(false);
            a.setEnabled(false);
            f.setEnabled(false)
        });
        e.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
            n.setEnabled(true);
            i.setEnabled(true);
            s.setEnabled(true);
            o.setEnabled(true);
            u.setEnabled(true);
            a.setEnabled(true);
            f.setEnabled(true)
        });
        e.subscribe(mindmaps.Event.NODE_SELECTED, function(e) {
            i.setEnabled(r.getParent(e));
            s.setEnabled(r.getParent(e));
            o.setEnabled(r.getParent(e));
            u.setEnabled(r.getChildFirst(e));
            a.setEnabled(r.getSiblingN(e));
            f.setEnabled(r.getSiblingP(e))
        })
    };
    this.deleteNode = function(e) {
        if (!e) {
            e = this.selectedNode
        }
        var t = this.getMindMap();
        var n = new mindmaps.action.DeleteNodeAction(e, t);
        this.executeAction(n)
    };
    this.createNode = function(e, t) {
        var n = this.getMindMap();
        if (!(e && t)) {
            t = this.selectedNode;
            var r = new mindmaps.action.CreateAutoPositionedNodeAction(t, n)
        } else {
            var r = new mindmaps.action.CreateNodeAction(e, t, n)
        }
        this.executeAction(r)
    };
    this.createSiblingNode = function() {
        var e = this.getMindMap();
        var t = this.selectedNode;
        var n = t.getParent();
        if (n === null) {
            return
        }
        var r = new mindmaps.action.CreateAutoPositionedNodeAction(n, e);
        this.executeAction(r)
    };
    this.selectNode = function(t) {
        if (t === this.selectedNode) {
            return
        }
        var n = this.selectedNode;
        this.selectedNode = t;
        e.publish(mindmaps.Event.NODE_SELECTED, t, n)
    };
    this.selectParent = function() {
        if (r.selectedNode) {
            var e = r.selectedNode;
            var t = r.getParent(e);
            if (t) {
                r.selectNode(t)
            }
        }
    };
    this.selectChildFirst = function() {
        if (r.selectedNode) {
            var e = r.selectedNode;
            var t = r.getChildFirst(e);
            if (t) {
                r.selectNode(t)
            }
        }
    };
    this.selectSiblingN = function() {
        if (r.selectedNode) {
            var e = r.selectedNode;
            var t = r.getSiblingN(e);
            if (t) {
                r.selectNode(t)
            }
        }
    };
    this.selectSiblingP = function() {
        if (r.selectedNode) {
            var e = r.selectedNode;
            var t = r.getSiblingP(e);
            if (t) {
                r.selectNode(t)
            }
        }
    };
    this.getParent = function(e) {
        return e.parent
    };
    this.getChildFirst = function(e) {
        if (e.children && e.children.count > 0) {
            var t = e.children.nodes[e.children.indexes[0]];
            return t
        }
        return null
    };
    this.getChildLast = function(e) {
        if (e.children && e.children.count > 0) {
            var t = e.children.nodes[e.children.indexes[e.children.indexes.length - 1]];
            return t
        }
        return null
    };
    this.getSiblingN = function(e) {
        if (e.parent) {
            var t = e.parent;
            if (t.children && t.children.count > 0) {
                var n = t.children.indexes.indexOf(e.id);
                if (n >= 0 && n < t.children.count - 1) {
                    var r = t.children.nodes[t.children.indexes[n + 1]];
                    return r
                }
            }
        }
        return null
    };
    this.getSiblingP = function(e) {
        if (e.parent) {
            var t = e.parent;
            if (t.children && t.children.count > 0) {
                var n = t.children.indexes.indexOf(e.id);
                if (n > 0) {
                    var r = t.children.nodes[t.children.indexes[n - 1]];
                    return r
                }
            }
        }
        return null
    };
    this.changeNodeCaption = function(e, t) {
        if (!e) {
            e = this.selectedNode
        }
        var n = new mindmaps.action.ChangeNodeCaptionAction(e, t);
        this.executeAction(n)
    };
    this.executeAction = function(t) {
        if (t instanceof mindmaps.action.CompositeAction) {
            var i = this.executeAction.bind(this);
            t.forEachAction(i);
            return
        }
        var s = t.execute();
        if (s !== undefined && !s) {
            return false
        }
        if (t.event) {
            if (!Array.isArray(t.event)) {
                t.event = [t.event]
            }
            e.publish.apply(e, t.event)
        }
        if (t.undo) {
            var o = function() {
                r.executeAction(t.undo())
            };
            if (t.redo) {
                var u = function() {
                    r.executeAction(t.redo())
                }
            }
            n.addUndo(o, u)
        }
    };
    this.saveToLocalStorage = function() {
        var t = this.document.prepareSave();
        var n = mindmaps.LocalDocumentStorage.saveDocument(t);
        if (n) {
            e.publish(mindmaps.Event.DOCUMENT_SAVED, t)
        }
        return n
    };
    this.saveToStorageServer = function(t) {
        var n = this.document.prepareSave();
        mindmaps.ServerStorage.saveDocument(n, {
            start: function() {
                t.start()
            },
            success: function() {
                e.publish(mindmaps.Event.DOCUMENT_SAVED, n);
                t.success()
            },
            error: function(e) {
                t.error(e)
            }
        })
    };
    this.saveToGoogleDrive = function(t) {
        var n = this.document.prepareSave();
        mindmaps.GoogleDrive.saveDocument(n, {
            start: function() {
                t.start()
            },
            success: function() {
                e.publish(mindmaps.Event.DOCUMENT_SAVED, n);
                console.log("save drive succes");
                t.success()
            },
            error: function(e) {
                console.log("save drive error");
                t.error(e)
            },
            notify: function(e) {
                t.notify(e)
            }
        })
    };
    this.init()
}