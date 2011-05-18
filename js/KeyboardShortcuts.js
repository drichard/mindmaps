mindmaps.KeyboardShortcuts = function() {
	this.shortcuts = [];

	this.register = function(shortcut) {
		var type = shortcut.type || "keydown";
		
		$(document).bind(type, shortcut.keys, shortcut.handler);
		this.shortcuts.push(shortcut);
	};
};
