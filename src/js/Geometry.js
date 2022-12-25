mindmaps.Geometry = function(e) {
    var t = function(t) {
        return _.chain(e.getMindMap().nodes.nodes).map(function(e) {
            return [e.id, n(e, t)]
        }).object().value()
    };
    var n = function(e, t) {
        var n = $("#node-" + e.id);
        var r = $("#node-caption-" + e.id);
        var i = n.offset().top;
        var s = r.height();
        var o = n.offset().left;
        var u = r.width();
        var a = {
            y: i + s * .5,
            x: o
        };
        var f = {
            y: i + s,
            x: o + u * .5
        };
        var l = {
            y: i + s * .5,
            x: o + u
        };
        var c = {
            y: i,
            x: o + u * .5
        };
        return _.chain({
            w: a,
            s: f,
            e: l,
            n: c,
            c: {
                x: c.x,
                y: a.y
            },
            wn: {
                x: a.x,
                y: c.y
            },
            en: {
                x: l.x,
                y: c.y
            },
            ws: {
                x: a.x,
                y: f.y
            },
            es: {
                x: l.x,
                y: f.y
            }
        }).pairs().map(function(e) {
            return [e[0], t(e[1])]
        }).object().value()
    };
    var r = function(e, t, n) {
        return t[n].y <= e.c.y
    };
    var i = function(e, t) {
        return Math.atan2(-t.y + e.y, t.x - e.x)
    };
    var s = function(e, t) {
        var n = Math.PI;
        var r, i;
        if (e.start <= t.start) {
            r = e;
            i = t
        } else {
            r = t;
            i = e
        }
        if (i.start <= r.end) {
            return true
        } else if (r.start + 2 * n <= i.end) {
            return true
        } else {
            return false
        }
    };
    var o = function(e, t) {
        var n = Math.PI / 6;
        var r = {
            start: Math.PI / 2 - n,
            end: Math.PI / 2 + n
        };
        var o = {
            end: i(e.c, t.ws),
            start: i(e.c, t.es)
        };
        var u = {
            end: i(e.c, t.wn),
            start: i(e.c, t.en)
        };
        return s(r, o) || s(r, u)
    };
    var u = function(n, i) {
        var s = t(a[i]);
        var u = s[n.id];
        var f = _.chain(s).pairs().filter(function(e) {
            var t = e[0];
            var s = e[1];
            return t !== n.id && r(u, s, i) && o(u, s)
        });
        var l = f.sortBy(function(e) {
            return -e[1].n.y + u.n.y
        }).head().value();
        return l ? e.getMindMap().nodes.nodes[l[0]] : null
    };
    var a = {
        s: function(e) {
            return {
                x: e.x,
                y: e.y
            }
        },
        n: function(e) {
            return {
                x: e.x,
                y: -e.y
            }
        },
        e: function(e) {
            return {
                x: e.y,
                y: e.x
            }
        },
        w: function(e) {
            return {
                x: -e.y,
                y: -e.x
            }
        }
    };
    this.up = function(e) {
        return u(e, "s")
    };
    this.down = function(e) {
        return u(e, "n")
    };
    this.left = function(e) {
        return u(e, "e")
    };
    this.right = function(e) {
        return u(e, "w")
    };
    var f = function(e, t) {
        return Math.sqrt(l(e, t))
    };
    var l = function(e, t) {
        return Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2)
    };
    this.newChildPosition = function(e) {
        function n(e) {
            return _.reduce(e, function(e, t) {
                return e + t
            }, 0) / e.length
        }
        var t = 50;
        var r = _.chain(e.children.nodes).map(function(e) {
            var t = $("#node-" + e.id);
            var n = $("#node-caption-" + e.id);
            return {
                y: t.position().top,
                x: t.position().left
            }
        }).value();
        if (r.length == 0) {
            return {
                x: 150,
                y: -t
            }
        } else if (r.length == 1) {
            var i = r[0];
            return {
                x: i.x,
                y: i.y + t
            }
        } else {
            var s = _(r).pluck("x");
            var o = _(r).pluck("y");
            return {
                x: n(s),
                y: _(o).max() + t
            }
        }
    }
}