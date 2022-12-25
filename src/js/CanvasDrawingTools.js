mindmaps.CanvasDrawingUtil = {
    getLineWidth: function(e, t, n) {
        var r = e;
        if (e.data) r = e.data().node;
        var i = t * (12 - n * 2);
        var s = 0;
        if (r !== undefined) {
            s = r.getLineWidthOffset()
        }
        i += s;
        if (i < 2) {
            i = 2
        }
        return i
    },
    roundedRect: function(t, n, r, i, s, o) {
        t.beginPath();
        t.moveTo(n, r + o);
        t.lineTo(n, r + s - o);
        t.quadraticCurveTo(n, r + s, n + o, r + s);
        t.lineTo(n + i - o, r + s);
        t.quadraticCurveTo(n + i, r + s, n + i, r + s - o);
        t.lineTo(n + i, r + o);
        t.quadraticCurveTo(n + i, r, n + i - o, r);
        t.lineTo(n + o, r);
        t.quadraticCurveTo(n, r, n, r + o);
        t.stroke();
        t.fill()
    }
};
mindmaps.CanvasConnectorDrawer = function() {
    this.beforeDraw = function(e, t, n, r) {};
    this.render = function(e, t, n, r, i, s, o, u, a, f, l, c) {
        function D(e, t) {
            try {
                e.setLineDash(t)
            } catch (n) {
                try {
                    e.mozDash = t
                } catch (n) {} finally {}
            } finally {}
        }

        function P(e, t, n, r) {
            this.x1 = e;
            this.y1 = t;
            this.x2 = n;
            this.y2 = r
        }
        e.save();
        i = i * f;
        s = s * f;
        n = n * f;
        r = r * f;
        n = n - i;
        r = r - s;
        offsetX = n;
        offsetY = r;
        var h = u.width();
        var p = o.width();
        var d = u.innerHeight();
        var v = o.innerHeight();
        var m, g;
        var y = false;
        var b, w, E, S;
        var x;
        var T = offsetX + p / 2 < h / 2;
        if (T) {
            var N = Math.abs(offsetX);
            if (N > p) {
                E = N - p + 1;
                b = p;
                m = true
            } else {
                b = -offsetX;
                E = p + offsetX;
                m = false;
                y = true
            }
        } else {
            if (offsetX > h) {
                E = offsetX - h + 1;
                b = h - offsetX;
                m = false
            } else {
                E = h - offsetX;
                b = 0;
                m = true;
                y = true
            }
        }
        var C = 5;
        var k = C / 2;
        if (E < C) {
            E = C
        }
        var L = offsetY + v < d;
        if (L) {
            w = v;
            S = -offsetY - w;
            g = true
        } else {
            w = d - offsetY;
            S = -w;
            g = false
        }
        var C = 5;
        var k = C / 2;
        if (S < C) {
            S = C
        }
        this.beforeDraw(E, S, b, w);
        var A, O, M, _;
        if (m) {
            A = 0;
            M = E
        } else {
            A = E;
            M = 0
        }
        if (g) {
            O = 0;
            _ = S
        } else {
            O = S;
            _ = 0
        }
        e.lineWidth = 1;
        e.strokeStyle = a;
        e.fillStyle = a;
        P.prototype.drawWithArrowheads = function(e, t) {
            e.strokeStyle = t;
            e.fillStyle = t;
            e.lineWidth = 2;
            e.beginPath();
            e.moveTo(this.x1, this.y1);
            e.lineTo(this.x2, this.y2);
            e.stroke();
            if (c == "2") {
                var n = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1));
                n += (this.x2 > this.x1 ? -90 : 90) * Math.PI / 180;
                this.drawArrowhead(e, this.x1, this.y1, n)
            }
            if (c == "2" || c == "1") {
                var r = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1));
                r += (this.x2 > this.x1 ? 90 : -90) * Math.PI / 180;
                this.drawArrowhead(e, this.x2, this.y2, r)
            }
        };
        P.prototype.drawArrowhead = function(e, t, n, r) {
            e.save();
            e.beginPath();
            e.translate(t, n);
            e.rotate(r);
            e.moveTo(0, 0);
            e.lineTo(5, 20);
            e.lineTo(-5, 20);
            e.closePath();
            e.restore();
            e.fill()
        };
        var H = A;
        var B = O;
        var j = M;
        var F = _;
        e.strokeStyle = a;
        if (l == "dashed") D(e, [8]);
        else if (l == "dotted") D(e, [3]);
        else if (l == "solid") D(e, [0]);
        var I = new P(H, B, j, F);
        I.drawWithArrowheads(e, a);
        e.restore()
    }
};
mindmaps.CanvasBranchDrawer = function() {
    this.beforeDraw = function(e, t, n, r) {};
    this.render = function(e, t, n, r, i, s, o, u) {
        n = n * u;
        r = r * u;
        var a = s.width();
        var f = i.width();
        var l = s.innerHeight();
        var c = i.innerHeight();
        var h, p;
        var d = false;
        var v, m, g, y;
        var b;
        var w = n + f / 2 < a / 2;
        if (w) {
            var E = Math.abs(n);
            if (E > f) {
                g = E - f + 1;
                v = f;
                h = true
            } else {
                v = -n;
                g = f + n;
                h = false;
                d = true
            }
        } else {
            if (n > a) {
                g = n - a + 1;
                v = a - n;
                h = false
            } else {
                g = a - n;
                v = 0;
                h = true;
                d = true
            }
        }
        var S = mindmaps.CanvasDrawingUtil.getLineWidth(i, u, t);
        var x = S / 2;
        if (g < S) {
            g = S
        }
        var T = r + c < l;
        if (T) {
            m = c;
            y = s.outerHeight() - r - m;
            p = true
        } else {
            m = l - r;
            y = i.outerHeight() - m;
            p = false
        }
        this.beforeDraw(g, y, v, m);
        var N, C, k, L;
        if (h) {
            N = 0;
            k = g
        } else {
            N = g;
            k = 0
        }
        var A = mindmaps.CanvasDrawingUtil.getLineWidth(s, u, t - 1);
        var O = (A - S) / 2;
        if (p) {
            C = 0 + x;
            L = y - x - O
        } else {
            C = y - x;
            L = 0 + x + O
        }
        if (!d) {
            var M = N > k ? N / 5 : k - k / 5;
            var _ = L;
            var D = Math.abs(N - k) / 2;
            var P = C
        } else {
            if (h) {
                N += x;
                k -= x
            } else {
                N -= x;
                k += x
            }
            var D = N;
            var P = Math.abs(C - L) / 2;
            var M = k;
            var _ = C > L ? C / 5 : L - L / 5
        }
        e.lineWidth = S;
        e.strokeStyle = o;
        e.fillStyle = o;
        e.beginPath();
        e.moveTo(N, C);
        e.bezierCurveTo(D, P, M, _, k, L);
        e.stroke();
        var H = N;
        var B = C;
        var j = k;
        var F = L;
        var I = false;
        if (I) {
            e.strokeStyle = "#ff0000";
            setLineDashCatch(e, [3]);
            e.moveTo(H, B);
            e.lineTo(j, F);
            e.lineWidth = 1;
            e.stroke();
            setLineDashCatch(e, [0]);
            e.beginPath();
            e.fillStyle = "red";
            e.arc(D, P, 4, 0, Math.PI * 2);
            e.fill();
            e.beginPath();
            e.fillStyle = "green";
            e.arc(M, _, 4, 0, Math.PI * 2);
            e.fill()
        }
    }
};
mindmaps.TextMetrics = function() {
    var e = $("<div/>", {
        "class": "node-text-behaviour"
    }).css({
        position: "absolute",
        visibility: "hidden",
        height: "auto",
        width: "auto"
    }).prependTo($("body"));
    return {
        ROOT_CAPTION_MIN_WIDTH: 100,
        NODE_CAPTION_MIN_WIDTH: 70,
        NODE_CAPTION_MAX_WIDTH: 150,
        getTextMetrics: function(t, n, r) {
            n = n || 1;
            r = r || t.getCaption();
            var i = t.getPluginData("style", "font");
            var s = t.getPluginData("image", "data");
            var o = t.isRoot() ? this.ROOT_CAPTION_MIN_WIDTH : this.NODE_CAPTION_MIN_WIDTH;
            var u = this.NODE_CAPTION_MAX_WIDTH;
            e.css({
                "font-size": n * i.size,
                "min-width": n * o,
                "font-family": i.fontfamily,
                "font-weight": i.weight
            }).text(r);
            if (s) {
                if (s.align == "top" || s.align == "bottom") {
                    var a = Math.max(e.width(), n * parseInt(s.width));
                    var f = e.height() + n * parseInt(s.height)
                } else if (s.align == "center") {
                    var a = Math.max(e.width(), n * parseInt(s.width));
                    var f = Math.max(e.height(), n * parseInt(s.height))
                } else if (s.align == "right" || s.align == "left") {
                    var a = e.width() + n * parseInt(s.width);
                    var f = Math.max(e.height(), n * parseInt(s.height))
                }
            } else {
                var a = e.width();
                var f = e.height()
            }
            var l = parseInt(a + 2);
            var c = parseInt(f + 2);
            return {
                width: l,
                height: c,
                fontW: e.width(),
                fontH: e.height()
            }
        }
    }
}()