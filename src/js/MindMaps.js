"use strict";

function removeEventLayerXY() {
    var e = $.event.props,
        t = e.length,
        n = [];
    while (t--) {
        var r = e[t];
        if (r != "layerX" && r != "layerY") n.push(r)
    }
    $.event.props = n
}

function trackErrors() {}

function setupConsole() {
    var e = function() {};
    var t = window.console || {};
    ["log", "info", "debug", "warn", "error"].forEach(function(n) {
        t[n] = t[n] || e
    });
    if (!mindmaps.DEBUG) {
        t.debug = e;
        t.info = e;
        t.log = e;
        t.warn = e;
        t.error = function(e) {
            window.alert("Error: " + e)
        }
    }
    window.console = t
}

function createECMA5Shims() {
    if (!Function.prototype.bind) {
        var e = Array.prototype.slice;
        Function.prototype.bind = function(n) {
            function s() {
                if (this instanceof s) {
                    var t = Object.create(r.prototype);
                    r.apply(t, i.concat(e.call(arguments)));
                    return t
                } else {
                    return r.call.apply(r, i.concat(e.call(arguments)))
                }
            }
            var r = this;
            if (typeof r.apply !== "function" || typeof r.call !== "function") return new TypeError;
            var i = e.call(arguments);
            s.length = typeof r === "function" ? Math.max(r.length - i.length, 0) : 0;
            return s
        }
    }
    if (!Array.isArray) {
        Array.isArray = function(t) {
            return Object.prototype.toString.call(t) === "[object Array]"
        }
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(t, n) {
            var r = +this.length;
            for (var i = 0; i < r; i++) {
                if (i in this) {
                    t.call(n, this[i], i, this)
                }
            }
        }
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(t) {
            var n = +this.length;
            if (typeof t !== "function") throw new TypeError;
            var r = new Array(n);
            var i = arguments[1];
            for (var s = 0; s < n; s++) {
                if (s in this) r[s] = t.call(i, this[s], s, this)
            }
            return r
        }
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(t) {
            var n = [];
            var r = arguments[1];
            for (var i = 0; i < this.length; i++)
                if (t.call(r, this[i])) n.push(this[i]);
            return n
        }
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function(t) {
            var n = arguments[1];
            for (var r = 0; r < this.length; r++)
                if (!t.call(n, this[r])) return false;
            return true
        }
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function(t) {
            var n = arguments[1];
            for (var r = 0; r < this.length; r++)
                if (t.call(n, this[r])) return true;
            return false
        }
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(t) {
            var n = +this.length;
            if (typeof t !== "function") throw new TypeError;
            if (n === 0 && arguments.length === 1) throw new TypeError;
            var r = 0;
            if (arguments.length >= 2) {
                var i = arguments[1]
            } else {
                do {
                    if (r in this) {
                        i = this[r++];
                        break
                    }
                    if (++r >= n) throw new TypeError
                } while (true)
            }
            for (; r < n; r++) {
                if (r in this) i = t.call(null, i, this[r], r, this)
            }
            return i
        }
    }
    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function(t) {
            var n = +this.length;
            if (typeof t !== "function") throw new TypeError;
            if (n === 0 && arguments.length === 1) throw new TypeError;
            var r, i = n - 1;
            if (arguments.length >= 2) {
                r = arguments[1]
            } else {
                do {
                    if (i in this) {
                        r = this[i--];
                        break
                    }
                    if (--i < 0) throw new TypeError
                } while (true)
            }
            for (; i >= 0; i--) {
                if (i in this) r = t.call(null, r, this[i], i, this)
            }
            return r
        }
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(t) {
            var n = this.length;
            if (!n) return -1;
            var r = arguments[1] || 0;
            if (r >= n) return -1;
            if (r < 0) r += n;
            for (; r < n; r++) {
                if (!(r in this)) continue;
                if (t === this[r]) return r
            }
            return -1
        }
    }
    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function(t) {
            var n = this.length;
            if (!n) return -1;
            var r = arguments[1] || n;
            if (r < 0) r += n;
            r = Math.min(r, n - 1);
            for (; r >= 0; r--) {
                if (!(r in this)) continue;
                if (t === this[r]) return r
            }
            return -1
        }
    }
    if (!Date.now) {
        Date.now = function() {
            return (new Date).getTime()
        }
    }
}

function createHTML5Shims() {
    if (typeof window.localStorage == "undefined") {
        window.localStorage = {
            getItem: function() {
                return null
            },
            setItem: function() {},
            clear: function() {},
            removeItem: function() {},
            length: 0,
            key: function() {
                return null
            }
        }
    }
}
var mindmaps = mindmaps || {};
mindmaps.VERSION = "0.7.2";
mindmaps.currentMapId = "";
mindmaps.currentShortUrl = "";
mindmaps.isMapLoadingConfirmationRequired = false;
mindmaps.ignoreHashChange = false;
mindmaps.setInfoText = function(e) {
    $("#notification-info").html(e);
    setTimeout(function() {
        $("#notification-info").html("")
    }, 2500)
};
window.addEventListener("load", function(e) {
    window.applicationCache.addEventListener("updateready", function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            window.applicationCache.swapCache();
            window.onbeforeunload = null;
            if (confirm("A new version of the app is available. Load it?")) {
                window.location.reload()
            }
        } else {}
    }, false)
}, false);
$(function() {
    removeEventLayerXY();
    createECMA5Shims();
    createHTML5Shims();
    setupConsole();
    trackErrors();
    var e = new mindmaps.ApplicationController;
    e.go()
})