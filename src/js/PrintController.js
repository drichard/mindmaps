mindmaps.PrintController = function(e, t, n) {
    function s() {
        var e = i.renderAsPNG(n.getDocument());
        $("#print-area").html(e);
        window.print()
    }
    var r = t.get(mindmaps.PrintCommand);
    r.setHandler(s);
    var i = new mindmaps.StaticCanvasRenderer;
    e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
        r.setEnabled(false)
    });
    e.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
        r.setEnabled(true)
    })
}