var self, a = 1;
mindmaps.AttachmentView = function() {
    self = this;
    var t = $(window).width(),
        n = $(window).height(),
        e = $("#template-attachment").tmpl().dialog({
            autoOpen: !1,
            modal: !1,
            height: n - 40,
            width: t - 40,
            resizable: !1,
            stack: !1,
            close: function() {
                console.log("remove");
                var t = e.find("#attachment-data").val();
                self.textChanged(t), console.log(t), $(this).dialog("close"), $(this).dialog("destroy")
            }
        }),
        i = e.find("#attachment-data"),
        o = $("#attachment-data-button-save");
    o.click(function() {
        self.textChanged($("#attachment-data").val())
    }), this.setData = function(t) {
        var n = t || "";
        e.find("#attachment-data").val(n)
    }, this.showDialog = function() {
        a++, console.log("show dialog"), i.ckeditor(), e.dialog("open")
    }
}, mindmaps.AttachmentPresenter = function(t, n, a) {
    a.textChanged = function(t) {
        console.log("changed " + t);
        var a = new mindmaps.action.ChangeAttachTextAction(n.selectedNode, t);
        n.executeAction(a)
    }, this.go = function() {
        a.setData(n.selectedNode.getPluginData("attachment", "data") || ""), a.showDialog()
    }
}, mindmaps.plugins.attachment = {
    startOrder: 1001,
    onUIInit: function(t, n) {
        function a() {
            var a = new mindmaps.AttachmentPresenter(t, n, new mindmaps.AttachmentView);
            a.go()
        }
        mindmaps.AttachmentCommand = function() {
            this.id = "ATTACHMENT_COMMAND", this.label = "Atach to node...", this.shortcut = [], this.description = "Attach images or rich text to a node"
        }, mindmaps.AttachmentCommand.prototype = new mindmaps.Command;
        var e = mindmaps.ui.commandRegistry.get(mindmaps.AttachmentCommand);
        e.setHandler(a), mindmaps.action.ChangeAttachTextAction = function(t, n) {
            var a = t.getPluginData("attachment", "data");
            this.execute = function() {
                return a == n ? !1 : void t.setPluginData("attachment", "data", n)
            }, this.event = [mindmaps.Event.ATTACH_TEXT_CHANGED, t], this.undo = function() {
                return new mindmaps.action.ChangeAttachTextAction(t, a)
            }
        }, mindmaps.Event.ATTACH_TEXT_CHANGED = "AttachTextChangedEvent", t.subscribe(mindmaps.Event.ATTACH_TEXT_CHANGED, function(t) {
            mindmaps.ui.canvasView.updateNode(t)
        })
    },
    onCreateNode: function(t) {
        mindmaps.util.plugins.ui.addIcon("attachment", t, "paper-clip")
    },
    onNodeUpdate: function(t, n) {
        var a = n ? "normal" : "hide",
            e = t.getPluginData("attachment", "data");
        e && e.length > 0 && (a = "shine"), mindmaps.util.plugins.ui.iconState("attachment", t, a)
    },
    inspectorAdviser: {
        onInit: function(t) {
            var n = '  <tr id="inspector-urls-row">                         <td>Attachment:</td>                         <td>                             <button id="inspector-button-attachment" title="Open Attachment dialog"                             class="buttons-small buttons-less-padding">Attachment                             </button>                         </td>                     </tr>';
            t.append($(n));
            var a = $("#inspector-button-attachment", t);
            a.button(), a.click(function() {
                var t = mindmaps.ui.commandRegistry.get(mindmaps.AttachmentCommand);
                t.execute()
            })
        },
        setControlsEnabled: function(t) {
            var n = $("#inspector-button-urls"),
                a = t ? "enable" : "disable";
            n.button(a)
        }
    }
};