mindmaps.GestureView = function() {
    var e = this;
    var t = $("#template-gesture").tmpl();
    this.getContent = function() {
        return t
    };
    this.init = function() {
        var t = this.getContent().get(0);
        t.addEventListener("touchstart", mindmaps.Util.touchHandler, true);
        t.addEventListener("touchmove", mindmaps.Util.touchHandler, true);
        t.addEventListener("touchend", mindmaps.Util.touchHandler, true);
        t.addEventListener("touchcancel", mindmaps.Util.touchHandler, true);
        var n = new Moousture.TopedLevenMatcher(2);
        _(e.gestures).each(function(e) {
            n.addGesture(e.seq, function(t) {
                if (t < .3) {
                    if (e.command.enabled) {
                        e.command.execute();
                        r(e.description + " - executed")
                    }
                } else return
            })
        });
        var r = function(e) {
            $("#gesture-log").append($("<div></div>").text(e));
            $("#gesture-log").animate({
                scrollTop: $("#gesture-log")[0].scrollHeight
            }, 1e3)
        };
        var i = new Moousture.MouseProbe(this.getContent().get(0));
        var s = new Moousture.Recorder({
            maxSteps: 20,
            matcher: n
        });
        var o = new Moousture.Monitor(30, 2);
        o.start(i, s);
        e.getContent().css("opacity", .8)
    }
};
mindmaps.GesturePresenter = function(e, t, n, r) {
    function i(e) {}
    this.go = function() {
        r.gestures = [{
            seq: [0, 2],
            command: n.get(mindmaps.CreateNodeCommand),
            description: "Create Child"
        }, {
            seq: [2, 4],
            command: n.get(mindmaps.CreateSiblingNodeCommand),
            description: "Create Sibling"
        }, {
            seq: [0],
            command: n.get(mindmaps.SelectRightNodeCommand),
            description: "Move Right"
        }, {
            seq: [2],
            command: n.get(mindmaps.SelectDownNodeCommand),
            description: "Move Down"
        }, {
            seq: [4],
            command: n.get(mindmaps.SelectLeftNodeCommand),
            description: "Move Left"
        }, {
            seq: [6],
            command: n.get(mindmaps.SelectUpNodeCommand),
            description: "Move Up"
        }];
        r.init()
    }
}