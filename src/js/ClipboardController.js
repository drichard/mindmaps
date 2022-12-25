mindmaps.ClipboardController = function(e, t, n) {
    function a() {
        i = t.get(mindmaps.CopyNodeCommand);
        i.setHandler(l);
        s = t.get(mindmaps.CutNodeCommand);
        s.setHandler(c);
        o = t.get(mindmaps.PasteNodeCommand);
        o.setHandler(h);
        e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
            i.setEnabled(false);
            s.setEnabled(false)
        });
        e.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
            i.setEnabled(true);
            s.setEnabled(true);
            o.setEnabled(true)
        })
    }

    function f() {
        r = n.selectedNode.clone();
        u = (new Date).getTime();
        mindmaps.LocalStorage.put("mindmaps.clipboard", JSON.stringify({
            node: r.serialize(),
            date: u
        }))
    }

    function l() {
        f()
    }

    function c() {
        f();
        n.deleteNode(n.selectedNode)
    }

    function h() {
        var e = null;
        try {
            e = JSON.parse(mindmaps.LocalStorage.get("mindmaps.clipboard"))
        } catch (t) {}
        if (!r && !e) {
            return
        } else if (!r && e) {
            var i;
            var s = e.node;
            if (s) i = mindmaps.Node.fromJSON(s);
            n.createNode(i, n.selectedNode)
        } else if (r && e) {
            if (u < e.date) {
                var i;
                var s = e.node;
                if (s) i = mindmaps.Node.fromJSON(s);
                n.createNode(i, n.selectedNode)
            } else {
                n.createNode(r.clone(), n.selectedNode)
            }
        }
    }
    var r, i, s, o, u;
    a()
}