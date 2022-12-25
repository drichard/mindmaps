mindmaps.ToolBarView = function() {
    var e = this;
    this.buttons = [];
    this.menus = [];
    this.init = function() {};
    this.ensureResponsive = function() {
        var t = mindmaps.responsive.isMiddleDevice();
        e.buttons.forEach(function(e) {
            e.setSmall(t)
        });
        e.menus.forEach(function(e) {
            e.setSmall(t)
        })
    };
    this.addButton = function(t, n) {
        e.buttons.push(t);
        n(t.asJquery())
    };
    this.addButtonGroup = function(t, n) {
        var r = $("<span/>");
        t.forEach(function(t) {
            e.buttons.push(t);
            r.append(t.asJquery())
        });
        r.buttonset();
        n(r)
    };
    this.addMenu = function(e) {
        this.menus.push(e);
        this.alignRight(e.getContent())
    };
    this.alignLeft = function(e) {
        e.appendTo("#toolbar .buttons-left")
    };
    this.alignRight = function(e) {
        e.appendTo("#toolbar .buttons-right")
    }
};
mindmaps.ToolBarButton = function(e) {
    this.command = e;
    var t = this;
    e.subscribe(mindmaps.Command.Event.ENABLED_CHANGED, function(e) {
        if (t.setEnabled) {
            t.setEnabled(e)
        }
    })
};
mindmaps.ToolBarButton.prototype.isEnabled = function() {
    return this.command.enabled
};
mindmaps.ToolBarButton.prototype.click = function() {
    this.command.execute()
};
mindmaps.ToolBarButton.prototype.getTitle = function() {
    return this.command.label
};
mindmaps.ToolBarButton.prototype.getToolTip = function() {
    var e = this.command.description;
    var t = this.command.shortcut;
    if (t) {
        if (Array.isArray(t)) {
            t = t.join(", ")
        }
        e += " [" + t.toUpperCase() + "]"
    }
    return e
};
mindmaps.ToolBarButton.prototype.getId = function() {
    return "button-" + this.command.id
};
mindmaps.ToolBarButton.prototype.asJquery = function() {
    var e = this;
    var t = $("<button/>", {
        id: this.getId(),
        title: this.getToolTip()
    }).click(function() {
        e.click()
    }).button({
        label: this.getTitle(),
        disabled: !this.isEnabled()
    });
    var n = this.command.icon;
    if (n) {
        t.button({
            icons: {
                primary: n
            }
        })
    }
    this.setEnabled = function(e) {
        t.button(e ? "enable" : "disable")
    };
    this.setSmall = function(e) {
        t.button({
            label: e ? this.getTitle().substr(0, 1) : this.getTitle()
        })
    };
    return t
};
mindmaps.ToolBarMenu = function(e, t) {
    this.title = e;
    var n = this;
    this.buttons = [];
    this.$menuWrapper = $("<span/>", {
        "class": "menu-wrapper"
    }).hover(function() {
        n.$menu.show()
    }, function() {
        n.$menu.hide()
    });
    this.setSmall = function(t) {
        n.$menuButton.button({
            label: t ? e.substr(0, 1) : e
        });
        n.buttons.forEach(function(e) {
            e.setSmall(t)
        })
    };
    this.$menuButton = $("<button/>").button({
        label: e,
        icons: {
            primary: t,
            secondary: "ui-icon-triangle-1-s"
        }
    }).appendTo(this.$menuWrapper);
    this.$menu = $("<div/>", {
        "class": "menu"
    }).click(function() {
        n.$menu.hide()
    }).appendTo(this.$menuWrapper);
    this.add = function(e) {
        if (!Array.isArray(e)) {
            e = [e]
        }
        e.forEach(function(e) {
            var t = e.asJquery().removeClass("ui-corner-all").addClass("menu-item");
            this.$menu.append(t);
            this.buttons.push(e)
        }, this);
        this.$menu.children().last().addClass("ui-corner-bottom").prev().removeClass("ui-corner-bottom")
    };
    this.getContent = function() {
        return this.$menuWrapper
    }
};
mindmaps.ToolBarPresenter = function(e, t, n, r, i) {
    function s(e) {
        var n = t.get(e);
        return new mindmaps.ToolBarButton(n)
    }

    function o(e) {
        return e.map(s)
    }

    function S() {
        i.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
            n.ensureResponsive()
        })
    }
    var u = [mindmaps.CreateNodeCommand, mindmaps.CreateSiblingNodeCommand, mindmaps.DeleteNodeCommand];
    var a = o(u);
    n.addButtonGroup(a, n.alignLeft);
    var f = [mindmaps.ShareMapCommand, mindmaps.ShareMapGoogleCommand];
    var l = o(f);
    n.addButtonGroup(l, n.alignLeft);
    var c = [mindmaps.SaveInstantDocumentCommand];
    var h = o(c);
    n.addButtonGroup(h, n.alignLeft);
    var p = new mindmaps.ToolBarMenu("Nodes", "ui-icon-document");
    var d = [mindmaps.CreateNodeCommand, mindmaps.CreateSiblingNodeCommand, mindmaps.DeleteNodeCommand, mindmaps.SelectParentNodeCommand, mindmaps.SelectChildFirstNodeCommand, mindmaps.SelectSiblingNextNodeCommand, mindmaps.SelectSiblingPrevNodeCommand];
    var v = o(d);
    p.add(v);
    n.addMenu(p);
    var m = new mindmaps.ToolBarMenu("Edit", "ui-icon-document");
    var g = [mindmaps.UndoCommand, mindmaps.RedoCommand, mindmaps.CopyNodeCommand, mindmaps.CutNodeCommand, mindmaps.PasteNodeCommand];
    var y = o(g);
    m.add(y);
    n.addMenu(m);
    var b = new mindmaps.ToolBarMenu("Document", "ui-icon-document");
    var w = [mindmaps.NewDocumentCommand, mindmaps.OpenDocumentCommand, mindmaps.SaveDocumentCommand, mindmaps.ShareMapCommand, mindmaps.ExportCommand, mindmaps.PrintCommand, mindmaps.CloseDocumentCommand];
    var E = o(w);
    b.add(E);
    n.addMenu(b);
    n.addButton(s(mindmaps.HelpCommand), n.alignRight);
    this.go = function() {
        n.init();
        n.ensureResponsive()
    };
    S()
}