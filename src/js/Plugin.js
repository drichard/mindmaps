mindmaps.plugins = mindmaps.plugins || {};
mindmaps.util = {
    plugins: {
        ui: {}
    }
};
mindmaps.util.plugins.ui.placeOnNode = function(e, t) {
    var n = $("#node-caption-" + t.id);
    if (t.isRoot()) {
        e.css({
            left: 0,
            width: n.width(),
            top: "-1.4em"
        })
    } else {
        e.css({
            left: n.width() + 10,
            width: n.width()
        })
    }
};
mindmaps.util.plugins.ui.createOnNode = function(e, t) {
    var n = $("#node-" + t.id);
    var r = $("#node-caption-" + t.id);
    e.css({
        position: "absolute",
        top: 0,
        "z-index": 100
    }).appendTo(n);
    mindmaps.util.plugins.ui.placeOnNode(e, t)
};
mindmaps.util.plugins.ui.addIcon = function(e, t, n) {
    var r = function(e, t) {
        var n = $("#node-pluginIcons-" + t.id);
        n.append(e.css("float", "left").css("margin", "0.1em"))
    };
    var i = $("<div>", {
        id: "node-" + e + "-" + t.id
    }).append($("<i>", {
        "class": "icon-" + n
    })).hover(function() {
        $(this).stop().animate({
            marginTop: "-0.2em"
        }, 100)
    }, function() {
        $(this).stop().animate({
            marginTop: "0"
        }, 200)
    });
    r(i, t);
    mindmaps.util.plugins.ui.iconState(e, t, "hide")
};
mindmaps.util.plugins.ui.iconState = function(e, t, n) {
    var r = $("#node-" + e + "-" + t.id);
    if (n == "hide") {
        r.hide()
    } else if (n == "shine") {
        r.css("color", "#31A1DF").show()
    } else if (n == "normal") {
        r.css("color", "#000").show()
    }
};
mindmaps.util.plugins.ui.pluginIcons = function(e) {
    return $("#node-pluginIcons-" + e.id)
}