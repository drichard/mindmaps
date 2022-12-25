mindmaps.StatusBarView = function() {
    var e = this;
    var t = $("#statusbar");
    this.init = function() {};
    this.createButton = function(n, r) {
        return $("<button/>", {
            id: "statusbar-button-" + n
        }).button({
            label: r
        }).click(function() {
            if (e.buttonClicked) {
                e.buttonClicked(n)
            }
        }).prependTo(t.find(".buttons"))
    };
    this.getContent = function() {
        return t
    }
};
mindmaps.StatusBarPresenter = function(e, t) {
    var n = 0;
    var r = {};
    var i = new mindmaps.StatusNotificationController(e, t.getContent());
    t.buttonClicked = function(e) {
        _(r[e]).each(function(e) {
            e.toggle()
        })
    };
    this.go = function() {
        t.init()
    };
    this.addEntry = function(e) {
        var i = n++;
        var s = t.createButton(i, e.caption);
        e.setHideTarget(s);
        r[i] = [e]
    };
    this.addEntryN = function(e, i) {
        var s = n++;
        var o = t.createButton(s, i);
        _(e).each(function(e) {
            e.setHideTarget(o)
        });
        r[s] = e
    }
};
mindmaps.StatusNotificationController = function(e, t) {
    var n = $("<div class='notification-anchor'/>").css({
        position: "absolute",
        right: 20
    }).appendTo(t);
    e.subscribe(mindmaps.Event.DOCUMENT_SAVED, function() {
        var e = new mindmaps.Notification(n, {
            position: "topRight",
            expires: 2500,
            content: "Mind map saved"
        })
    });
    e.subscribe(mindmaps.Event.NOTIFICATION_INFO, function(e) {
        var t = new mindmaps.Notification(n, {
            position: "topRight",
            content: e,
            expires: 2500,
            type: "info"
        })
    });
    e.subscribe(mindmaps.Event.NOTIFICATION_WARN, function(e) {
        var t = new mindmaps.Notification(n, {
            position: "topRight",
            title: "Warning",
            content: e,
            expires: 3e3,
            type: "warn"
        })
    });
    e.subscribe(mindmaps.Event.NOTIFICATION_ERROR, function(e) {
        var t = new mindmaps.Notification(n, {
            position: "topRight",
            title: "Error",
            content: e,
            expires: 3500,
            type: "error"
        })
    })
}