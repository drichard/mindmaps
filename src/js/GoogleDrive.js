var apiKey = "",
    clientId = "",
    appId = "",
    defaultContentType = "application/json";
saveFile = function(o, t, n, e) {
    console.log("c. " + o);
    var r = t,
        i = jQuery.Deferred();
    console.log("b. " + o);
    var a = "-------314159265358979323846",
        s = "\r\n--" + a + "\r\n",
        l = defaultContentType;
    console.log("a. " + o);
    var c = {
            title: n,
            mimeType: l
        },
        d = s + "Content-Type: application/json\r\n\r\n" + JSON.stringify(c) + s + "Content-Type: " + l + "\r\n\r\n" + o + "\r\n---------314159265358979323846--";
    console.log("part ii " + o);
    var p = gapi.client.request({
        path: "/upload/drive/v2/files" + (r ? "/" + r : ""),
        method: r ? "PUT" : "POST",
        params: {
            uploadType: "multipart",
            useContentAsIndexableText: o.length < 131072
        },
        headers: {
            "Content-Type": "multipart/mixed; boundary='" + a + "'"
        },
        body: d
    });
    try {
        i.notify("sending to Google Drive cormar vi"), mindmaps.setInfoText("Saving to Google Drive..."), p.execute(function(e) {
            e.error ? (console.log("save errror"), 403 === e.error.code ? (!e.error.reason || "rateLimitExceeded" !== e.error.reason && "userRateLimitExceeded" !== e.error.reason ? i.reject("no-access-allowed") : i.reject("network-error"), mindmaps.setInfoText("Saving to Google Drive...Error")) : 401 === e.error.code ? checkAuth(!1).then(function() {
                saveFile(o, t, n).then(i.resolve, i.reject, i.notify)
            }, i.reject, i.notify) : (_.contains([404, 500, 502, 503, 504, -1], e.error.code) ? i.reject("network-error") : i.reject(e.error), mindmaps.setInfoText("Saving to Google Drive...Error"))) : (console.log("saved " + e.id), mindmaps.setInfoText("Saving to Google Drive...100%"), i.resolve(e.id, properties), mindmaps.currentMapId = "gd" + $.trim(e.id), window.location.hash = "m:gd" + $.trim(e.id), mindmaps.isMapLoadingConfirmationRequired = !1, mindmaps.ignoreHashChange = !0)
        })
    } catch (e) {
        i.reject("network-error", e.toString() + "\nstack: " + e.stack + "\nauth: " + JSON.stringify(gapi.auth.getToken()) + "\nnow: " + Date.now())
    }
    return i.promise()
}, downloadFile = function(e) {
    var o = jQuery.Deferred();
    if (downloadurl = "https://www.googleapis.com/drive/v2/files/" + e.id + "?alt=media", downloadurl) {
        var t = gapi.auth.getToken().access_token,
            n = new XMLHttpRequest;
        n.open("GET", downloadurl), n.setRequestHeader("Authorization", "Bearer " + t), n.onload = function() {
            console.log("at xml " + n.responseText), o.resolve(n.responseText)
        }, n.onerror = o.reject.bind(o, "network-error"), n.onprogress = function(e) {
            var o = e && e.loaded || 0,
                t = e && e.total || 1,
                n = e && e.loaded ? Math.round(100 * o / t) + "%" : e;
            e && e.loaded && mindmaps.setInfoText("Opening mindmap from Google Drive.." + n)
        }, n.send()
    } else o.reject("no-file-url");
    return o.promise()
}, loadFile = function(e) {
    console.log("loadFile");
    var o = jQuery.Deferred();
    return gapi.client.drive.files.get({
        fileId: e
    }).execute(function(e) {
        e.mimeType;
        e.error ? 403 === e.error.code ? o.reject("network-error") : 404 === e.error.code ? o.reject("no-access-allowed") : o.reject(e.error) : downloadFile(e).then(function(e) {
            console.log("cint " + e), o.resolve(e)
        }, o.reject, o.notify).progress(function() {
            console.log("progress sspp")
        })
    }), o.promise()
};
var checkAuth = function(e) {
    console.log("checkAuth");
    var o = jQuery.Deferred();
    return o.notify("Authenticating with Google"), mindmaps.setInfoText("Authenticating with Google"), gapi.auth.authorize({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/userinfo.profile",
        immediate: !e
    }, function(e) {
        e && !e.error ? (console.log("authenticated"), mindmaps.setInfoText("Authenticating with Google...Done"), o.resolve()) : (o.reject("not-authenticated"), console.log("not-authenticated"))
    }), o.promise()
};
authenticate = function(e) {
    console.log("authenticate");
    var o = jQuery.Deferred(),
        t = e ? "failed-authentication" : "not-authenticated";
    return checkAuth(e).then(o.resolve, function() {
        o.reject(t)
    }).progress(o.notify), o.promise()
}, loadApi = function(e) {
    console.log("loadApi"), window.gapi && window.gapi.client ? e() : (window.googleClientLoaded = e, jQuery('<script src="https://apis.google.com/js/client.js?onload=googleClientLoaded"><\/script>').appendTo("body"))
}, gapiAuthToken = function() {
    return window.gapi && gapi.auth && gapi.auth.getToken() && gapi.auth.getToken().access_token
}, makeReady = function(e) {
    console.log("makeReady");
    var o = jQuery.Deferred();
    return driveLoaded ? authenticate(e).then(o.resolve, o.reject, o.notify) : (o.notify("Loading Google APIs"), mindmaps.setInfoText("Loading Google Drive Interface"), loadApi(function() {
        o.notify("Loading Google Drive APIs"), mindmaps.setInfoText("Loading Google Drive Interface"), gapi.client.setApiKey(apiKey), gapi.client.load("drive", "v2", function() {
            driveLoaded = !0, authenticate(e).then(o.resolve, o.reject, o.notify)
        })
    })), o.promise()
}, saveMap = function(e, o, t) {
    console.log("saveMap");
    var n = jQuery.Deferred();
    return ready(t).then(function() {
        console.log("savomg " + o + " with id " + mindmaps.currentMapId.substr(2)), "g" == mindmaps.currentMapId[0] && "d" == mindmaps.currentMapId[1] ? saveFile(e, mindmaps.currentMapId.substr(2), o).then(n.resolve, n.reject, n.notify) : saveFile(e, null, o).then(n.resolve, n.reject, n.notify)
    }, n.reject), n.promise()
};
var driveLoaded, mapData, mapFilename, mapSaved = function(e) {},
    mapSaveFailed = function(e) {
        if ("no-access-allowed" === e) {
            var o = mindmaps.currentMapId;
            mindmaps.currentMapId = "new", console.log("current map id set new and retry"), saveMap(mapData, mapFilename, !0).then(mapSaved, function(e) {
                mindmaps.currentMapId = o, console.log("current map id set " + mindmaps.currentMapId), mapSaveFailed(e)
            })
        } else "failed-authentication" === e || "not-authenticated" === e ? $("#dialog-confirm-google-drive").dialog({
            resizable: !1,
            height: 200,
            width: 400,
            modal: !0,
            buttons: {
                Authorize: function() {
                    saveMap(mapData, mapFilename, !0).then(mapSaved, mapSaveFailed), $(this).dialog("close")
                },
                Cancel: function() {
                    $(this).dialog("close")
                }
            }
        }) : "file-too-large" === e ? (mindmaps.showErrorNotification("There was an error while saving map to Google Drive"), console.log("file-too-large")) : "user-cancel" === e ? (mindmaps.showErrorNotification("There was an error while saving map to Google Drive"), console.log("user-cancel")) : mindmaps.showErrorNotification("There was an error while saving map to Google Drive")
    },
    properties = {},
    isAuthorised = function() {
        return !!(window.gapi && gapi.auth && gapi.auth.getToken() && gapi.auth.getToken().access_token)
    },
    ready = function(e) {
        var o = jQuery.Deferred();
        return driveLoaded && isAuthorised() ? o.resolve() : makeReady(e).then(o.resolve, o.reject, o.notify), o.promise()
    };
mindmaps.GoogleDrive = function() {
    "use strict";
    return {
        saveDocument: function(e, o) {
            console.log("saveDocument"), mapData = e.serialize(), mapFilename = e.title + ".json", o.start(), saveMap(mapData, mapFilename, !1).then(mapSaved, mapSaveFailed)
        },
        loadMap: function(o, e) {
            console.log("loadMap");
            var t = jQuery.Deferred(),
                n = o;
            return ready(e).then(function() {
                loadFile(n).then(function(e) {
                    console.log("cnt " + e), t.resolve(e, o)
                }, t.reject)
            }, t.reject, t.notify), t.promise()
        },
        showSharingSettings: function(o) {
            console.log("showSharingSettings");

            function e() {
                var e = new gapi.drive.share.ShareClient(appId);
                e.setItemIds(o), e.showSettingsDialog()
            }
            gapi && gapi.drive && gapi.drive.share ? e() : ready(!1).done(function() {
                gapi.load("drive-share", e)
            })
        },
        showPicker: function(o, t, e) {
            console.log("showPicker");

            function n() {
                var e;
                console.log(i), (e = new google.picker.DocsView(google.picker.ViewId.DOCS)).setMimeTypes(o), e.setMode(google.picker.DocsViewMode.DOCS), (new google.picker.PickerBuilder).enableFeature(google.picker.Feature.NAV_HIDDEN).setAppId(appId).addView(e).setCallback(function(e) {
                    if ("picked" === e.action) return console.log("Picked Id is " + e.docs[0].id), void r.resolve(e.docs[0].id);
                    "cancel" === e.action && r.reject()
                }).setOAuthToken(gapiAuthToken()).setTitle(t).setSelectableMimeTypes(o).build().setVisible(!0)
            }
            var r = jQuery.Deferred(),
                i = window.location.protocol + "://" + window.location.host;
            return window.google && window.google.picker ? n() : ready(e).then(function() {
                console.log("is ready"), gapi.load("picker", n)
            }, r.reject, r.notify), r.promise()
        }
    }
}();