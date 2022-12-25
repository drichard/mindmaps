mindmaps.CanvasPresenter = function(e, n, o, t, i) {
    function d(e) {
        t.setZoomFactor(i.DEFAULT_ZOOM);
        var n = e.dimensions;
        t.setDimensions(n.x, n.y);
        var d = e.mindmap;
        t.drawMap(d), t.center(), o.selectNode(d.root), t.updateNode(d.root), d.root.forEachDescendant(function(e) {
            t.updateNode(e)
        })
    }

    function a() {
        function n(e) {
            var t = o.getDocument().getConnectedNodes().filter(function(n) {
                    return n.from != e.id && n.to != e.id
                }),
                i = o.getDocument().getConnectedNodes().filter(function(n) {
                    return n.from == e.id || n.to == e.id
                });
            i.forEach(function(e) {
                $("#node-" + e.from).length && $("#node-connector-canvas-" + e.from + "-" + e.canvasId).length && ($("#node-connector-canvas-" + e.from + "-" + e.canvasId).remove(), console.log("removed canvas"))
            }), o.getDocument().setConnectedNodes(t), e.forEachChild(function(e) {
                n(e)
            })
        }

        function i(e) {
            var n = o.getDocument().getConnectedNodes().filter(function(n) {
                return n.from == e.id || n.to == e.id
            });
            n.forEach(function(e) {
                $("#node-connector-canvas-" + e.from + "-" + e.canvasId).length && ($("#node-connector-canvas-" + e.from + "-" + e.canvasId).css("opacity", 1), console.log("show"))
            }), e.forEachChild(function(e) {
                i(e)
            })
        }

        function a(e) {
            var n = o.getDocument().getConnectedNodes().filter(function(n) {
                return n.from == e.id || n.to == e.id
            });
            n.forEach(function(e) {
                $("#node-connector-canvas-" + e.from + "-" + e.canvasId).length && $("#node-connector-canvas-" + e.from + "-" + e.canvasId).css("opacity", 0)
            }), e.forEachChild(function(e) {
                a(e)
            })
        }
        e.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(e) {
            d(e)
        }), e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
            t.clear()
        }), e.subscribe(mindmaps.Event.NODE_MOVED, function(e) {
            t.positionNode(e), t.updateNode(e)
        }), e.subscribe(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function(e) {
            t.setNodeText(e, e.getCaption()), t.updateNode(e), t.redrawNodeConnectors(e)
        }), e.subscribe(mindmaps.Event.NODE_LINE_WIDTH_CHANGED, function(e) {
            for (var n = e; !n.isRoot();) t.updateNode(n), n = n.getParent()
        }), e.subscribe(mindmaps.Event.NODE_CREATED, function(e) {
            t.createNode(e);
            for (var n = e; !n.isRoot();) t.updateNode(n), n = n.getParent();
            if (mindmaps.responsive.isTouchDevice || mindmaps.mode.inHD) {
                var i = e.getParent();
                if (i.getPluginData("layout", "foldChildren")) {
                    var d = new mindmaps.action.OpenNodeAction(i);
                    o.executeAction(d)
                }
                o.selectNode(e)
            } else if (e.shouldEditCaption) {
                delete e.shouldEditCaption;
                var i = e.getParent();
                if (i.getPluginData("layout", "foldChildren")) {
                    var d = new mindmaps.action.OpenNodeAction(i);
                    o.executeAction(d)
                }
                o.selectNode(e), c.attachToNode(e), t.editNodeCaption(e)
            }
        }), e.subscribe(mindmaps.Event.NODE_DELETED, function(e, i) {
            console.log("deleting node");
            var d = o.selectedNode;
            (e === d || e.isDescendant(d)) && o.selectNode(i), n(e), console.log("nodes is " + o.getDocument().getConnectedNodes().length), t.deleteNode(e), i.isLeaf() && t.removeFoldButton(i)
        }), e.subscribe(mindmaps.Event.CONNECTED_TWO_NODES, function(e, n) {
            console.log("connected " + e.getCaption() + "," + n.getCaption());
            var t = new mindmaps.action.ConnectTwoNodesAction(e, n, "dashed", "#ff0000", "0");
            o.executeAction(t)
        }), e.subscribe(mindmaps.Event.CONNECTION_COLOR_CHANGED, function() {}), e.subscribe(mindmaps.Event.NODE_SELECTED, r), e.subscribe(mindmaps.Event.NODE_OPENED, function(e) {
            e.forEachChild(function(e) {
                i(e)
            }), t.openNode(e)
        }), e.subscribe(mindmaps.Event.NODE_CLOSED, function(e) {
            e.forEachChild(function(e) {
                a(e)
            }), t.closeNode(e)
        }), e.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(e) {
            t.updateNode(e)
        }), e.subscribe(mindmaps.Event.TWO_NODES_CONNECTED, function(e, n) {
            t.updateNode(e), t.updateNode(n)
        }), e.subscribe(mindmaps.Event.TWO_NODES_DISCONNECTED, function(e, n) {
            t.updateNode(e), t.updateNode(n)
        }), e.subscribe(mindmaps.Event.CONNECTION_COLOR_CHANGED, function(e) {
            t.updateNode(e)
        }), e.subscribe(mindmaps.Event.NODE_BORDER_CHANGED, function(e) {
            console.log("node border changed"), t.updateNode(e)
        }), e.subscribe(mindmaps.Event.NODE_FONT_COLOR_PREVIEW, function(e, n) {
            t.updateFontColor(e, n)
        }), e.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function(e) {
            t.updateNode(e)
        }), e.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_PREVIEW, function(e, n) {
            t.updateBranchColor(e, n)
        }), e.subscribe(mindmaps.Event.ZOOM_CHANGED, function(e) {
            t.setZoomFactor(e), t.applyViewZoom(), t.scaleMap();
            var n = o.getDocument();
            if (n) {
                var i = n.mindmap;
                t.updateNode(i.root), i.root.forEachDescendant(function(e) {
                    t.updateNode(e)
                })
            }
        })
    }
    var c = t.getCreator();
    this.init = function() {
        var e = n.get(mindmaps.EditNodeCaptionCommand);
        e.setHandler(this.editNodeCaption.bind(this));
        var o = n.get(mindmaps.ToggleNodeFoldedCommand);
        o.setHandler(s)
    }, this.editNodeCaption = function(e) {
        e || (e = o.selectedNode), t.editNodeCaption(e)
    };
    var s = function(e) {
            e || (e = o.selectedNode);
            var n = new mindmaps.action.ToggleNodeFoldAction(e);
            o.executeAction(n)
        },
        r = function(e, n) {
            t.selectedNode = e, n && t.unhighlightNode(n), t.highlightNode(e)
        };
    t.mouseWheeled = function(e) {
        t.stopEditNodeCaption(), e > 0 ? i.zoomIn(.1) : 0 > e && i.zoomOut(.1)
    }, t.pinch = function(e) {
        t.stopEditNodeCaption(), i.zoomByScale(e)
    }, t.tow_tap = function() {
        t.stopEditNodeCaption(), i.zoomToOne()
    }, t.nodeMouseOver = function(e) {
        t.isNodeDragging() || c.isDragging() || c.attachToNode(e)
    }, t.nodeCaptionMouseOver = function(e) {
        t.isNodeDragging() || c.isDragging() || c.attachToNode(e)
    }, t.nodeMouseDown = function(e) {
        o.selectNode(e), c.attachToNode(e)
    }, t.nodeDoubleClicked = function(e) {
        t.editNodeCaption(e)
    }, t.nodeDragged = function(e, n) {
        var t = new mindmaps.action.MoveNodeAction(e, n);
        o.executeAction(t)
    }, t.foldButtonClicked = function(e) {
        s(e)
    }, c.dragStarted = function(e) {
        var n = e.isRoot() ? mindmaps.Util.randomColor() : e.getPluginData("style", "branchColor");
        return n
    }, c.dragStopped = function(e, n, t, i) {
        if (!(50 > i)) {
            var d = new mindmaps.Node;
            d.setPluginData("style", "branchColor", c.lineColor), d.setPluginData("layout", "offset", new mindmaps.Point(n, t)), d.shouldEditCaption = !0, o.createNode(d, e)
        }
    }, t.nodeCaptionEditCommitted = function(e, n) {
        var n = $.trim(n);
        n && (t.stopEditNodeCaption(), o.changeNodeCaption(e, n))
    }, t.pluginclick = function(e,icon) {
        //this function created by ms to click on plugin icon
        o.selectNode(e);
        if(icon=="attachment") {
            $('#inspector-button-attachment').trigger('click')
        }
        if(icon=="draw") {
			console.log("need work");

        }
        if(icon=="url") {
            $('#inspector-button-urls').trigger('click')
        }
    }, this.go = function() {
        t.init()
    }, a(), this.init()
};