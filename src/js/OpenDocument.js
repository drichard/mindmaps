var mindmapModelCopy;
mindmaps.OpenDocumentView = function() {
    var e = this;
    var t = $("#template-open").tmpl().dialog({
        autoOpen: false,
        modal: true,
        zIndex: 5e3,
        width: 550,
        close: function() {
            $(this).dialog("destroy");
            $(this).remove()
        }
    });
    var n = $("#button-open-cloud").button().click(function() {
        if (e.openCloudButtonClicked) {
            e.openCloudButtonClicked()
        }
    });
    var r = $("#button-open-google-drive").button().click(function() {
        console.log("clicked gdrive");
        if (e.openGoogleDriveButtonClicked) {
            e.openGoogleDriveButtonClicked()
        }
    });
    var i = $("#button-open-storageserver").button().click(function() {
        if (e.openStorageServerButtonClicked) {
            e.openStorageServerButtonClicked()
        }
    });
    t.find(".file-chooser input").bind("change", function(t) {
        if (e.openExernalFileClicked) {
            e.openExernalFileClicked(t)
        }
    });
    var s = t.find(".localstorage-filelist");
    s.delegate("a.title", "click", function() {
        if (e.documentClicked) {
            var t = $(this).tmplItem();
            console.log("t1 " + t);
            console.log("changing");
            mindmaps.isMapLoadingConfirmationRequired = false;
            mindmaps.ignoreHashChange = true;
            mindmaps.currentMapId = "new-localstorage-offline";
            window.location.hash = "m:new-localstorage-offline";
            e.documentClicked(t.data);
            event.preventDefault()
        }
    }).delegate("a.delete", "click", function() {
        if (e.deleteDocumentClicked) {
            var t = $(this).tmplItem();
            e.deleteDocumentClicked(t.data)
        }
        event.preventDefault()
    });
    var o = t.find(".server-filelist");
    o.delegate("a.title", "click", function() {
        if (e.serverDocumentClicked) {
            var t = $(this).tmplItem();
            console.log("t" + $.trim(t.data.url));
            e.showStorageServerLoading();
            $.ajax({
                type: "POST",
                url: mindmaps.Config.MindMapListAddress,
                data: {
                    url: $.trim(t.data.url)
                }
            }).done(function(n) {
                e.hideStorageServerLoading();
                mindmaps.currentMapId = "mm" + $.trim(t.data.url);
                window.location.hash = "m:mm" + $.trim(t.data.url);
                mindmaps.isMapLoadingConfirmationRequired = false;
                mindmaps.ignoreHashChange = true;
                console.log("m:mm" + $.trim(t.data.url));
                console.log("shortening " + window.location);
                mindmaps.fireShortener(window.location);
                var r = mindmaps.Document.fromJSON(n);
                e.serverDocumentClicked(r)
            }).fail(function(t) {
                if (t.status == 413) e.showStorageServerError("Map not found on server.");
                else e.showStorageServerError("Network Error: Unable to fetch map.")
            })
        }
        event.preventDefault()
    }).delegate("a.delete", "click", function() {
        if (e.deleteServerDocumentClicked) {
            var t = $(this).tmplItem();
            localStorage.removeItem("mindmaps.serverurl." + t.data.id);
            e.deleteServerDocumentClicked(t.data.id)
        }
        event.preventDefault()
    });
    this.render = function(e) {
        console.log(e);
        var n = $(".document-list", t).empty();
        $("#template-open-table-item").tmpl(e, {
            format: function(e) {
                if (!e) return "";
                var t = e.getDate();
                var n = e.getMonth() + 1;
                var r = e.getFullYear();
                return t + "/" + n + "/" + r
            }
        }).appendTo(n)
    };
    this.renderServere = function(e) {
        var n = $(".server-document-list", t).empty();
        $("#template-open-table-item-server-urls").tmpl(e, {
            format: function(e) {
                if (!e) return "";
                var t = Date.parse(e);
                var n = t.getDate();
                var r = t.getMonth() + 1;
                var i = t.getFullYear();
                return n + "/" + r + "/" + i
            }
        }).appendTo(n)
    };
    this.showOpenDialog = function(e, n) {
        this.render(e);
        this.renderServere(n);
        t.dialog("open")
    };
    this.hideOpenDialog = function() {
        t.dialog("close")
    };
    this.showCloudError = function(e) {
        t.find(".cloud-loading").removeClass("loading");
        t.find(".cloud-error").text(e)
    };
    this.showCloudLoading = function() {
        t.find(".cloud-error").text("");
        t.find(".cloud-loading").addClass("loading")
    };
    this.hideCloudLoading = function() {
        t.find(".cloud-loading").removeClass("loading")
    };
    this.showGoogleDriveError = function(e) {
        t.find(".google-drive-loading").removeClass("loading");
        t.find(".google-drive-error").text(e)
    };
    this.showGoogleDriveLoading = function() {
        t.find(".google-drive-error").text("");
        t.find(".google-drive-loading").addClass("loading")
    };
    this.hideGoogleDriveLoading = function() {
        t.find(".google-drive-loading").removeClass("loading")
    };
    this.showStorageServerError = function(e) {
        t.find(".storageserver-loading").removeClass("loading");
        t.find(".storageserver-error").text(e)
    };
    this.showStorageServerLoading = function() {
        t.find(".storageserver-error").text("");
        t.find(".storageserver-loading").addClass("loading")
    };
    this.hideStorageServerLoading = function() {
        t.find(".storageserver-loading").removeClass("loading")
    }
};
mindmaps.OpenDocumentPresenter = function(e, t, n, r) {
    mindmapModelCopy = t;
    n.openCloudButtonClicked = function(e) {
        mindmaps.Util.trackEvent("Clicks", "cloud-open");
        r.open({
            load: function() {
                n.showCloudLoading()
            },
            success: function() {
                mindmaps.currentMapId = "new-import-cloud";
                window.location.hash = "m:new-import-cloud";
                mindmaps.isMapLoadingConfirmationRequired = false;
                mindmaps.ignoreHashChange = true;
                console.log("a" + mindmaps.currentMapId);
                if (n) n.hideOpenDialog()
            },
            error: function(e) {
                n.showCloudError(e)
            }
        })
    };
    n.openGoogleDriveButtonClicked = function(t) {
        deferred = jQuery.Deferred();
        parseDoc = function(t, r) {
            console.log("parseDoc  " + t + "   " + Object.prototype.toString.call(t));
            try {
                if (Object.prototype.toString.call(t) == "[object String]") {
                    console.log("parsing");
                    t = JSON.parse(t)
                }
                var i = mindmaps.Document.fromObject(t)
            } catch (s) {
                e.publish(mindmaps.Event.NOTIFICATION_ERROR, "File is not a valid mind map!");
                throw new Error("Error while parsing map from google drive", s)
            }
            n.googleDriveDocumentClicked(i);
            mindmaps.currentMapId = "gd" + $.trim(r);
            window.location.hash = "m:gd" + $.trim(r);
            mindmaps.isMapLoadingConfirmationRequired = false;
            mindmaps.ignoreHashChange = true
        };
        n.hideOpenDialog();
        showAuthentication = function(e) {
            console.log("showAuthentication");
            if (e !== "not-authenticated") {
                return
            }
            $("#dialog-confirm-google-drive").dialog({
                resizable: false,
                height: 200,
                width: 400,
                modal: true,
                buttons: {
                    Authorize: function() {
                        mindmaps.GoogleDrive.showPicker("application/json", "Select a mindmap to open", true).then(function(e) {
                            mindmaps.setInfoText("Opening mindmap from Google Drive");
                            mindmaps.GoogleDrive.loadMap(e).then(parseDoc, deferred.reject)
                        }, deferred.reject, deferred.notify);
                        $(this).dialog("close")
                    },
                    Cancel: function() {
                        $(this).dialog("close")
                    }
                }
            })
        };
        mindmaps.GoogleDrive.showPicker("application/json", "Pick a file", false).then(function(e) {
            mindmaps.setInfoText("Opening mindmap from Google Drive");
            mindmaps.GoogleDrive.loadMap(e).then(parseDoc, deferred.reject)
        }, showAuthentication, deferred.notify)
    };
    n.openStorageServerButtonClicked = function(e) {
        mindmaps.Util.trackEvent("Clicks", "storageserver-open");
        var r = mindmaps.ServerStorage.loadDocument({
            start: function() {
                n.showStorageServerLoading()
            },
            success: function(e) {
                t.setDocument(e);
                n.hideOpenDialog()
            },
            error: function() {
                var e = "Error while loading from storage server.";
                n.showStorageServerError(e)
            }
        })
    };
    n.openExernalFileClicked = function(r) {
        mindmaps.Util.trackEvent("Clicks", "hdd-open");
        var i = r.target.files;
        var s = i[0];
        var o = new FileReader;
        o.onload = function() {
            try {
                console.log(o.result);
                var r = mindmaps.Document.fromJSON(o.result)
            } catch (i) {
                e.publish(mindmaps.Event.NOTIFICATION_ERROR, "File is not a valid mind map!");
                throw new Error("Error while opening map from hdd", i)
            }
            t.setDocument(r);
            mindmaps.currentMapId = "new-import-file";
            window.location.hash = "m:new-import-file";
            mindmaps.isMapLoadingConfirmationRequired = false;
            mindmaps.ignoreHashChange = true;
            n.hideOpenDialog()
        };
        o.readAsText(s)
    };
    n.documentClicked = function(e) {
        mindmaps.Util.trackEvent("Clicks", "localstorage-open");
        t.setDocument(e);
        n.hideOpenDialog()
    };
    n.serverDocumentClicked = function(e) {
        mindmaps.Util.trackEvent("Clicks", "server-open");
        t.setDocument(e);
        n.hideOpenDialog()
    };
    n.googleDriveDocumentClicked = function(e) {
        t.setDocument(e)
    };
    n.deleteDocumentClicked = function(e) {
        mindmaps.LocalDocumentStorage.deleteDocument(e);
        var t = mindmaps.LocalDocumentStorage.getDocuments();
        n.render(t)
    };
    n.deleteServerDocumentClicked = function(e) {
        mindmaps.ServerStorage.deleteDocument(e, {
            success: function() {
                var e = mindmaps.LocalDocumentStorage.getDocuments();
                e.sort(mindmaps.Document.sortByModifiedDateDescending);
                mindmaps.ServerStorage.getDocuments({
                    success: function(t) {
                        t.sort(mindmaps.Document.sortByModifiedDateDescending);
                        n.showOpenDialog(e, t)
                    },
                    start: function() {},
                    error: function() {}
                })
            },
            start: function() {},
            error: function() {}
        })
    };
    this.go = function() {
        var e = mindmaps.LocalDocumentStorage.getDocuments();
        e.sort(mindmaps.Document.sortByModifiedDateDescending);
        mindmaps.ServerStorage.getDocuments({
            success: function(t) {
                t.sort(mindmaps.Document.sortByModifiedDateDescendingCustom);
                n.showOpenDialog(e, t)
            },
            start: function() {},
            error: function() {
                n.showOpenDialog(e, [])
            }
        })
    }
}