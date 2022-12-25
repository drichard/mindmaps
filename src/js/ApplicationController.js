var self;
mindmaps.ApplicationController = function() {
    function n() {
        g.getDocument();
        a();
        var n = new mindmaps.NewDocumentPresenter(c, g, new mindmaps.NewDocumentView);
        n.go()
    }

    function e() {
        if (mindmaps.isMapLoadingConfirmationRequired) $("#dialog-confirm").dialog({
            resizable: !1,
            height: 140,
            modal: !0,
            buttons: {
                Proceed: function() {
                    g.getDocument();
                    a();
                    var n = new mindmaps.NewDocumentPresenter(c, g, new mindmaps.NewDocumentView);
                    n.go(), $(this).dialog("close")
                },
                Cancel: function() {
                    $(this).dialog("close")
                }
            }
        });
        else {
            {
                g.getDocument()
            }
            a();
            var n = new mindmaps.NewDocumentPresenter(c, g, new mindmaps.NewDocumentView);
            n.go()
        }
    }

    function o() {
        var n = new mindmaps.SaveDocumentPresenter(c, g, new mindmaps.SaveDocumentView, f, w);
        n.go()
    }

    function a() {
        var n = g.getDocument();
        n && g.setDocument(null)
    }

    function t() {
        if ("m" == mindmaps.currentMapId[0] && "m" == mindmaps.currentMapId[1]) {
            var n = new mindmaps.ShareMapPresenter(new mindmaps.ShareMapView, g);
            n.go()
        } else c.publish(mindmaps.Event.NOTIFICATION_INFO, "Store the map in Server Storage to share it."), event.preventDefault()
    }

    function s() {
        "g" == mindmaps.currentMapId[0] && "d" == mindmaps.currentMapId[1] ? mindmaps.GoogleDrive.showSharingSettings(mindmaps.currentMapId.substr(2)) : (c.publish(mindmaps.Event.NOTIFICATION_INFO, "Store the map in Google Drive to share it."), event.preventDefault())
    }

    function r() {
        "g" == mindmaps.currentMapId[0] && "d" == mindmaps.currentMapId[1] ? (console.log("save instant google"), g.saveToGoogleDrive({
            start: function() {},
            success: function() {},
            error: function() {},
            notify: function() {}
        })) : "m" == mindmaps.currentMapId[0] && "m" == mindmaps.currentMapId[1] ? g.saveToStorageServer({
            start: function() {},
            success: function() {
                mindmaps.setInfoText("Saved Successfully")
            },
            error: function(n) {
                mindmaps.setInfoText(413 == n ? "Error while saving: File size more than 10MB" : "Network Error while saving to storage server")
            }
        }) : (mindmaps.setInfoText("Error: For quick saving maps in Google Drive Storage or Mindmaps Server Storage only"), event.preventDefault())
    }

    function m() {
        if (mindmaps.isMapLoadingConfirmationRequired) $("#dialog-confirm").dialog({
            resizable: !1,
            height: 140,
            modal: !0,
            buttons: {
                Proceed: function() {
                    var n = new mindmaps.OpenDocumentPresenter(c, g, new mindmaps.OpenDocumentView, w);
                    n.go(), $(this).dialog("close")
                },
                Cancel: function() {
                    $(this).dialog("close")
                }
            }
        });
        else {
            var n = new mindmaps.OpenDocumentPresenter(c, g, new mindmaps.OpenDocumentView, w);
            n.go()
        }
    }

    function d() {
        var n = new mindmaps.ExportMapPresenter(c, g, new mindmaps.ExportMapView);
        n.go()
    }
    mindmaps.connectStartNode = null, mindmaps.connectMode = !1, mindmaps.connectSelected = !1;
    var c = new mindmaps.EventBus,
        l = new mindmaps.ShortcutController,
        p = new mindmaps.CommandRegistry(l);
    mindmaps.ui = mindmaps.ui || {}, mindmaps.ui.commandRegistry = p;
    var u = new mindmaps.UndoController(c, p),
        g = new mindmaps.MindMapModel(c, p, u),
        h = new mindmaps.Geometry(g);
    mindmaps.ui.geometry = h;
    var f = (new mindmaps.ClipboardController(c, p, g), new mindmaps.HelpController(c, p), new mindmaps.PrintController(c, p, g), new mindmaps.AutoSaveController(c, g)),
        w = new mindmaps.FilePicker(c, g);
    self = this, mindmaps.getConnectedNodes = function() {
        return g.getDocument().getConnectedNodes()
    }, mindmaps.setConnectedNodes = function(n) {
        g.getDocument().setConnectedNodes(n)
    }, mindmaps.showErrorNotification = function(n) {
        c.publish(mindmaps.Event.NOTIFICATION_ERROR, n)
    }, mindmaps.addTwoNodes = function(n, e, o, a, t) {
        if (n.id == e.id) return !1;
        if (g.getDocument().getConnectedNodes().filter(function(o) {
                return o.from == n.id && o.to == e.id
            }).length > 0) return $("#node-connect-styles-row").show(), $("#inspector-button-connect-node-remove").show(), !1;
        if (g.getDocument().getConnectedNodes().filter(function(o) {
                return o.to == n.id && o.from == e.id
            }).length > 0) return $("#node-connect-styles-row").show(), $("#inspector-button-connect-node-remove").show(), !1;
        if (n.getParent() == e || e.getParent() == n) return mindmaps.connectSelected = !1, $("#node-connect-styles-row").hide(), $("#inspector-button-connect-node-remove").hide(), !1;
        if (filNodes = g.getDocument().getConnectedNodes().filter(function(e) {
                return e.from == n.id
            }), filNodes.length > 0) {
            for (newid = filNodes[0].canvasId, i = 1; i < filNodes.length; i++) newid < filNodes[i].canvasId && newid++;
            newid++
        } else newid = 1;
        var s = $("<canvas/>", {
            id: "node-connector-canvas-" + n.id + "-" + newid,
            "class": "line-canvas"
        });
        s.appendTo($("#node-" + n.id)), g.getDocument().addConnectedNode({
            from: n.id,
            to: e.id,
            canvasId: newid,
            style: o,
            color: a,
            arrow: t
        }), $("#node-connect-styles-row").show(), $("#inspector-button-connect-node-remove").show(), console.log("connection added")
    }, this.init = function() {
        var n = p.get(mindmaps.NewDocumentCommand);
        n.setHandler(e), n.setEnabled(!0);
        var i = p.get(mindmaps.ShareMapCommand);
        i.setHandler(t), i.setEnabled(!0);
        var l = p.get(mindmaps.SaveInstantDocumentCommand);
        l.setHandler(r), l.setEnabled(!0);
        var u = p.get(mindmaps.ShareMapGoogleCommand);
        u.setHandler(s), u.setEnabled(!0);
        var g = p.get(mindmaps.OpenDocumentCommand);
        g.setHandler(m), g.setEnabled(!0);
        var h = p.get(mindmaps.SaveDocumentCommand);
        h.setHandler(o);
        var f = p.get(mindmaps.CloseDocumentCommand);
        f.setHandler(a);
        var w = p.get(mindmaps.ExportCommand);
        w.setHandler(d), c.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
            h.setEnabled(!1), f.setEnabled(!1), w.setEnabled(!1), mindmaps.isMapLoadingConfirmationRequired = !1
        }), c.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
            h.setEnabled(!0), f.setEnabled(!0), w.setEnabled(!0), mindmaps.isMapLoadingConfirmationRequired = !1
        })
    }, self.loadMapFromHash = function(e) {
        var o = window.location.hash;
        console.log(o), "m" == o[1] && ":" == o[2] ? (console.log("storage serve a r"), "m" == o[3] && "m" == o[4] ? $.ajax({
            type: "POST",
            url: mindmaps.Config.MindMapListAddress,
            data: {
                url: o.substring(5)
            }
        }).done(function(n) {
            console.log("shortening " + window.location), mindmaps.fireShortener(window.location);
            var o = mindmaps.Document.fromJSON(n);
            g.setDocument(o), e.success()
        }).fail(function(n) {
            e.error(n.status)
        }) : "g" == o[3] && "d" == o[4] ? (parseDoc = function(n, e) {
            console.log("parseDoc  " + n + "   " + Object.prototype.toString.call(n));
            try {
                "[object String]" == Object.prototype.toString.call(n) && (console.log("parsing"), n = JSON.parse(n));
                var o = mindmaps.Document.fromObject(n)
            } catch (i) {
                throw c.publish(mindmaps.Event.NOTIFICATION_ERROR, "File is not a valid mind map!"), new Error("Error while parsing map from google drive", i)
            }
            g.setDocument(o), mindmaps.currentMapId = "gd" + $.trim(e), window.location.hash = "m:gd" + $.trim(e), mindmaps.isMapLoadingConfirmationRequired = !1, mindmaps.ignoreHashChange = !0
        }, showAuthentication = function(n) {
            return console.log("showAuthentication"), "not-authenticated" !== n ? (console.log(n), e.error(n), void console.log("returning")) : void $("#dialog-confirm-google-drive").dialog({
                resizable: !1,
                height: 200,
                width: 400,
                modal: !0,
                buttons: {
                    Authorize: function() {
                        $(this).dialog("close"), mindmaps.setInfoText("Opening mindmap from Google Drive"), mindmaps.GoogleDrive.loadMap(o.substring(5), !0).then(parseDoc, function(n) {
                            console.log(n), e.error(n)
                        })
                    },
                    Cancel: function() {
                        e.error("cancelled"), $(this).dialog("close")
                    }
                }
            })
        }, mindmaps.setInfoText("Opening mindmap from Google Drive"), mindmaps.GoogleDrive.loadMap(o.substring(5), !1).then(parseDoc, showAuthentication)) : "n" == o[3] && "e" == o[4] && "w" == o[5] ? (("n" != mindmaps.currentMapId[0] || "e" != mindmaps.currentMapId[1] || "w" != mindmaps.currentMapId[2]) && n(), e.success()) : e.error("invalid")) : e.error("invalid")
    }, this.go = function() {
        var e = new mindmaps.MainViewController(c, g, p);
        e.go(), _.chain(mindmaps.plugins).sortBy("startOrder").each(function(n) {
            n.onUIInit(c, g)
        }), window.location.hash.length > 0 ? self.loadMapFromHash({
            success: function() {
                mindmaps.currentMapId = window.location.hash.substring(3), window.location.hash = "m:" + mindmaps.currentMapId, mindmaps.isMapLoadingConfirmationRequired = !1, mindmaps.ignoreHashChange = !0
            },
            error: function(e) {
                "invalid" == e ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Map not found on server or Invalid map url.") : "no-access-allowed" == e ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "There was an error fetching map from Google Drive") : 413 == e ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Map not found on server.") : "cancelled" != e && c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Network Error: Unable to fetch map."), n()
            }
        }) : n()
    }, this.init(), c.subscribe(mindmaps.Event.DOCUMENT_SAVED, function() {
        mindmaps.isMapLoadingConfirmationRequired = !1
    }), self.hashChange = function() {
        console.log("new hash " + window.location.hash.length), $(function() {
            if (mindmaps.ignoreHashChange) {
                if (!mindmaps.isMapLoadingConfirmationRequired) return mindmaps.ignoreHashChange = !1, void console.log("ignoreHashChange");
                mindmaps.ignoreHashChange = !1, console.log("no ignoreHashChange")
            }
            var n = window.location.hash;
            n = n.substring(3), window.location.hash.length > 0 && (n != mindmaps.currentMapId && mindmaps.isMapLoadingConfirmationRequired ? $("#dialog-confirm").dialog({
                resizable: !1,
                height: 140,
                modal: !0,
                buttons: {
                    Proceed: function() {
                        self.loadMapFromHash({
                            success: function() {
                                mindmaps.currentMapId = window.location.hash.substring(3), window.location.hash = "m:" + mindmaps.currentMapId, mindmaps.isMapLoadingConfirmationRequired = !1, mindmaps.ignoreHashChange = !0
                            },
                            error: function(n) {
                                "invalid" == n ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Map not found on server or Invalid map url.") : "no-access-allowed" == n ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "There was an error fetching map from Google Drive") : 413 == n ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Map not found on server.") : c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Network Error: Unable to fetch map.")
                            }
                        }), $(this).dialog("close")
                    },
                    Cancel: function() {
                        $(this).dialog("close")
                    }
                }
            }) : self.loadMapFromHash({
                success: function() {
                    mindmaps.currentMapId = window.location.hash.substring(3), window.location.hash = "m:" + mindmaps.currentMapId, mindmaps.isMapLoadingConfirmationRequired = !1, mindmaps.ignoreHashChange = !0
                },
                error: function(n) {
                    "invalid" == n ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Map not found on server or Invalid map url.") : "no-access-allowed" == n ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "There was an error fetching map from Google Drive") : 413 == n ? c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Map not found on server.") : c.publish(mindmaps.Event.NOTIFICATION_ERROR, "Network Error: Unable to fetch map.")
                }
            }))
        })
    }, window.addEventListener("hashchange", self.hashChange)
};