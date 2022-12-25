mindmaps.ShortcutController = function() {
    function e(e, t) {
        t = t || "keydown";
        return t + "." + e
    }
    this.shortcuts = {};
    this.register = function(t, n, r) {
        if (!Array.isArray(t)) {
            t = [t]
        }
        var i = this;
        t.forEach(function(t) {
            r = e(t, r);
            $(document).bind(r, t, function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                n();
                return false;
                i.shortcut[r] = true
            })
        })
    };
    this.unregister = function(t, n) {
        n = e(t, n);
        $(document).unbind(n);
        delete this.shortcuts[n]
    };
    this.unregisterAll = function() {
        for (var e in shortcuts) {
            $(document).unbind(e)
        }
    }
}