mindmaps.ShortcutController = function() {
	// set to save shortcuts in
	this.shortcuts = {};

	/**
	 * Set the event type and add namespace for later removal.
	 * 
	 * @param shortcut the key combination
	 * @param type defaults to "keydown"
	 * @returns {String}
	 */
	function getType(shortcut, type) {
		type = type || "keydown";
		return type + "." + shortcut;
	}

	this.register = function(shortcut, handler, type) {
		type = getType(shortcut, type);
		$(document).bind(type, shortcut, function(e) {
			// try best to cancel default actions on shortcuts like ctrl+n
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.preventDefault();
			handler();
			return false;
		});
		this.shortcuts[type] = true;
	};

	this.unregister = function(shortcut, type) {
		type = getType(shortcut, type);
		$(document).unbind(type);
		delete this.shortcuts[type];
	};

	this.unregisterAll = function() {
		for (var shortcut in shortcuts) {
			$(document).unbind(shortcut);
		}
	};
};
