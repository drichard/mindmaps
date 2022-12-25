mindmaps.InspectorView = function() {
    var e = this,
        o = $("#template-inspector").tmpl(),
        n = o.find("#inspector-button-font-face-change"),
        t = o.find("#inspector-button-connection-arrow-change"),
        c = o.find("#inspector-button-connection-style-change"),
        i = o.find("#inspector-button-border-style"),
        r = $("#inspector-button-font-size-decrease", o),
        d = $("#inspector-button-font-size-increase", o),
        l = $("#inspector-button-line-width-decrease", o),
        a = $("#inspector-button-line-width-increase", o),
        s = $("#inspector-button-border-show-hide", o),
        u = $("#inspector-checkbox-font-bold", o),
        C = $("#inspector-checkbox-font-italic", o),
        h = $("#inspector-checkbox-font-underline", o),
        f = $("#inspector-checkbox-font-linethrough", o),
        k = $("#inspector-button-branch-color-children", o),
        b = $("#inspector-button-font-color-children", o),
        p = $("#inspector-button-font-style-children", o),
        m = $("#inspector-button-font-face-children", o),
        v = $("#inspector-button-background-color-children", o),
        B = $("#inspector-button-border-style-children", o),
        g = $("#inspector-button-border-color-children", o),
        A = $("#inspector-button-connect-node", o),
        N = $("#inspector-button-connect-node-remove", o),
        S = $("#inspector-branch-color-picker", o),
        x = $("#inspector-font-color-picker", o),
        w = $("#inspector-border-color-picker", o),
        P = $("#inspector-connection-color-picker", o),
        y = $("#inspector-border-background-color-picker", o),
        E = [r, d, l, a, s, u, C, h, f, m, p, b, k, B, g, v, A, N],
        D = [S, x, w, y, P];
    this.getContent = function() {
        return o
    }, this.setControlsEnabled = function(e) {
        var o = e ? "enable" : "disable";
        E.forEach(function(e) {
            e.button(o)
        }), D.forEach(function(o) {
            o.attr("disabled", e)
        }), _.chain(mindmaps.plugins).sortBy("startOrder").each(function(o) {
            o.inspectorAdviser && o.inspectorAdviser.setControlsEnabled && o.inspectorAdviser.setControlsEnabled(e)
        })
    }, this.setBorderText = function(e) {
        e ? ($("#inspector-button-border-show-hide span").text("Hide Border"), $("#inspector-button-border-style").removeAttr("disabled")) : ($("#inspector-button-border-show-hide span").text("Show Border"), $("#inspector-button-border-style").attr("disabled", "disabled"))
    }, this.setBorderStyle = function(e) {
        i.val(e)
    }, this.setFontFace = function(e) {
        n.val(e)
    }, this.setConnectStyle = function(e) {
        c.val(e)
    }, this.setConnectArrow = function(e) {
        t.val(e)
    }, this.setBoldCheckboxState = function(e) {
        u.prop("checked", e).button("refresh")
    }, this.setItalicCheckboxState = function(e) {
        C.prop("checked", e).button("refresh")
    }, this.setUnderlineCheckboxState = function(e) {
        h.prop("checked", e).button("refresh")
    }, this.setLinethroughCheckboxState = function(e) {
        f.prop("checked", e).button("refresh")
    }, this.setBorderBackgroundColorPickerColor = function(e) {
        y.val(e).change()
    }, this.setBorderBackgroundColorPickerColor = function(e) {
        y.val(e).change()
    }, this.setBorderColorPickerColor = function(e) {
        w.val(e).change()
    }, this.setConnectColorPickerColor = function(e) {
        P.val(e).change()
    }, this.setBranchColorPickerColor = function(e) {
        S.val(e).change()
    }, this.setFontColorPickerColor = function(e) {
        x.val(e).change()
    }, this.init = function() {
        $(".buttonset", o).buttonset(), b.button(), p.button(), m.button(), k.button(), v.button(), g.button(), B.button(), A.button(), N.button(), n.change(function() {
            console.log(n.val()), e.fontfaceChangeClicked && e.fontfaceChangeClicked(n.val())
        }), c.change(function() {
            console.log(c.val()), e.connectStyleChangeClicked && e.connectStyleChangeClicked(c.val())
        }), t.change(function() {
            console.log(t.val()), e.connectArrowChangeClicked && e.connectArrowChangeClicked(t.val())
        }), i.change(function() {
            console.log(i.val()), e.borderStyleChangeClicked && e.borderStyleChangeClicked(i.val())
        }), r.click(function() {
            e.fontSizeDecreaseButtonClicked && e.fontSizeDecreaseButtonClicked()
        }), d.click(function() {
            e.fontSizeIncreaseButtonClicked && e.fontSizeIncreaseButtonClicked()
        }), l.click(function() {
            e.lineWidthDecreaseButtonClicked && e.lineWidthDecreaseButtonClicked()
        }), a.click(function() {
            e.lineWidthIncreaseButtonClicked && e.lineWidthIncreaseButtonClicked()
        }), u.click(function() {
            if (e.fontBoldCheckboxClicked) {
                var o = $(this).prop("checked");
                e.fontBoldCheckboxClicked(o)
            }
        }), s.click(function() {
            e.toggleBorderButtonClick && e.toggleBorderButtonClick()
        }), C.click(function() {
            if (e.fontItalicCheckboxClicked) {
                var o = $(this).prop("checked");
                e.fontItalicCheckboxClicked(o)
            }
        }), h.click(function() {
            if (e.fontUnderlineCheckboxClicked) {
                var o = $(this).prop("checked");
                e.fontUnderlineCheckboxClicked(o)
            }
        }), f.click(function() {
            if (e.fontLinethroughCheckboxClicked) {
                var o = $(this).prop("checked");
                e.fontLinethroughCheckboxClicked(o)
            }
        }), S.colorPicker({
            pickerDefault: mindmaps.Util.colors20[0],
            colors: mindmaps.Util.colors20
        }), S.change(function() {
            var o = $(this).val();
            o && e.branchColorPicked && e.branchColorPicked(o)
        }), y.colorPicker({
            pickerDefault: mindmaps.Util.colors20c[0],
            colors: mindmaps.Util.colors20c
        }), y.change(function() {
            var o = $(this).val();
            o && e.borderBackgroundColorPicked && e.borderBackgroundColorPicked(o)
        }), w.colorPicker({
            pickerDefault: mindmaps.Util.colors20b[0],
            colors: mindmaps.Util.colors20b
        }), w.change(function() {
            var o = $(this).val();
            o && e.borderColorPicked && e.borderColorPicked(o)
        }), P.colorPicker({
            pickerDefault: mindmaps.Util.colors20d[0],
            colors: mindmaps.Util.colors20d
        }), P.change(function() {
            var o = $(this).val();
            o && e.connectColorPicked && e.connectColorPicked(o)
        }), x.colorPicker({
            pickerDefault: mindmaps.Util.colors20[0],
            colors: mindmaps.Util.colors20
        }), x.change(function() {
            var o = $(this).val();
            o && e.fontColorPicked && e.fontColorPicked(o)
        }), v.click(function() {
            e.backgroundColorChildrenButtonClicked && e.backgroundColorChildrenButtonClicked()
        }), g.click(function() {
            e.borderColorChildrenButtonClicked && e.borderColorChildrenButtonClicked()
        }), B.click(function() {
            e.borderStyleChildrenButtonClicked && e.borderStyleChildrenButtonClicked()
        }), k.click(function() {
            e.branchColorChildrenButtonClicked && e.branchColorChildrenButtonClicked()
        }), b.click(function() {
            e.fontColorChildrenButtonClicked && e.fontColorChildrenButtonClicked()
        }), p.click(function() {
            e.fontStyleChildrenButtonClicked && e.fontStyleChildrenButtonClicked()
        }), m.click(function() {
            e.fontFaceChildrenButtonClicked && e.fontFaceChildrenButtonClicked()
        }), A.click(function() {
            e.connectNodeButtonClicked && e.connectNodeButtonClicked()
        }), N.click(function() {
            e.connectNodeRemoveButtonClicked && e.connectNodeRemoveButtonClicked()
        }), _.chain(mindmaps.plugins).sortBy("startOrder").each(function(e) {
            e.inspectorAdviser && e.inspectorAdviser.onInit && e.inspectorAdviser.onInit($("#inspector-table", o))
        })
    }
}, mindmaps.InspectorPresenter = function(e, o, n, t) {
    function c(e, o) {
        var n = mindmaps.getConnectedNodes().filter(function(n) {
            return n.from == e.id && n.to == o.id || n.from == o.id && n.to == e.id
        });
        n.length && (cfnode = n[0], t.setConnectStyle(cfnode.style), t.setConnectArrow(cfnode.arrow), t.setConnectColorPickerColor(cfnode.color))
    }

    function i(e) {
        var o = e.getPluginData("style", "font"),
            n = e.getPluginData("style", "border") || {
                visible: !0,
                style: "dashed",
                color: "#ffa500",
                background: "#ffffff"
            };
        t.setBorderStyle(n.style), t.setBorderText(n.visible ? !0 : !1), t.setBoldCheckboxState("bold" === o.weight), t.setFontFace(o.fontfamily), t.setItalicCheckboxState("italic" === o.style), t.setUnderlineCheckboxState("underline" === o.decoration), t.setLinethroughCheckboxState("line-through" === o.decoration), t.setFontColorPickerColor(o.color), t.setBorderColorPickerColor(n.color), t.setBorderBackgroundColorPickerColor(n.background), t.setBranchColorPickerColor(e.getPluginData("style", "branchColor"))
    }
    t.fontfaceChangeClicked = function(e) {
        var n = new mindmaps.action.ChangeNodeFontFaceAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.connectStyleChangeClicked = function(e) {
        var n = new mindmaps.action.SetConnectStyleAction(o.selectedNode, mindmaps.connectStartNode, e);
        o.executeAction(n)
    }, t.connectArrowChangeClicked = function(e) {
        console.log("arrow is " + e);
        var n = new mindmaps.action.SetConnectArrowAction(o.selectedNode, mindmaps.connectStartNode, e);
        o.executeAction(n)
    }, t.borderStyleChangeClicked = function(e) {
        var n = new mindmaps.action.ChangeNodeBorderStyleAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.fontSizeDecreaseButtonClicked = function() {
        var e = new mindmaps.action.DecreaseNodeFontSizeAction(o.selectedNode);
        o.executeAction(e)
    }, t.fontSizeIncreaseButtonClicked = function() {
        var e = new mindmaps.action.IncreaseNodeFontSizeAction(o.selectedNode);
        o.executeAction(e)
    }, t.lineWidthDecreaseButtonClicked = function() {
        var e = new mindmaps.action.DecreaseNodeLineWidthAction(o.selectedNode);
        o.executeAction(e)
    }, t.lineWidthIncreaseButtonClicked = function() {
        var e = new mindmaps.action.IncreaseNodeLineWidthAction(o.selectedNode);
        o.executeAction(e)
    }, t.fontBoldCheckboxClicked = function(e) {
        var n = new mindmaps.action.SetFontWeightAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.toggleBorderButtonClick = function() {
        var e = new mindmaps.action.ToggleBorderButtonAction(o.selectedNode);
        o.executeAction(e)
    }, t.fontItalicCheckboxClicked = function(e) {
        var n = new mindmaps.action.SetFontStyleAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.fontUnderlineCheckboxClicked = function(e) {
        var n = new mindmaps.action.SetFontDecorationAction(o.selectedNode, e ? "underline" : "none");
        o.executeAction(n)
    }, t.fontLinethroughCheckboxClicked = function(e) {
        var n = new mindmaps.action.SetFontDecorationAction(o.selectedNode, e ? "line-through" : "none");
        o.executeAction(n)
    }, t.branchColorPicked = function(e) {
        var n = new mindmaps.action.SetBranchColorAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.branchColorPreview = function(n) {
        e.publish(mindmaps.Event.NODE_BRANCH_COLOR_PREVIEW, o.selectedNode, n)
    }, t.fontColorPicked = function(e) {
        var n = new mindmaps.action.SetFontColorAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.borderBackgroundColorPicked = function(e) {
        var n = new mindmaps.action.SetBorderBackgroundColorAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.borderColorPicked = function(e) {
        var n = new mindmaps.action.SetBorderColorAction(o.selectedNode, e);
        o.executeAction(n)
    }, t.connectColorPicked = function(e) {
        var n = new mindmaps.action.SetConnectColorAction(o.selectedNode, mindmaps.connectStartNode, e);
        o.executeAction(n)
    }, t.fontColorPreview = function(n) {
        e.publish(mindmaps.Event.NODE_FONT_COLOR_PREVIEW, o.selectedNode, n)
    }, t.branchColorChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenBranchColorAction(o.selectedNode);
        o.executeAction(e)
    }, t.backgroundColorChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenBackgroundColorAction(o.selectedNode);
        o.executeAction(e)
    }, t.borderColorChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenBorderColorAction(o.selectedNode);
        o.executeAction(e)
    }, t.borderStyleChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenBorderStyleAction(o.selectedNode);
        o.executeAction(e)
    }, t.fontColorChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenFontColorAction(o.selectedNode);
        o.executeAction(e)
    }, t.fontStyleChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenFontStyleAction(o.selectedNode);
        o.executeAction(e)
    }, t.fontFaceChildrenButtonClicked = function() {
        var e = new mindmaps.action.SetChildrenFontFaceAction(o.selectedNode);
        o.executeAction(e)
    }, t.connectNodeButtonClicked = function() {
        var e = new mindmaps.action.ConnectNodeClickAction(o.selectedNode, !0);
        o.executeAction(e)
    }, t.connectNodeRemoveButtonClicked = function() {
        var e = new mindmaps.action.ConnectNodeRemoveClickAction(o.selectedNode, mindmaps.connectStartNode);
        o.executeAction(e)
    }, e.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(e) {
        o.selectedNode === e && i(e)
    }), e.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function(e) {
        o.selectedNode === e && i(e)
    }), e.subscribe(mindmaps.Event.NODE_SELECTED, function(o) {
        mindmaps.connectMode ? (e.publish(mindmaps.Event.CONNECTED_TWO_NODES, mindmaps.connectStartNode, o), mindmaps.connectSelected = !0, c(mindmaps.connectStartNode, o)) : (mindmaps.connectSelected = !1, $("#node-connect-styles-row").hide(), $("#inspector-button-connect-node-remove").hide()), i(o), mindmaps.connectMode = !1
    }), e.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
        t.setControlsEnabled(!0)
    }), e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
        t.setControlsEnabled(!1)
    }), this.go = function() {
        t.init()
    }
};