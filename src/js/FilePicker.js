mindmaps.FilePicker = function(e, t) {
    if (window.filepicker) {
        var n = window.filepicker;
        n.setKey("AOwfmt-sJTtu8XUog1YhEz");
        var r = "application/json";
        var i = {
            modal: true,
            zIndex: 1e4,
            services: [n.SERVICES.GOOGLE_DRIVE, n.SERVICES.DROPBOX, n.SERVICES.BOX, n.SERVICES.URL]
        };
        var s = {
            modal: true,
            zIndex: 1e4,
            services: [n.SERVICES.GOOGLE_DRIVE, n.SERVICES.DROPBOX, n.SERVICES.BOX]
        }
    }
    this.open = function(s) {
        s = s || {};
        if (!n || !navigator.onLine) {
            s.error && s.error("Cannot access cloud, it appears you are offline.");
            return
        }
        n.getFile(r, i, function(n, r) {
            s.load && s.load();
            $.ajax({
                url: n,
                success: function(n) {
                    try {
                        if (Object.prototype.toString.call(n) == "[object String]") {
                            n = JSON.parse(n)
                        }
                        var r = mindmaps.Document.fromObject(n)
                    } catch (i) {
                        e.publish(mindmaps.Event.NOTIFICATION_ERROR, "File is not a valid mind map!");
                        throw new Error("Error while parsing map from cloud", i)
                    }
                    t.setDocument(r);
                    if (s.success) {
                        s.success(r)
                    }
                },
                error: function(e, t, n) {
                    if (s.error) {
                        s.error("Error: Could not open mind map!")
                    }
                    throw new Error("Error while loading map from filepicker. " + t + " " + n)
                }
            })
        })
    };
    this.save = function(i) {
        i = i || {};
        if (!n || !navigator.onLine) {
            i.error && i.error("Cannot access cloud, it appears you are offline.");
            return
        }
        var o = t.getDocument();
        var u = o.prepareSave().serialize();
        var a = function(t) {
            console.log("saved to:", t);
            e.publish(mindmaps.Event.DOCUMENT_SAVED, o);
            if (i.success) {
                i.success()
            }
        };
        n.getUrlFromData(u, function(e) {
            n.saveAs(e, r, s, a)
        })
    }
}