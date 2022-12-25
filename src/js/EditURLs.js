mindmaps.EditURLsView = function() {
    function n(n, e, t) {
        if (t.empty(), n.urls.forEach(function(n) {
                var e = $('<option value="' + n.url + '">' + n.label + "</option>");
                t.append(e)
            }), !mindmaps.Config.allowMultipleUrls) {
            var i = $('<option value="">No URL selected.</option>');
            t.prepend(i), t.val(e[0])
        }
    }
    var e = this,
        t = $("#template-urls").tmpl().dialog({
            autoOpen: !1,
            modal: !0,
            zIndex: 5e3,
            width: 550,
            close: function() {
                $(this).dialog("destroy"), $(this).remove()
            }
        }),
        i = $("#urls-direct-input"),
        s = $("#urls-direct-input input"),
        o = $("#urls-direct-input button"),
        r = $("#urls-dropdown-input"),
        a = $("#urls-dropdown-input select"),
        d = $("#urls-dropdown-input button"),
        l = $("#urls-search-dropdown-input"),
        u = $("#urls-search-dropdown-input input"),
        c = $("#urls-search-dropdown-input .search"),
        p = $("#urls-search-dropdown-input select"),
        m = $("#urls-search-dropdown-input .add"),
        f = $("#template-urls-multi-url-display").tmpl(),
        h = f.find(".url-list"),
        v = h.find("tbody");
    c.click(function() {
        e.searchQuerySubmitted(u.val())
    }), u.keypress(function(n) {
        13 === n.which && e.searchQuerySubmitted(u.val())
    }), mindmaps.Config.allowMultipleUrls ? (o.click(function() {
        e.urlAdded(s.val()), s.val("")
    }), s.keypress(function(n) {
        13 === n.which && (e.urlAdded(s.val()), s.val(""))
    }), d.click(function() {
        e.urlAdded(a.val())
    }), m.click(function() {
        e.urlAdded(p.val())
    })) : (s.bind("change keyup", function() {
        e.singleUrlChanged(s.val())
    }), a.change(function() {
        e.singleUrlChanged(a.val())
    }), p.change(function() {
        e.singleUrlChanged(p.val())
    }), o.css({
        display: "none"
    }), d.css({
        display: "none"
    }), m.css({
        display: "none"
    })), v.delegate("a.delete", "click", function() {
        var n = $(this).tmplItem();
        e.urlRemoved(n.data.url)
    }), this.setUrls = function(n) {
        n = n || [], mindmaps.Config.allowMultipleUrls ? (v.empty(), 0 === n.length ? v.append("<tr><td>No URLs added yet.</td></tr>") : n.forEach(function(n) {
            $("#template-urls-table-item").tmpl({
                url: n
            }).appendTo(v)
        })) : s.val(n[0])
    }, this.setDropDownUrls = function(e, t) {
        n(e, t, a)
    }, this.setSearchDropDownUrls = function(e, t) {
        n(e, t, p)
    }, this.showDropdownError = function(n) {
        t.find(".dropdown-error").text(n)
    }, this.showSearchDropdownError = function(n) {
        t.find(".search-dropdown-error").text(n)
    }, this.showDialog = function() {
        mindmaps.Config.allowMultipleUrls && t.append(f), mindmaps.Config.activateDirectUrlInput || i.css({
            display: "none"
        }), mindmaps.Config.activateUrlsFromServerWithoutSearch || r.css({
            display: "none"
        }), mindmaps.Config.activateUrlsFromServerWithSearch || l.css({
            display: "none"
        }), t.dialog("open")
    }
}, mindmaps.EditURLsPresenter = function(n, e, t) {
    t.singleUrlChanged = function(n) {
        var t = new mindmaps.action.ChangeURLsAction(e.selectedNode, n);
        e.executeAction(t)
    }, t.urlAdded = function(n) {
        var t = new mindmaps.action.AddURLsAction(e.selectedNode, n);
        e.executeAction(t)
    }, t.urlRemoved = function(n) {
        var t = new mindmaps.action.RemoveURLsAction(e.selectedNode, n);
        e.executeAction(t)
    }, t.searchQuerySubmitted = function(n) {
        var i = mindmaps.Config.urlServerAddress;
        i += "?q=" + n, $.ajax({
            type: "GET",
            url: i
        }).done(function(n) {
            var i = JSON.parse(n);
            t.setSearchDropDownUrls(i, e.selectedNode.getPluginData("url", "urls") || [])
        }).fail(function() {
            t.showSearchDropdownError("Error while requesting URLs from server.")
        })
    }, n.subscribe(mindmaps.Event.NODE_URLS_ADDED, function() {
        t.setUrls(e.selectedNode.getPluginData("url", "urls") || [])
    }), n.subscribe(mindmaps.Event.NODE_URLS_REMOVED, function() {
        t.setUrls(e.selectedNode.getPluginData("url", "urls") || [])
    }), this.go = function() {
        mindmaps.Config.activateUrlsFromServerWithoutSearch && $.ajax({
            type: "GET",
            url: mindmaps.Config.urlServerAddress
        }).done(function(n) {
            var i = JSON.parse(n);
            t.setDropDownUrls(i, e.selectedNode.getPluginData("url", "urls") || [])
        }).fail(function() {
            t.showDropdownError("Error while requesting URLs from server.")
        }), t.setUrls(e.selectedNode.getPluginData("url", "urls") || []), t.showDialog()
    }
}, mindmaps.plugins.url = {
    startOrder: 1001,
    onUIInit: function(n, e) {
        function t() {
            var t = new mindmaps.EditURLsPresenter(n, e, new mindmaps.EditURLsView);
            t.go()
        }
        mindmaps.EditURLsCommand = function() {
            this.id = "EDIT_URLS_COMMAND", this.label = "Edit URLs...", this.shortcut = [], this.description = "Open the edit URLs dialog"
        }, mindmaps.EditURLsCommand.prototype = new mindmaps.Command;
        var i = mindmaps.ui.commandRegistry.get(mindmaps.EditURLsCommand);
        i.setHandler(t), mindmaps.action.ChangeURLsAction = function(n, e) {
            console.log("change url " + e), this.execute = function() {
                n.setPluginData("url", "urls", [e])
            }, this.event = [mindmaps.Event.NODE_URLS_CHANGED, n]
        }, mindmaps.action.AddURLsAction = function(n, e) {
            console.log("add url " + e), this.execute = function() {
                if ("" !== e) {
                    var t = n.getPluginData("url", "urls") || [];
                    t.push(e), n.setPluginData("url", "urls", t)
                }
            }, this.event = [mindmaps.Event.NODE_URLS_ADDED, n], this.undo = function() {
                return new mindmaps.action.RemoveURLsAction(n, e)
            }
        }, mindmaps.action.RemoveURLsAction = function(n, e) {
            console.log("remove url " + e), this.execute = function() {
                var t = (n.getPluginData("url", "urls") || []).filter(function(n) {
                    return n !== e
                });
                n.setPluginData("url", "urls", t)
            }, this.event = [mindmaps.Event.NODE_URLS_REMOVED, n], this.undo = function() {
                return new mindmaps.action.AddURLsAction(n, e)
            }
        }, mindmaps.Event.NODE_URLS_CHANGED = "NodeURLsChangedEvent", mindmaps.Event.NODE_URLS_ADDED = "NodeURLsAddedEvent", mindmaps.Event.NODE_URLS_REMOVED = "NodeURLsRemovedEvent", n.subscribe(mindmaps.Event.NODE_URLS_CHANGED, function(n) {
            mindmaps.ui.canvasView.updateNode(n)
        }), n.subscribe(mindmaps.Event.NODE_URLS_ADDED, function(n) {
            mindmaps.ui.canvasView.updateNode(n)
        }), n.subscribe(mindmaps.Event.NODE_URLS_REMOVED, function(n) {
            mindmaps.ui.canvasView.updateNode(n)
        })
    },
    onCreateNode: function(n) {
        mindmaps.util.plugins.ui.addIcon("url", n, "link")
    },
    onNodeUpdate: function(n, e) {
        var t = e ? "normal" : "hide",
            i = n.getPluginData("url", "urls");
        i && i.length > 0 && (t = "shine"), mindmaps.util.plugins.ui.iconState("url", n, t)
    },
    inspectorAdviser: {
        onInit: function(n) {
            var e = '  <tr id="inspector-urls-row">                         <td>URLs:</td>                         <td>                             <button id="inspector-button-urls" title="Open URL dialog"                             class="buttons-small buttons-less-padding">Edit URLs                             </button>                         </td>                     </tr>';
            n.append($(e));
            var t = $("#inspector-button-urls", n);
            t.button(), t.click(function() {
                var n = mindmaps.ui.commandRegistry.get(mindmaps.EditURLsCommand);
                n.execute()
            })
        },
        setControlsEnabled: function(n) {
            var e = $("#inspector-button-urls"),
                t = n ? "enable" : "disable";
            e.button(t)
        }
    }
};