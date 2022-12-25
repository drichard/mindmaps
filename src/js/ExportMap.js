mindmaps.ExportMapView = function() {
    var e = this;
    var t = $("#template-export-map").tmpl().dialog({
        autoOpen: false,
        modal: true,
        zIndex: 5e3,
        width: "auto",
        height: "auto",
        close: function() {
            $(this).dialog("destroy");
            $(this).remove()
        },
        open: function() {
            $(this).css({
                "max-width": $(window).width() * .9,
                "max-height": $(window).height() * .8
            });
            t.dialog("option", "position", "center")
        },
        buttons: {
            Ok: function() {
                $(this).dialog("close")
            }
        }
    });
    this.showDialog = function() {
        t.dialog("open")
    };
    this.hideDialog = function() {
        t.dialog("close")
    };
    this.setImage = function(e) {
        $("#export-preview").html(e)
    }
};
mindmaps.ExportMapPresenter = function(e, t, n) {
    var r = new mindmaps.StaticCanvasRenderer;
    this.go = function() {
        var e = r.renderAsPNG(t.getDocument());
        n.setImage(e);
        setTimeout(function() {
            n.showDialog()
        }, 30)
    }
}