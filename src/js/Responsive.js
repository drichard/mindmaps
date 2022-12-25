mindmaps.Responsive = function() {
    var e = this;
    this.isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    this.isMiddleDevice = function() {
        var t = e.inEm($(window).width());
        return t < 117
    };
    this.font_size = parseFloat($("body").css("font-size"));
    this.inEm = function(e) {
        return e / this.font_size
    }
};
mindmaps.responsive = new mindmaps.Responsive