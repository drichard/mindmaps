mindmaps.Notification = function(e, t) {
    var n = this;
    t = $.extend({}, mindmaps.Notification.Defaults, t);
    var r = this.$el = $("#template-notification").tmpl(t).css({
        "max-width": t.maxWidth
    }).addClass(t.type);
    var i = $(e);
    if (i.length === 0) {
        return this
    }
    var s = i.offset();
    var o = s.left;
    var u = s.top;
    var a = i.outerWidth();
    var f = i.outerHeight();
    r.appendTo($("body"));
    var l = r.outerWidth();
    var c = r.outerHeight();
    var h, p;
    var d = t.padding;
    switch (t.position) {
        case "topLeft":
            p = u - d - c;
            h = o;
            break;
        case "topMiddle":
            p = u - d - c;
            if (l < a) {
                h = o + (a - l) / 2
            } else {
                h = o - (l - a) / 2
            }
            break;
        case "topRight":
            p = u - d - c;
            h = o + a - l;
            break;
        case "rightTop":
            p = u;
            break;
        case "rightMiddle":
            if (c < f) {
                p = u + (f - c) / 2
            } else {
                p = u - (c - f) / 2
            }
            h = o + d + a;
            break;
        case "rightBottom":
            p = u + f - c;
            h = o + d + a;
            break;
        case "bottomLeft":
            p = u + d + f;
            h = o;
            break;
        case "bottomMiddle":
            p = u + d + f;
            if (l < a) {
                h = o + (a - l) / 2
            } else {
                h = o - (l - a) / 2
            }
            break;
        case "bottomRight":
            p = u + d + f;
            h = o + a - l;
            break;
        case "leftTop":
            p = u;
            h = o - d - l;
            break;
        case "leftMiddle":
            if (c < f) {
                p = u + (f - c) / 2
            } else {
                p = u - (c - f) / 2
            }
            h = o - d - l;
            break;
        case "leftBottom":
            p = u + f - c;
            h = o - d - l;
            break
    }
    r.offset({
        left: h,
        top: p
    });
    if (t.expires) {
        setTimeout(function() {
            n.close()
        }, t.expires)
    }
    if (t.closeButton) {
        r.find(".close-button").click(function() {
            n.close()
        })
    }
    r.fadeIn(600)
};
mindmaps.Notification.prototype = {
    close: function() {
        var e = this.$el;
        e.fadeOut(800, function() {
            e.remove();
            this.removed = true
        })
    },
    isVisible: function() {
        return !this.removed
    },
    $: function() {
        return this.$el
    }
};
mindmaps.Notification.Defaults = {
    title: null,
    content: "New Notification",
    position: "topLeft",
    padding: 10,
    expires: 0,
    closeButton: false,
    maxWidth: 500,
    type: "info"
}