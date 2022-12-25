function timeit(f, c) {
    var t = (new Date).getTime();
    f();
    t = (new Date).getTime() - t;
    console.log(c || "", t, "ms")
}
mindmaps.Util = mindmaps.Util || {}, mindmaps.Util.colors10 = ["#333399", "#008080", "#33cccc", "#000080", "#008000", "#c0c0c0", "#ccffff", "#ffff99", "#ffcc99", "#666699", "#3366ff", "#00ffff", "#ff6600", "#993366", "#993300", "#99cc00", "#ffcc00", "#ff99cc", "#808080", "#800080", "#00ccff", "#ffff00", "#ff00ff", "#800000", "#ff0000", "#00ff00", "#0000ff", "#ffa500", "#000000", "#ffffff"], mindmaps.Util.colors20 = ["#333399", "#008080", "#33cccc", "#000080", "#008000", "#c0c0c0", "#ccffff", "#ffff99", "#ffcc99", "#666699", "#3366ff", "#00ffff", "#ff6600", "#993366", "#993300", "#99cc00", "#ffcc00", "#ff99cc", "#808080", "#800080", "#00ccff", "#ffff00", "#ff00ff", "#800000", "#ff0000", "#00ff00", "#0000ff", "#ffa500", "#000000", "#ffffff"], mindmaps.Util.colors20b = ["#333399", "#008080", "#33cccc", "#000080", "#008000", "#c0c0c0", "#ccffff", "#ffff99", "#ffcc99", "#666699", "#3366ff", "#00ffff", "#ff6600", "#993366", "#993300", "#99cc00", "#ffcc00", "#ff99cc", "#808080", "#800080", "#00ccff", "#ffff00", "#ff00ff", "#800000", "#ff0000", "#00ff00", "#0000ff", "#ffa500", "#000000", "#ffffff"], mindmaps.Util.colors20c = ["#333399", "#008080", "#33cccc", "#000080", "#008000", "#c0c0c0", "#ccffff", "#ffff99", "#ffcc99", "#666699", "#3366ff", "#00ffff", "#ff6600", "#993366", "#993300", "#99cc00", "#ffcc00", "#ff99cc", "#808080", "#800080", "#00ccff", "#ffff00", "#ff00ff", "#800000", "#ff0000", "#00ff00", "#0000ff", "#ffa500", "#000000", "#ffffff"], mindmaps.Util.colors20d = ["#333399", "#008080", "#33cccc", "#000080", "#008000", "#c0c0c0", "#ccffff", "#ffff99", "#ffcc99", "#666699", "#3366ff", "#00ffff", "#ff6600", "#993366", "#993300", "#99cc00", "#ffcc00", "#ff99cc", "#808080", "#800080", "#00ccff", "#ffff00", "#ff00ff", "#800000", "#ff0000", "#00ff00", "#0000ff", "#ffa500", "#000000", "#ffffff"], mindmaps.Util.touchHandler = function(f) {
    var c = f.changedTouches[0],
        t = "";
    switch (f.type) {
        case "touchstart":
            t = "mousedown";
            break;
        case "touchmove":
            t = "mousemove";
            break;
        case "touchend":
            t = "mouseup";
            break;
        default:
            return
    }
    var n = document.createEvent("MouseEvent");
    n.initMouseEvent(t, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), c.target.dispatchEvent(n), f.preventDefault()
}, mindmaps.Util.trackEvent = function(f, c, t) {}, mindmaps.Util.createUUID = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(f) {
        var c = 16 * Math.random() | 0;
        return ("x" == f ? c : 3 & c | 8).toString(16)
    })
}, mindmaps.Util.getId = function() {
    return mindmaps.Util.createUUID()
}, mindmaps.Util.randomColor = function() {
    return mindmaps.Util.colors20[Math.round(20 * Math.random())]
}, mindmaps.Util.getUrlParams = function() {
    function f(f) {
        return decodeURIComponent(f.replace(n, " "))
    }
    for (var c, t = {}, n = /\+/g, e = /([^&=]+)=?([^&]*)/g, a = window.location.search.substring(1); c = e.exec(a);) t[f(c[1])] = f(c[2]);
    return t
}, mindmaps.Util.distance = function(f, c) {
    return Math.sqrt(f * f + c * c)
};