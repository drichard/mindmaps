mindmaps.migrations = {
    "before style and layout as plugin": {
        onNode: function(e, t) {
            if (t.text.font) {
                e.setPluginData("style", "font", t.text.font)
            }
            if (t.branchColor) {
                e.setPluginData("style", "branchColor", t.branchColor)
            }
            if (t.lineWIdthOffset) {
                e.setPluginData("style", "lineWIdthOffset", t.lineWIdthOffset)
            }
            if (t.offset) {
                e.setPluginData("layout", "offset", t.offset)
            }
            if (t.foldChildren) {
                this.setPluginData("layout", "foldChildren", false)
            }
        }
    }
}