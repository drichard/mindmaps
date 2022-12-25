mindmaps.AutoSaveController = function(e, t) {
    function i() {
        console.debug("Autosaving...");
        t.saveToLocalStorage()
    }

    function s() {
        if (!r) {
            r = setInterval(i, n)
        }
    }

    function o() {
        if (r) {
            clearInterval(r);
            r = null
        }
    }
    var n = 1e3 * 60;
    var r = null;
    this.enable = function() {
        s();
        t.getDocument().setAutoSave(true)
    };
    this.disable = function() {
        o();
        t.getDocument().setAutoSave(false)
    };
    this.isEnabled = function() {
        return t.getDocument().isAutoSave()
    };
    this.init = function() {
        e.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened.bind(this));
        e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed.bind(this))
    };
    this.documentOpened = function(e) {
        if (this.isEnabled()) {
            s()
        }
    };
    this.documentClosed = function() {
        o()
    };
    this.init()
}