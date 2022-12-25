mindmaps.CanvasView = function() {
    this.$getDrawingArea = function() {
        return $("#drawing-area")
    };
    this.$getContainer = function() {
        return $("#canvas-container")
    };
    this.center = function() {
        var e = this.$getContainer();
        var t = this.$getDrawingArea();
        var n = t.width() - e.width();
        var r = t.height() - e.height();
        this.scroll(n / 2, r / 2)
    };
    this.scroll = function(e, t) {
        var n = this.$getContainer();
        n.scrollLeft(e).scrollTop(t)
    };
    this.applyViewZoom = function() {
        var e = this.zoomFactorDelta;
        var t = this.$getContainer();
        var n = t.scrollLeft();
        var r = t.scrollTop();
        var i = t.width();
        var s = t.height();
        var o = i / 2 + n;
        var u = s / 2 + r;
        o *= this.zoomFactorDelta;
        u *= this.zoomFactorDelta;
        n = o - i / 2;
        r = u - s / 2;
        var a = this.$getDrawingArea();
        var f = a.width();
        var l = a.height();
        a.width(f * e).height(l * e);
        this.scroll(n, r);
        var c = parseFloat(a.css("background-size"));
        if (isNaN(c)) {
            console.warn("Could not set background-size!")
        }
        a.css("background-size", c * e)
    };
    this.setDimensions = function(e, t) {
        e = e * this.zoomFactor;
        t = t * this.zoomFactor;
        var n = this.$getDrawingArea();
        n.width(e).height(t)
    };
    this.setZoomFactor = function(e) {
        this.zoomFactorDelta = e / (this.zoomFactor || 1);
        this.zoomFactor = e
    }
};
mindmaps.CanvasView.prototype.drawMap = function(e) {
    throw new Error("Not implemented")
};
mindmaps.DefaultCanvasView = function() {
    function a() {
        e.$getContainer().dragscrollable({
            dragSelector: "#drawing-area, canvas.line-canvas",
            acceptPropagatedEvent: false,
            delegateMode: true,
            preventDefault: true
        })
    }

    function f(e) {
        return $("#node-canvas-" + e.id)
    }

    function l(e, t) {
        t = t || 0;
        return $("#node-connector-canvas-" + e.id + "-" + t)
    }

    function c(e) {
        return $("#node-" + e.id)
    }

    function h(e) {
        return $("#node-caption-" + e.id)
    }

    function p(t, n, r, i, s, u, a, f, l, c, h) {
        var p = t[0];
        var d = p.getContext("2d");
        o.$canvas = t;
        o.render(d, n, r, i, s, u, f, a, l, e.zoomFactor, c, h)
    }

    function d(e, t, n, r, i) {
        i = i || false;
        n = n || e.getPluginData("layout", "offset").x;
        r = r || e.getPluginData("layout", "offset").y;
        var s = mindmaps.getConnectedNodes().filter(function(t) {
            return t.from == e.id
        });
        s.forEach(function(s) {
            if ($("#node-" + s.from).length) g($("#node-connector-canvas-" + s.from + "-" + s.canvasId), t, n, r, true, s.from, s.to, e.getRoot(), i, s.style, s.arrow, s.color)
        });
        s = mindmaps.getConnectedNodes().filter(function(t) {
            return t.to == e.id
        });
        s.forEach(function(s) {
            if ($("#node-" + s.from).length) g($("#node-connector-canvas-" + s.from + "-" + s.canvasId), t, n, r, false, s.from, s.to, e.getRoot(), i, s.style, s.arrow, s.color)
        });
        if (i) e.forEachChild(function(e) {
            if (b == e.id) d(e, e.getDepth(), w, E, true);
            else d(e, e.getDepth(), e.getPluginData("layout", "offset").x, e.getPluginData("layout", "offset").y, true)
        })
    }

    function v(e, t) {
        var n = null;
        if (e.id == t) n = e;
        if (!n) e.forEachChild(function(e) {
            if ((r = v(e, t)) !== null) n = r
        });
        return n
    }

    function m(e) {
        tmp = e.getParent();
        while (tmp) {
            if (tmp.getPluginData("layout", "foldChildren")) return true;
            tmp = tmp.getParent()
        }
        return false
    }

    function g(e, t, n, r, i, s, o, u, a, f, l, h) {
        a = a || false;
        s = v(u, s);
        o = v(u, o);
        if (!s || !o) return;
        if (m(s) || m(o)) e.css("opacity", 0);
        else e.css("opacity", 1);
        if (a)
            if (b == s.id || b == o.id) a = false;
        var d = 0,
            g = 0;
        var y = 0,
            S = 0;
        if (i) {
            d = n;
            y = r;
            g = o.getPluginData("layout", "offset").x;
            S = o.getPluginData("layout", "offset").y
        } else {
            d = s.getPluginData("layout", "offset").x;
            y = s.getPluginData("layout", "offset").y;
            g = n;
            S = r
        }
        if (!s.isRoot()) {
            tmp = s.getParent();
            while (!tmp.isRoot()) {
                if (!i && tmp.id == o.id) {
                    d += n;
                    y += r
                } else if (a && tmp.id == b) {
                    d += w;
                    y += E
                } else {
                    d += tmp.getPluginData("layout", "offset").x;
                    y += tmp.getPluginData("layout", "offset").y
                }
                tmp = tmp.getParent()
            }
        }
        if (!o.isRoot()) {
            tmp = o.getParent();
            while (!tmp.isRoot()) {
                if (i && tmp.id == s.id) {
                    g += n;
                    S += r
                } else if (a && tmp.id == b) {
                    g += w;
                    S += E
                } else {
                    g += tmp.getPluginData("layout", "offset").x;
                    S += tmp.getPluginData("layout", "offset").y
                }
                tmp = tmp.getParent()
            }
        }
        p(e, t, d, y, g, S, c(o), c(s), h, f, l)
    }

    function y(t, n, r, i, s, o, a) {
        var f = t[0];
        var l = f.getContext("2d");
        u.$canvas = t;
        u.render(l, n, r, i, s, o, a, e.zoomFactor)
    }

    function S(e, t) {
        var n = e.getParent();
        var r = e.getDepth();
        var i = e.getPluginData("layout", "offset").x;
        var s = e.getPluginData("layout", "offset").y;
        t = t || e.getPluginData("style", "branchColor");
        var o = c(e);
        var u = c(n);
        var a = f(e);
        y(a, r, i, s, o, u, t)
    }

    function x(e) {
        function i() {
            if (n && t.commit) {
                t.commit(t.node, r.val())
            }
        }

        function o() {
            setTimeout(function() {
                e.redrawNodeConnectors(t.node)
            }, 1)
        }
        var t = this;
        var n = false;
        var r = $("<textarea/>", {
            id: "caption-editor",
            "class": "node-text-behaviour"
        }).bind("keydown", "esc", function() {
            t.stop()
        }).bind("keydown", "return", function() {
            i()
        }).mousedown(function(e) {
            e.stopPropagation()
        }).blur(function() {
            i()
        }).bind("input", function() {
            var n = s.getTextMetrics(t.node, e.zoomFactor, r.val());
            r.css(n);
            o()
        });
        this.edit = function(o, u) {
            if (n) {
                return
            }
            this.node = o;
            n = true;
            var a = o.getPluginData("image", "data");
            this.$text = h(o);
            this.$cancelArea = u;
            this.text = this.$text.text();
            this.$text.css({
                width: "auto",
                height: "auto"
            }).empty().addClass("edit");
            u.bind("mousedown.editNodeCaption", function(e) {
                i()
            });
            var f = s.getTextMetrics(t.node, e.zoomFactor, this.text);
            r.attr({
                value: this.text
            }).css(f).appendTo(this.$text).select();
            if (a) {
                if (a.align == "bottom") this.$text.css({
                    "padding-top": "0px",
                    "text-align": "center"
                });
                if (a.align == "top") this.$text.css({
                    height: f.fontH,
                    "padding-top": "" + this.zoomFactor * a.height + "px",
                    "text-align": "center"
                });
                if (a.align == "left") this.$text.css({
                    width: f.width,
                    height: f.height,
                    "padding-top": "0px",
                    "text-align": "right"
                });
                if (a.align == "center") this.$text.css({
                    width: f.width,
                    height: f.height,
                    "padding-top": "0px",
                    "text-align": "center"
                });
                if (a.align == "right") this.$text.css({
                    width: f.width,
                    height: f.height,
                    "padding-top": "0px",
                    "text-align": "left"
                })
            }
        };
        this.stop = function() {
            if (n) {
                n = false;
                this.$text.removeClass("edit");
                r.detach();
                this.$cancelArea.unbind("mousedown.editNodeCaption");
                e.setNodeText(this.node, this.text);
                o()
            }
        }
    }

    function T(e) {
        var t = this;
        var n = false;
        this.node = null;
        this.lineColor = null;
        var r = $("<div/>", {
            id: "creator-wrapper"
        }).bind("remove", function(e) {
            t.detach();
            e.stopImmediatePropagation();
            console.debug("creator detached.");
            return false
        });
        var i = $("<div/>", {
            id: "creator-nub"
        }).appendTo(r);
        var s = $("<div/>", {
            id: "creator-fakenode"
        }).appendTo(i);
        var o = $("<canvas/>", {
            id: "creator-canvas",
            "class": "line-canvas"
        }).hide().appendTo(r);
        r.draggable({
            revert: true,
            revertDuration: 0,
            start: function() {
                n = true;
                o.show();
                if (t.dragStarted) {
                    t.lineColor = t.dragStarted(t.node)
                }
            },
            drag: function(n, r) {
                var i = r.position.left / e.zoomFactor;
                var u = r.position.top / e.zoomFactor;
                var a = c(t.node);
                y(o, t.depth + 1, i, u, s, a, t.lineColor)
            },
            stop: function(i, s) {
                n = false;
                o.hide();
                if (t.dragStopped) {
                    var u = r.position();
                    var a = u.left / e.zoomFactor;
                    var f = u.top / e.zoomFactor;
                    var l = s.position.left / e.zoomFactor;
                    var c = s.position.top / e.zoomFactor;
                    var h = mindmaps.Util.distance(a - l, f - c);
                    t.dragStopped(t.node, l, c, h)
                }
                r.css({
                    left: "",
                    top: ""
                })
            }
        });
        this.attachToNode = function(t) {
            if (this.node === t) {
                return
            }
            this.node = t;
            r.removeClass("left right");
            if (t.getPluginData("layout", "offset").x > 0) {
                r.addClass("right")
            } else if (t.getPluginData("layout", "offset").x < 0) {
                r.addClass("left")
            }
            var n = c(t);
            this.depth = t.getDepth();
            var i = e.getLineWidth(n, this.depth + 1);
            s.css("border-bottom-width", i);
            r.appendTo(n)
        };
        this.detach = function() {
            r.detach();
            this.node = null
        };
        this.isDragging = function() {
            return n
        }
    }
    var e = this;
	var exx = this;
    var t = false;
    var n = new T(this);
    var i = new x(this);
    i.commit = function(t, n) {
        if (e.nodeCaptionEditCommitted) {
            e.nodeCaptionEditCommitted(t, n)
        }
    };
    var s = mindmaps.TextMetrics;
    var o = new mindmaps.CanvasConnectorDrawer;
    o.beforeDraw = function(e, t, n, r) {
        this.$canvas.attr({
            width: e,
            height: t
        }).css({
            left: n,
            top: r
        })
    };
    var u = new mindmaps.CanvasBranchDrawer;
    u.beforeDraw = function(e, t, n, r) {
        this.$canvas.attr({
            width: e,
            height: t
        }).css({
            left: n,
            top: r
        })
    };
    this.init = function() {
        a();
        this.center();
        var t = this.$getDrawingArea();
        t.addClass("mindmap");
        t.delegate("div.node-caption", "mousedown", function(t) {
            var n = $(this).parent().data("node");
            if (e.nodeMouseDown) {
                e.nodeMouseDown(n)
            }
        });
        t.delegate("div.node-caption", "mouseup", function(t) {
            var n = $(this).parent().data("node");
            if (e.nodeMouseUp) {
                e.nodeMouseUp(n)
            }
        });
        t.delegate("div.node-caption", "dblclick", function(t) {
            var n = $(this).parent().data("node");
            if (e.nodeDoubleClicked) {
                e.nodeDoubleClicked(n)
            }
        });
        t.delegate("div.node-container", "mouseover", function(t) {
            if (t.target === this) {
                var n = $(this).data("node");
                if (e.nodeMouseOver) {
                    e.nodeMouseOver(n)
                }
            }
            return false
        });
        t.delegate("div.node-caption", "mouseover", function(t) {
            if (t.target === this) {
                var n = $(this).parent().data("node");
                if (e.nodeCaptionMouseOver) {
                    e.nodeCaptionMouseOver(n)
                }
            }
            return false
        });
        this.$getContainer().bind("mousewheel", function(t) {
            var n = t.originalEvent.wheelDelta || -t.originalEvent.detail;
            if (e.mouseWheeled) {
                e.mouseWheeled(n)
            }
        });
        if (mindmaps.responsive.isTouchDevice) {
            this.$getContainer().hammer({}).bind("transform", function(t) {
                console.log(t);
                if (e.pinch) {
                    e.pinch(t.scale)
                }
            }).bind("dragstart", function(t) {
                window.xstart = e.$getContainer().scrollLeft();
                window.ystart = e.$getContainer().scrollTop();
                var n = t.originalEvent.touches;
                if (n.length == 1) {
                    var r = n[0].target;
                    if (r && r.className.search("node-caption") > -1 && r.className.search("root") <= -1) {
                        console.log("on node but no root");
                        window.dragOnNode = true;
                        window.dragTarget = r;
                        var i = $(r).parent();
                        window.beginDragX = i.position().left;
                        window.beginDragY = i.position().top
                    } else {
                        window.dragOnNode = false
                    }
                } else {
                    window.dragOnNode = false
                }
            }).bind("drag", function(t) {
                if (window.dragOnNode) {
                    var n = $(window.dragTarget).parent();
                    var r = n.data("node");
                    var i = window.beginDragX + t.distanceX;
                    var s = window.beginDragY + t.distanceY;
                    window.draggingLeft = i;
                    window.draggingTop = s;
                    n.css("left", i);
                    n.css("top", s);
                    var o = i / e.zoomFactor;
                    var u = s / e.zoomFactor;
                    var a = r.getPluginData("style", "branchColor");
                    var l = f(r);
                    var h = r.getDepth();
                    y(l, h, o, u, c(r), c(r.parent), a);
                    d(r, h, o, u);
                    if (e.nodeDragging) {
                        e.nodeDragging()
                    }
                } else {
                    var p = t.originalEvent.touches;
                    var v = p[0].target;
                    if (v.id == "drawing-area") {
                        var m = e.$getContainer();
                        m.scrollLeft(window.xstart - t.distanceX).scrollTop(window.ystart - t.distanceY)
                    }
                }
            }).bind("dragend", function(t) {
                if (window.dragOnNode) {
                    var n = $(window.dragTarget).parent();
                    var r = n.data("node");
                    if (e.nodeDragged) {
                        var i = new mindmaps.Point(window.draggingLeft / e.zoomFactor, window.draggingTop / e.zoomFactor);
                        e.nodeDragged(r, i)
                    }
                    window.dragOnNode = false
                }
            }).bind("doubletap", function(t) {
                e.tow_tap()
            }).bind("tap", function(t) {
                var n = t.originalEvent.touches;
                if (n.length == 1) {
                    var r = n[0].target;
                    if (r && r.className.search("node-caption") > -1) {
                        console.log("on node");
                        e.nodeMouseDown($(r).parent().data("node"))
                    }
                }
            })
        }
    };
    this.clear = function() {
        var e = this.$getDrawingArea();
        e.children().remove();
        e.width(0).height(0)
    };
    this.getLineWidth = function(e, t) {
        return mindmaps.CanvasDrawingUtil.getLineWidth(e, this.zoomFactor, t)
    };
    this.drawMap = function(t) {
        var n = (new Date).getTime();
        var r = this.$getDrawingArea();
        r.children().remove();
        var i = t.root;
        var s = false;
        if (s) {
            var o = r.parent();
            r.detach();
            e.createNode(i, r);
            r.appendTo(o)
        } else {
            e.createNode(i, r)
        }
        console.debug("draw map ms: ", (new Date).getTime() - n)
    };
    var b, w, E;
    this.createNode = function(n, r, i) {
        var o = n.getParent();
        var r = r || c(o);
        var i = i || n.getDepth();
        var u = n.getPluginData("layout", "offset");
        var a = u ? u.x : 0;
        var l = u ? u.y : 0;
        var h = $("<div/>", {
            id: "node-" + n.id,
            "class": "node-container"
        }).data({
            node: n
        }).css({
            "font-size": n.getPluginData("style", "font").size
        });
        h.appendTo(r);
        if (n.isRoot()) {
            var p = this.getLineWidth(h, i);
            h.css("border-bottom-width", p)
        }
        if (!n.isRoot()) {
            var v = this.getLineWidth(h, i);
            var m = n.getPluginData("style", "branchColor");
            var g = v + "px solid " + m;
            h.css({
                left: this.zoomFactor * a,
                top: this.zoomFactor * l,
                "border-bottom": g
            });
            h.one("mouseenter", function() {
                h.draggable({
                    handle: "div.node-caption:first",
                    start: function() {
                        t = true
                    },
                    drag: function(t, s) {
                        var o = s.position.left / e.zoomFactor;
                        var u = s.position.top / e.zoomFactor;
                        var a = n.getPluginData("style", "branchColor");
                        var l = f(n);
                        y(l, i, o, u, h, r, a);
                        b = n.id;
                        w = o;
                        E = u;
                        d(n, i, o, u, true);
                        if (e.nodeDragging) {
                            e.nodeDragging()
                        }
                    },
                    stop: function(r, i) {
                        t = false;
                        var s = new mindmaps.Point(i.position.left / e.zoomFactor, i.position.top / e.zoomFactor);
                        if (e.nodeDragged) {
                            e.nodeDragged(n, s)
                        }
                    }
                })
            })
        }
        var S = n.getPluginData("style", "font");
        var x = $("<div/>", {
            id: "node-caption-" + n.id,
            "class": "node-caption node-text-behaviour border",
            text: n.text.caption
        }).css({
            color: S.color,
            "font-size": this.zoomFactor * 100 + "%",
            "font-weight": S.weight,
            "font-style": S.style,
            "font-family": S.fontfamily,
            "text-decoration": S.decoration,
            "background-size": "40px 30px"
        }).appendTo(h);
        var T = s.getTextMetrics(n, this.zoomFactor);
        x.css(T);
        var N = $("<div/>", {
            id: "node-pluginIcons-" + n.id,
            "class": "node-pluginIcons"
        }).css("width", "100%");
        mindmaps.util.plugins.ui.createOnNode(N, n);
        var C = r.data("foldButton");
        var k = n.isRoot() || o.isRoot();
        if (!C && !k) {
            this.createFoldButton(o)
        }
        if (!n.isRoot()) {
            if (o.getPluginData("layout", "foldChildren")) {
                h.hide()
            } else {
                h.show()
            }
            var L = $("<canvas/>", {
                id: "node-canvas-" + n.id,
                "class": "line-canvas"
            });
            y(L, i, a, l, h, r, n.getPluginData("style", "branchColor"));
            L.appendTo(h)
        }
        var A = mindmaps.getConnectedNodes().filter(function(e) {
            return e.from == n.id
        });
        A.forEach(function(e) {
            if ($("#node-connector-canvas-" + e.from + "-" + e.canvasId).length <= 0) {
                var t = $("<canvas/>", {
                    id: "node-connector-canvas-" + e.from + "-" + e.canvasId,
                    "class": "line-canvas"
                });
                if ($("#node-" + e.from).length) t.appendTo($("#node-" + e.from))
            }
        });
        d(n, i, n.getPluginData("layout", "offset").x, n.getPluginData("layout", "offset").y);
        if (n.isRoot()) {
            h.children().andSelf().addClass("root")
        }
        n.forEachChild(function(t) {
            e.createNode(t, h, i + 1)
        });
        _.chain(mindmaps.plugins).each(function(e, t) {
            e.onCreateNode(n)
        })
        //this 3 statement created by ms to click on plugin icon
        $("#node-attachment-" + n.id).on('click', function() {
            exx.pluginclick($("#node-" + n.id).data("node"),'attachment');
        })
        $("#node-draw-" + n.id).on('click', function() {
            exx.pluginclick($("#node-" + n.id).data("node"),'draw');
        })
        $("#node-url-" + n.id).on('click', function() {
            exx.pluginclick($("#node-" + n.id).data("node"),'url');
        })
    };
    this.deleteNode = function(e) {
        var t = c(e);
        t.remove()
    };
    this.highlightNode = function(e) {
        var t = h(e);
        t.addClass("selected");
        this.updateNode(e);
        t.addClass("selected")
    };
    this.unhighlightNode = function(e) {
        var t = h(e);
        this.updateNode(e);
        t.removeClass("selected")
    };
    this.closeNode = function(e) {
        var t = c(e);
        t.children(".node-container").hide();
        var n = t.children(".button-fold").first();
        n.removeClass("open").addClass("closed")
    };
    this.openNode = function(e) {
        var t = c(e);
        t.children(".node-container").show();
        var n = t.children(".button-fold").first();
        n.removeClass("closed").addClass("open")
    };
    this.createFoldButton = function(t) {
        var n = t.getPluginData("layout", "offset").x > 0 ? " right" : " left";
        var r = t.getPluginData("layout", "foldChildren") ? " closed" : " open";
        var i = $("<div/>", {
            "class": "button-fold no-select" + r + n
        }).click(function(n) {
            if (e.foldButtonClicked) {
                e.foldButtonClicked(t)
            }
            n.preventDefault();
            return false
        });
        var s = c(t);
        s.data({
            foldButton: true
        }).append(i)
    };
    this.removeFoldButton = function(e) {
        var t = c(e);
        t.data({
            foldButton: false
        }).children(".button-fold").remove()
    };
    this.editNodeCaption = function(e) {
        i.edit(e, this.$getDrawingArea())
    };
    this.stopEditNodeCaption = function() {
        i.stop()
    };
    this.setNodeText = function(e, t) {
        var n = h(e);
        var r = s.getTextMetrics(e, this.zoomFactor, t);
        n.css(r).text(t);
        mindmaps.util.plugins.ui.placeOnNode(mindmaps.util.plugins.ui.pluginIcons(e), e)
    };
    this.getCreator = function() {
        return n
    };
    this.isNodeDragging = function() {
        return t
    };
    this.redrawNodeConnectors = function(e) {
        if (!e.isRoot()) {
            S(e)
        }
        if (!e.isLeaf()) {
            e.forEachChild(function(e) {
                S(e)
            })
        }
    };
    this.updateBranchColor = function(e, t) {
        var n = c(e);
        n.css("border-bottom-color", t);
        if (!e.isRoot()) {
            S(e, t)
        }
    };
    this.updateFontColor = function(e, t) {
        var n = h(e);
        n.css("color", t)
    };
    this.updateNode = function(e) {
        var t = this.selectedNode === e;
        var n = c(e);
        if (!n.length) return;
        var r = h(e);
        var i = e.getPluginData("style", "font");
        var o = e.getPluginData("style", "border") || {
            visible: true,
            style: "dashed",
            color: "#ffa500",
            background: "#ffffff"
        };
        var u = e.getPluginData("image", "data");
        if (u) {
            bkgrndsize = "" + this.zoomFactor * parseInt(u.width) + "px " + this.zoomFactor * parseInt(u.height) + "px";
            bkgrnd = "url('" + u.data + "') no-repeat " + u.align
        }
        var a = this.getLineWidth(n, e.getDepth());
        n.css({
            "font-size": i.size,
            "border-bottom-width": a,
            "border-bottom-color": e.getPluginData("style", "branchColor")
        });
        var f = s.getTextMetrics(e, this.zoomFactor);
        r.css({
            color: i.color,
            "font-weight": i.weight,
            "font-style": i.style,
            "font-family": i.fontfamily,
            "text-decoration": i.decoration,
            "background-color": o.background,
            background: "",
            "background-size": ""
        });
        if (u) {
            if (u.align == "top") r.css({
                width: f.width,
                height: f.height - this.zoomFactor * u.height,
                "padding-top": "" + this.zoomFactor * u.height + "px",
                "text-align": "center"
            });
            else if (u.align == "center") {
                r.css({
                    width: f.width,
                    height: f.height,
                    "padding-top": "0px",
                    "text-align": "center"
                });
                if (u.height > f.fontH) r.css({
                    "padding-top": "" + (f.height / 2 - f.fontH / 2 - 1) + "px",
                    height: f.height - (f.height / 2 - f.fontH / 2 - 1)
                })
            } else if (u.align == "bottom") r.css({
                width: f.width,
                height: f.height,
                "padding-top": "0px",
                "text-align": "center"
            });
            else if (u.align == "right") r.css({
                width: f.width,
                height: f.height - (f.height / 2 - f.fontH / 2 - 1),
                "padding-top": "" + (f.height / 2 - f.fontH / 2 - 1) + "px",
                "text-align": "left"
            });
            else if (u.align == "left") r.css({
                width: f.width,
                height: f.height - (f.height / 2 - f.fontH / 2 - 1),
                "padding-top": "" + (f.height / 2 - f.fontH / 2 - 1) + "px",
                "text-align": "right"
            })
        } else r.css({
            width: f.width,
            height: f.height,
            "padding-top": "0px",
            "text-align": "center"
        });
        if (u) {
            r.css("background", bkgrnd);
            r.css("background-size", bkgrndsize);
            r.css("background-color", o.background)
        } else r.css("background-color", o.background); {
            if (!o.visible && r.hasClass("border")) r.removeClass("border");
            if (o.visible && !r.hasClass("border")) r.addClass("border");
            if (o.visible) {
                var l = "#node-caption-" + e.id + ".border";
                $(l).css({
                    "border-style": o.style,
                    "border-color": o.color
                })
            }
            if (o.visible) {
                $("#inspector-button-border-show-hide span").text("Hide Border");
                $("#inspector-button-border-style").removeAttr("disabled");
                $("#inspector-border-color-picker").removeAttr("disabled")
            } else {
                $("#inspector-button-border-show-hide span").text("Show Border");
                $("#inspector-button-border-style").attr("disabled", "disabled");
                $("#inspector-border-color-picker").attr("disabled", "disabled")
            }
        }
        _.chain(mindmaps.plugins).sortBy("startOrder").each(function(n, r) {
            n.onNodeUpdate(e, t)
        });
        var p = $("#node-pluginIcons-" + e.id);
        mindmaps.util.plugins.ui.placeOnNode(p, e);
        this.redrawNodeConnectors(e);
        d(e, e.getDepth(), e.getPluginData("layout", "offset").x, e.getPluginData("layout", "offset").y)
    };
    this.positionNode = function(e) {
        var t = c(e);
        t.css({
            left: this.zoomFactor * e.getPluginData("layout", "offset").x,
            top: this.zoomFactor * e.getPluginData("layout", "offset").y
        });
        S(e)
    };
    this.scaleMap = function() {
        function f(n, r) {
            var i = c(n);
            var o = e.getLineWidth(i, r);
            i.css({
                left: t * n.getPluginData("layout", "offset").x,
                top: t * n.getPluginData("layout", "offset").y,
                "border-bottom-width": o
            });
            var u = h(n);
            u.css({
                "font-size": t * 100 + "%"
            });
            var a = s.getTextMetrics(n, e.zoomFactor);
            u.css(a);
            var l = $("#node-pluginIcons-" + n.id);
            mindmaps.util.plugins.ui.placeOnNode(l, n);
            l.css({
                "font-size": t * 100 + "%"
            });
            S(n);
            if (!n.isLeaf()) {
                n.forEachChild(function(e) {
                    f(e, r + 1)
                })
            }
        }
        var t = this.zoomFactor;
        var n = this.$getDrawingArea().children().first();
        var r = n.data("node");
        var i = this.getLineWidth(n, 0);
        n.css("border-bottom-width", i);
        var o = h(r);
        var u = s.getTextMetrics(r, this.zoomFactor);
        o.css({
            "font-size": t * 100 + "%",
            left: t * -mindmaps.TextMetrics.ROOT_CAPTION_MIN_WIDTH / 2
        }).css(u);
        var a = $("#node-pluginIcons-" + r.id);
        mindmaps.util.plugins.ui.placeOnNode(a, r);
        a.css({
            "font-size": t * 100 + "%"
        });
        r.forEachChild(function(e) {
            f(e, 1)
        })
    }
};
mindmaps.DefaultCanvasView.prototype = new mindmaps.CanvasView