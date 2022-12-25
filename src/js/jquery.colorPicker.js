(function(e) {
    var t, n, r = 0,
        i = {
            control: e('<div class="colorPicker-picker">&nbsp;</div>'),
            palette: e('<div id="colorPicker_palette" class="colorPicker-palette" />'),
            swatch: e('<div class="colorPicker-swatch">&nbsp;</div>'),
            hexLabel: e('<label for="colorPicker_hex">Hex</label>'),
            hexField: e('<input type="text" id="colorPicker_hex" />')
        },
        s = "transparent",
        o;
    e.fn.colorPicker = function(t) {
        return this.each(function() {
            var n = e(this),
                o = e.extend({}, e.fn.colorPicker.defaults, t),
                u = e.fn.colorPicker.toHex(n.val().length > 0 ? n.val() : o.pickerDefault),
                a = i.control.clone(),
                f = i.palette.clone().attr("id", "colorPicker_palette-" + r),
                l = i.hexLabel.clone(),
                c = i.hexField.clone(),
                h = f[0].id,
                p;
            e.each(o.colors, function(t) {
                p = i.swatch.clone();
                if (o.colors[t] === s) {
                    p.addClass(s).text("X");
                    e.fn.colorPicker.bindPalette(c, p, s)
                } else {
                    p.css("background-color", "#" + this);
                    e.fn.colorPicker.bindPalette(c, p)
                }
                p.appendTo(f)
            });
            l.attr("for", "colorPicker_hex-" + r);
            c.attr({
                id: "colorPicker_hex-" + r,
                value: u
            });
            c.bind("keydown", function(t) {
                if (t.keyCode === 13) {
                    var r = e.fn.colorPicker.toHex(e(this).val());
                    e.fn.colorPicker.changeColor(r ? r : n.val())
                }
                if (t.keyCode === 27) {
                    e.fn.colorPicker.hidePalette()
                }
            });
            c.bind("keyup", function(t) {
                var r = e.fn.colorPicker.toHex(e(t.target).val());
                e.fn.colorPicker.previewColor(r ? r : n.val())
            });
            e("body").append(f);
            f.addClass("inspector");
            f.hide();
            a.css("background-color", u);
            a.bind("click", function() {
                e.fn.colorPicker.togglePalette(e("#" + h), e(this))
            });
            n.after(a);
            n.bind("change", function() {
                n.next(".colorPicker-picker").css("background-color", e.fn.colorPicker.toHex(e(this).val()))
            });
            n.val(u).hide();
            r++
        })
    };
    e.extend(true, e.fn.colorPicker, {
        toHex: function(e) {
            if (e.match(/[0-9A-F]{6}|[0-9A-F]{3}$/i)) {
                return e.charAt(0) === "#" ? e : "#" + e
            } else if (e.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/)) {
                var t = [parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)],
                    n = function(e) {
                        if (e.length < 2) {
                            for (var t = 0, n = 2 - e.length; t < n; t++) {
                                e = "0" + e
                            }
                        }
                        return e
                    };
                if (t.length === 3) {
                    var r = n(t[0].toString(16)),
                        i = n(t[1].toString(16)),
                        s = n(t[2].toString(16));
                    return "#" + r + i + s
                }
            } else {
                return false
            }
        },
        checkMouse: function(r, i) {
            var s = n,
                o = e(r.target).parents("#" + s.attr("id")).length;
            if (r.target === e(s)[0] || r.target === t[0] || o > 0) {
                return
            }
            e.fn.colorPicker.hidePalette()
        },
        hidePalette: function() {
            e(document).unbind("mousedown", e.fn.colorPicker.checkMouse);
            e(".colorPicker-palette").hide()
        },
        showPalette: function(n) {
            var r = t.prev("input").val();
            n.css({
                top: t.offset().top - n.outerHeight(),
                left: t.offset().left
            });
            e("#color_value").val(r);
            n.show();
            e(document).bind("mousedown", e.fn.colorPicker.checkMouse)
        },
        togglePalette: function(r, i) {
            if (i) {
                t = i
            }
            n = r;
            if (n.is(":visible")) {
                e.fn.colorPicker.hidePalette()
            } else {
                e.fn.colorPicker.showPalette(r)
            }
        },
        changeColor: function(n) {
            t.css("background-color", n);
            t.prev("input").val(n).change();
            e.fn.colorPicker.hidePalette()
        },
        previewColor: function(e) {
            t.css("background-color", e)
        },
        bindPalette: function(n, r, i) {
            i = i ? i : e.fn.colorPicker.toHex(r.css("background-color"));
            r.bind({
                click: function(t) {
                    o = i;
                    e.fn.colorPicker.changeColor(i)
                },
                mouseover: function(t) {
                    o = n.val();
                    e(this).css("border-color", "#598FEF");
                    n.val(i);
                    e.fn.colorPicker.previewColor(i)
                },
                mouseout: function(r) {
                    e(this).css("border-color", "#000");
                    n.val(t.css("background-color"));
                    n.val(o);
                    e.fn.colorPicker.previewColor(o)
                }
            })
        }
    });
    e.fn.colorPicker.defaults = {
        pickerDefault: "FFFFFF",
        colors: ["000000", "993300", "333300", "000080", "333399", "333333", "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080", "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "999999", "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF", "993366", "C0C0C0", "FF99CC", "FFCC99", "FFFF99", "CCFFFF", "99CCFF", "FFFFFF"],
        addColors: []
    }
})(jQuery)