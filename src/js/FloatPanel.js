mindmaps.FloatPanelFactory = function(e) {
    function s(s) {
        e.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
            n.forEach(function(e) {
                if (e.visible) {
                    e.ensurePosition()
                }
            })
        });
        var o = t.outerWidth();
        var u = t.offset().top;
        var a = s.width();
        var f = s.height();
        var l = n.reduce(function(e, t) {
            return e + t.height() + i
        }, 0);
        s.setPosition(o - a - r, u + i + l)
    }
    var t = e.getContent();
    var n = [];
    var r = 15;
    var i = 5;
    this.create = function(e, r) {
        var i = new mindmaps.FloatPanel(e, t, r);
        s(i);
        n.push(i);
        return i
    };
    this.bigPanel = function(e, r, i, o, u) {
        var a = new mindmaps.BigPanel(e, t, r, i, o, u);
        s(a);
        n.push(a);
        return a
    }
};
mindmaps.FloatPanel = function(e, t, n) {
    var r = this;
    var i = false;
    this.caption = e;
    this.visible = false;
    this.animationDuration = 200;
    this.setContent = function(e) {
        this.clearContent();
        $("div.ui-dialog-content", this.$widget).append(e)
    };
    this.clearContent = function() {
        $("div.ui-dialog-content", this.$widget).children().detach()
    };
    this.$widget = function() {
        var i = $("#template-float-panel").tmpl({
            title: e
        });
        i.find(".ui-dialog-titlebar-close").click(function() {
            r.hide()
        });
        if (n) {
            i.find(".ui-dialog-content").append(n)
        }
        i.draggable({
            containment: "parent",
            handle: "div.ui-dialog-titlebar",
            opacity: .75
        }).hide().appendTo(t);
        return i
    }();
    this.hide = function() {
        if (!i && this.visible) {
            this.visible = false;
            this.$widget.fadeOut(this.animationDuration * 1.5);
            if (this.$hideTarget) {
                this.transfer(this.$widget, this.$hideTarget)
            }
        }
    };
    this.show = function() {
        if (!i && !this.visible) {
            this.visible = true;
            this.$widget.fadeIn(this.animationDuration * 1.5);
            this.ensurePosition();
            if (this.$hideTarget) {
                this.transfer(this.$hideTarget, this.$widget)
            }
        }
    };
    this.toggle = function() {
        if (this.visible) {
            this.hide()
        } else {
            this.show()
        }
    };
    this.transfer = function(e, t) {
        i = true;
        var n = t.offset(),
            r = {
                top: n.top,
                left: n.left,
                height: t.innerHeight(),
                width: t.innerWidth()
            },
            s = e.offset(),
            o = $('<div class="ui-effects-transfer"></div>').appendTo(document.body).css({
                top: s.top,
                left: s.left,
                height: e.innerHeight(),
                width: e.innerWidth(),
                position: "absolute"
            }).animate(r, this.animationDuration, "linear", function() {
                o.remove();
                i = false
            })
    };
    this.width = function() {
        return this.$widget.outerWidth()
    };
    this.height = function() {
        return this.$widget.outerHeight()
    };
    this.offset = function() {
        return this.$widget.offset()
    };
    this.setPosition = function(e, t) {
        this.$widget.offset({
            left: e,
            top: t
        })
    };
    this.ensurePosition = function() {
        console.log(this.$widget.offset().left);
        var e = t.outerWidth();
        var n = t.outerHeight();
        var r = t.offset().left;
        var i = t.offset().top;
        var s = this.width();
        var o = this.height();
        var u = this.offset().left;
        var a = this.offset().top;
        if (e + r < s + u && e >= s) {
            this.setPosition(e + r - s, a)
        }
        if (n + i < o + a && n >= o) {
            this.setPosition(u, n + i - o)
        }
    };
    this.setHideTarget = function(e) {
        this.$hideTarget = e
    }
};
mindmaps.BigPanel = function(e, t, n, r, i, s) {
    var o = this;
    var u = false;
    this.caption = e;
    this.visible = false;
    this.animationDuration = 200;
    this.$container = t;
    this.showCallBack = i;
    this.hideCallBack = s;
    this.setContent = function(e) {
        this.clearContent();
        $("div.ui-dialog-content", this.$widget).append(e)
    };
    this.clearContent = function() {
        $("div.ui-dialog-content", this.$widget).children().detach()
    };
    this.$widget = function() {
        var e = $("#template-big-panel").tmpl();
        if (n) {
            e.find(".ui-dialog-content").append(n)
        }
        e.css("opacity", .75).css("border", "5px solid ");
        e.hide().appendTo(t);
        return e
    }();
    this.hide = function() {
        if (!u && this.visible) {
            this.visible = false;
            this.$widget.fadeOut(this.animationDuration * 1.5);
            if (this.$hideTarget) {
                this.transfer(this.$widget, this.$hideTarget)
            }
        }
        if (this.hideCallBack) this.hideCallBack()
    };
    this.show = function() {
        if (!u && !this.visible) {
            this.visible = true;
            this.$widget.fadeIn(this.animationDuration * 1.5);
            this.ensurePosition();
            if (this.$hideTarget) {
                this.transfer(this.$hideTarget, this.$widget)
            }
        }
        if (this.showCallBack) this.showCallBack()
    };
    this.toggle = function() {
        if (this.visible) {
            this.hide()
        } else {
            this.show()
        }
    };
    this.transfer = function(e, t) {
        u = true;
        var n = t.offset(),
            r = {
                top: n.top,
                left: n.left,
                height: t.innerHeight(),
                width: t.innerWidth()
            },
            i = e.offset(),
            s = $('<div class="ui-effects-transfer"></div>').appendTo(document.body).css({
                top: i.top,
                left: i.left,
                height: e.innerHeight(),
                width: e.innerWidth(),
                position: "absolute"
            }).animate(r, this.animationDuration, "linear", function() {
                s.remove();
                u = false
            })
    };
    this.width = function() {
        return this.$widget.outerWidth()
    };
    this.height = function() {
        return this.$widget.outerHeight()
    };
    this.offset = function() {
        return this.$widget.offset()
    };
    this.setPosition = function(e, t) {
        this.$widget.offset({
            left: e,
            top: t
        })
    };
    this.ensurePosition = function() {
        var e = o.$container.width();
        var t = o.$container.height();
        r.resize(e * .95, t * .95);
        o.setPosition(o.$container.offset().left + e * .02, o.$container.offset().top + t * .02);
        r.can.calcOffset()
    };
    this.setHideTarget = function(e) {
        this.$hideTarget = e
    }
}