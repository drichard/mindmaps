mindmaps.ImageNodeView = function() {
    var e = this,
        n = $("#template-add-image").tmpl().dialog({
            autoOpen: !1,
            modal: !0,
            zIndex: 5e3,
            width: 400,
            resizable: !1,
            keyboard: !0,
            buttons: [{
                id: "button-save",
                text: "Save",
                click: function() {
                    if ("none" != a.css("display")) {
                        hheight = $.isNumeric(d.val()) ? d.val() : c, wwidth = $.isNumeric(o.val()) ? o.val() : m;
                        var n = {
                            data: i.attr("src"),
                            width: String(wwidth),
                            height: String(hheight),
                            align: r.find(":selected").val()
                        };
                        e.imgChanged(n)
                    }
                    $(this).dialog("close")
                }
            }, {
                id: "button-remove",
                text: "Remove",
                click: function() {
                    "none" != a.css("display") && e.clearImage(), $(this).dialog("close")
                }
            }, {
                id: "button-cancel",
                text: "Cancel",
                click: function() {
                    $(this).dialog("close")
                }
            }],
            close: function() {
                $(this).dialog("destroy"), $(this).remove()
            }
        });
    fileUpload = n.find("#choose-image-selectfile"); {
        var t = n.find("#node-image-preview-div"),
            i = n.find("#node-image-preview"),
            a = n.find("#image-properties"),
            o = n.find("#image-property-width"),
            d = n.find("#image-property-height"),
            s = n.find("input[name=keepratio]"),
            r = n.find("#image-property-alignment");
        n.find("#button-remove")
    }
    o.on("change keyup", function() {
        s[0].checked && $.isNumeric(o.val()) && d.val(Math.round(c * parseInt(o.val(), 10) / m))
    }), d.on("change keyup", function() {
        s[0].checked && $.isNumeric(d.val()) && o.val(Math.round(m * parseInt(d.val(), 10) / c))
    });
    var m, c;
    mindmaps.ImageInsertController = function(e) {
        "use strict";
        var n, t = this,
            i = function(e) {
                var n = $.Deferred(),
                    t = new FileReader;
                return t.onload = function(e) {
                    n.resolve(e.target.result)
                }, t.onerror = n.reject, t.onprogress = n.notify, t.readAsDataURL(e), n.promise()
            };
        t.insertFiles = function(t, a) {
            $.each(t, function(t, o) {
                /^image\//.test(o.type) && $.when(i(o)).done(function(t) {
                    n = new Image, n.onload = function() {
                        e(t, n.width, n.height, a)
                    }, n.src = t
                })
            })
        }
    }, $.fn.imageDropWidget = function(e) {
        "use strict";
        return this.on("dragenter dragover", function(e) {
            return e.originalEvent.dataTransfer ? !1 : void 0
        }).on("drop", function(n) {
            var t = n.originalEvent.dataTransfer;
            n.stopPropagation(), n.preventDefault(), t && t.files && t.files.length > 0 && e.insertFiles(t.files, n.originalEvent)
        }), this
    }, insertController = new mindmaps.ImageInsertController(function(e, n, t) {
        m = n, c = t, i.attr("src", e), i.show(), a.show(), o.val(n), d.val(t)
    }), fileUpload.on("change", function(e) {
        insertController.insertFiles(this.files, e)
    }), t.imageDropWidget(insertController), this.showDialog = function(e) {
        if (t.click(function() {
                fileUpload.click()
            }), fileUpload.css("opacity", 0).css("position", "absolute").offset(t.offset()).width(t.outerWidth()).height(t.outerHeight()), e) {
            m = e.width, c = e.height, i.attr("src", e.data), i.show(), a.show(), o.val(m), d.val(c), r.val(e.align);
            var s = $("#button-save").button("widget");
            s.css("color", "#00aa00");
            var l = $("#button-remove").button("widget");
            l.css("color", "#aa0000")
        } else $("#button-remove").hide();
        n.dialog("open")
    }
}, mindmaps.ImageNodePresenter = function(e, n, t) {
    t.imgChanged = function(e) {
        var t = new mindmaps.action.ChangeImageAction(n.selectedNode, e);
        n.executeAction(t)
    }, t.clearImage = function() {
        var e = new mindmaps.action.RemoveImageAction(n.selectedNode);
        n.executeAction(e)
    }, e.subscribe(mindmaps.Event.NODE_IMAGE_REMOVED, function() {}), e.subscribe(mindmaps.Event.NODE_IMAGE_CHANGED, function() {}), this.go = function() {
        t.showDialog(n.selectedNode.getPluginData("image", "data"))
    }
}, mindmaps.plugins.imagenode = {
    startOrder: 1001,
    onUIInit: function(e, n) {
        function t() {
            var t = new mindmaps.ImageNodePresenter(e, n, new mindmaps.ImageNodeView);
            t.go()
        }
        mindmaps.AddImageNodeCommand = function() {
            this.id = "ADD_IMAGE_NODE_COMMAND", this.label = "Add Image...", this.shortcut = [], this.description = "Open node image editor"
        }, mindmaps.AddImageNodeCommand.prototype = new mindmaps.Command;
        var i = mindmaps.ui.commandRegistry.get(mindmaps.AddImageNodeCommand);
        i.setHandler(t), mindmaps.action.ChangeImageAction = function(e, n) {
            var t = e.getPluginData("image", "data");
            this.execute = function() {
                return t == n ? !1 : void e.setPluginData("image", "data", n)
            }, this.event = [mindmaps.Event.NODE_IMAGE_CHANGED, e], this.undo = function() {
                return new mindmaps.action.ChangeImageAction(e, t)
            }
        }, mindmaps.action.RemoveImageAction = function(e) {
            var n = e.getPluginData("image", "data");
            this.execute = function() {
                return null == n ? !1 : void e.setPluginData("image", "data", null)
            }, this.event = [mindmaps.Event.NODE_IMAGE_REMOVED, e], this.undo = function() {
                return new mindmaps.action.ChangeImageAction(e, n)
            }
        }, mindmaps.Event.NODE_IMAGE_CHANGED = "NodeImageChangedEvent", mindmaps.Event.NODE_IMAGE_REMOVED = "NodeImageRemovedEvent", e.subscribe(mindmaps.Event.NODE_IMAGE_CHANGED, function(e) {
            mindmaps.ui.canvasView.updateNode(e)
        }), e.subscribe(mindmaps.Event.NODE_IMAGE_REMOVED, function(e) {
            mindmaps.ui.canvasView.updateNode(e)
        })
    },
    onCreateNode: function() {},
    onNodeUpdate: function() {},
    inspectorAdviser: {
        onInit: function(e) {
            var n = '  <tr id="inspector-add-image">                         <td>Image:</td>                         <td>                             <button id="inspector-button-add-image" title="Add/Change Image"                             class="buttons-small buttons-less-padding">Add/Change Image                             </button>                         </td>                     </tr>';
            e.append($(n));
            var t = $("#inspector-button-add-image", e);
            t.button(), t.click(function() {
                var e = mindmaps.ui.commandRegistry.get(mindmaps.AddImageNodeCommand);
                e.execute()
            })
        },
        setControlsEnabled: function(e) {
            var n = $("#inspector-button-add-image"),
                t = e ? "enable" : "disable";
            n.button(t)
        }
    }
};