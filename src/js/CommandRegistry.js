mindmaps.CommandRegistry = function(e) {
    function t(t) {
        if (t.shortcut && t.execute) {
            e.register(t.shortcut, t.execute.bind(t))
        }
    }

    function n(t) {
        if (t.shortcut) {
            e.unregister(t.shortcut)
        }
    }
    this.commands = {};
    this.get = function(n) {
        var r = this.commands[n];
        if (!r) {
            r = new n;
            this.commands[n] = r;
            if (e) {
                t(r)
            }
        }
        return r
    };
    this.remove = function(t) {
        var r = this.commands[t];
        if (!r) {
            return
        }
        delete this.commands[t];
        if (e) {
            n(r)
        }
    }
}