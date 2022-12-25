mindmaps.plugins["layout"] = {
    startOrder: 100,
    onUIInit: function(e, t) {
        mindmaps.SelectUpNodeCommand = function() {
            this.id = "SELECT_UP_NODE_COMMAND";
            this.shortcut = "up";
            this.label = "Up";
            this.icon = "ui-icon-arrowthick-1-n";
            this.description = "Go to up node"
        };
        mindmaps.SelectUpNodeCommand.prototype = new mindmaps.Command;
        var n = mindmaps.ui.commandRegistry.get(mindmaps.SelectUpNodeCommand);
        n.setHandler(function() {
            var e = mindmaps.ui.geometry.up(t.selectedNode);
            if (e) t.selectNode(e)
        });
        mindmaps.SelectDownNodeCommand = function() {
            this.id = "SELECT_DOWN_NODE_COMMAND";
            this.shortcut = "down";
            this.label = "Down";
            this.icon = "ui-icon-arrowthick-1-s";
            this.description = "Go to down node"
        };
        mindmaps.SelectDownNodeCommand.prototype = new mindmaps.Command;
        var r = mindmaps.ui.commandRegistry.get(mindmaps.SelectDownNodeCommand);
        r.setHandler(function() {
            var e = mindmaps.ui.geometry.down(t.selectedNode);
            if (e) t.selectNode(e)
        });
        mindmaps.SelectLeftNodeCommand = function() {
            this.id = "SELECT_LEFT_NODE_COMMAND";
            this.shortcut = "left";
            this.label = "Left";
            this.icon = "ui-icon-arrowthick-1-w";
            this.description = "Go to left node"
        };
        mindmaps.SelectLeftNodeCommand.prototype = new mindmaps.Command;
        var i = mindmaps.ui.commandRegistry.get(mindmaps.SelectLeftNodeCommand);
        i.setHandler(function() {
            var e = mindmaps.ui.geometry.left(t.selectedNode);
            if (e) t.selectNode(e)
        });
        mindmaps.SelectRightNodeCommand = function() {
            this.id = "SELECT_RIGHT_NODE_COMMAND";
            this.shortcut = "right";
            this.label = "Right";
            this.icon = "ui-icon-arrowthick-1-e";
            this.description = "Go to right node"
        };
        mindmaps.SelectRightNodeCommand.prototype = new mindmaps.Command;
        var s = mindmaps.ui.commandRegistry.get(mindmaps.SelectRightNodeCommand);
        s.setHandler(function() {
            var e = mindmaps.ui.geometry.right(t.selectedNode);
            if (e) t.selectNode(e)
        });
        _(mindmaps.ui.toolbarView.menus).find(function(e) {
            return e.title == "Nodes"
        }).add(_.chain([n, r, i, s]).map(function(e) {
            return new mindmaps.ToolBarButton(e)
        }).toArray().value());
        e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
            n.setEnabled(false);
            r.setEnabled(false);
            i.setEnabled(false);
            s.setEnabled(false)
        });
        e.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
            n.setEnabled(true);
            r.setEnabled(true);
            i.setEnabled(true);
            s.setEnabled(true)
        })
    },
    onCreateNode: function(e) {},
    onNodeUpdate: function(e, t) {}
}