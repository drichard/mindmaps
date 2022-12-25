mindmaps.NavigatorView = function() {
    var e = this;
    var t = $("#template-navigator").tmpl();
    var n = t.children(".active").hide();
    var r = t.children(".inactive").hide();
    var i = $("#navi-canvas-overlay", t);
    var s = $("#navi-canvas", t);
    this.getContent = function() {
        return t
    };
    this.showActiveContent = function() {
        r.hide();
        n.show()
    };
    this.showInactiveContent = function() {
        n.hide();
        r.show()
    };
    this.setDraggerSize = function(e, t) {
        i.css({
            width: e,
            height: t
        })
    };
    this.setDraggerPosition = function(e, t) {
        i.css({
            left: e,
            top: t
        })
    };
    this.setCanvasHeight = function(e) {
        $("#navi-canvas", t).css({
            height: e
        })
    };
    this.getCanvasWidth = function() {
        return $("#navi-canvas", t).width()
    };
    this.init = function(n) {
        $("#navi-slider", t).slider({
            min: 0,
            max: 11,
            step: 1,
            value: 3,
            slide: function(t, n) {
                if (e.sliderChanged) {
                    e.sliderChanged(n.value)
                }
            }
        });
        $("#button-navi-zoom-in", t).button({
            text: false,
            icons: {
                primary: "ui-icon-zoomin"
            }
        }).click(function() {
            if (e.buttonZoomInClicked) {
                e.buttonZoomInClicked()
            }
        });
        $("#button-navi-zoom-out", t).button({
            text: false,
            icons: {
                primary: "ui-icon-zoomout"
            }
        }).click(function() {
            if (e.buttonZoomOutClicked) {
                e.buttonZoomOutClicked()
            }
        });
        i.draggable({
            containment: "parent",
            start: function(t, n) {
                if (e.dragStart) {
                    e.dragStart()
                }
            },
            drag: function(t, n) {
                if (e.dragging) {
                    var r = n.position.left;
                    var i = n.position.top;
                    e.dragging(r, i)
                }
            },
            stop: function(t, n) {
                if (e.dragStop) {
                    e.dragStop()
                }
            }
        })
    };
    this.draw = function(e, t) {
        function a(e) {
            return e / t
        }

        function f(e, t, n) {
            u.save();
            u.translate(t, n);
            if (!e.collapseChildren) {
                e.forEachChild(function(e) {
                    u.beginPath();
                    u.strokeStyle = e.getPluginData("style", "branchColor");
                    u.moveTo(0, 0);
                    var t = a(e.getPluginData("layout", "offset").x);
                    var n = a(e.getPluginData("layout", "offset").y);
                    var r = 5;
                    if (t < 0) {
                        var i = t + r;
                        var s = t
                    } else {
                        var i = t;
                        var s = t + r
                    }
                    u.lineTo(i, n);
                    u.lineTo(s, n);
                    u.stroke();
                    f(e, s, n)
                })
            }
            u.restore()
        }
        var n = e.root;
        var r = s[0];
        var i = r.width;
        var o = r.height;
        var u = r.getContext("2d");
        u.clearRect(0, 0, i, o);
        u.lineWidth = 1.8;
        f(n, i / 2, o / 2);
        u.fillRect(i / 2 - 4, o / 2 - 2, 8, 4)
    };
    this.showZoomLevel = function(e) {
        $("#navi-zoom-level").text(e)
    };
    this.setSliderValue = function(e) {
        $("#navi-slider").slider("value", e)
    }
};
mindmaps.NavigatorPresenter = function(e, t, n, r) {
    function c() {
        var e = s.width() / u;
        var n = s.height() / u;
        var r = e * a.x / f.x;
        var i = n * a.y / f.y;
        if (r > a.x) {
            r = a.x
        }
        if (i > a.y) {
            i = a.y
        }
        t.setDraggerSize(r, i)
    }

    function h() {
        var e = t.getCanvasWidth();
        var n = f.x / e;
        var r = f.y / n;
        t.setCanvasHeight(r);
        a.x = e;
        a.y = r
    }

    function p() {
        var e = s.scrollLeft() / u;
        var n = s.scrollTop() / u;
        var r = e * a.x / f.x;
        var i = n * a.y / f.y;
        t.setDraggerPosition(r, i)
    }

    function d() {
        var e = Math.round(u * 100) + " %";
        t.showZoomLevel(e)
    }

    function v() {
        var e = u / r.ZOOM_STEP - 1;
        t.setSliderValue(e)
    }

    function m(e) {
        f = e.dimensions;
        l = e.mindmap;
        h();
        p();
        c();
        d();
        v();
        g();
        t.showActiveContent();
        s.bind("scroll.navigator-view", function() {
            if (!o) {
                p()
            }
        })
    }

    function g() {
        if (f) {
            var e = f.x / a.x;
            t.draw(l, e)
        }
    }

    function y() {
        f = null;
        l = null;
        u = 1;
        s.unbind("scroll.navigator-view");
        t.showInactiveContent()
    }
    var i = this;
    var s = n.getContent();
    var o = false;
    var u = r.DEFAULT_ZOOM;
    var a = new mindmaps.Point;
    var f = null;
    var l = null;
    t.dragStart = function() {
        o = true
    };
    t.dragging = function(e, t) {
        var n = u * f.x * e / a.x;
        var r = u * f.y * t / a.y;
        s.scrollLeft(n).scrollTop(r)
    };
    t.dragStop = function() {
        o = false
    };
    t.buttonZoomInClicked = function() {
        r.zoomIn()
    };
    t.buttonZoomOutClicked = function() {
        r.zoomOut()
    };
    t.sliderChanged = function(e) {
        r.zoomTo((e + 1) * r.ZOOM_STEP)
    };
    n.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
        if (f) {
            c()
        }
    });
    e.subscribe(mindmaps.Event.DOCUMENT_OPENED, m);
    e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, y);
    e.subscribe(mindmaps.Event.NODE_MOVED, g);
    e.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, g);
    e.subscribe(mindmaps.Event.NODE_CREATED, g);
    e.subscribe(mindmaps.Event.NODE_DELETED, g);
    e.subscribe(mindmaps.Event.NODE_OPENED, g);
    e.subscribe(mindmaps.Event.NODE_CLOSED, g);
    e.subscribe(mindmaps.Event.ZOOM_CHANGED, function(e) {
        u = e;
        p();
        c();
        d();
        v()
    });
    this.go = function() {
        t.init();
        t.showInactiveContent()
    }
}