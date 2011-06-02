mindmaps.ShortcutController = function() {
	this.shortcuts = {};

	this.register = function(shortcut, handler, type) {
		type = type || "keydown";
		type = type + "." + shortcut;
		$(document).bind(type, shortcut, handler);
		this.shortcuts.type = null;
	};
	
	this.unregister = function(shortcut, type) {
		type = type || "keydown";
		type = type + "." + shortcut;
		$(document).unbind(type);
		delete this.shortcuts.type;
	};
	
	this.unregisterAll = function() {
		_.keys(this.shortcuts, function(type) {
			$(document).unbind(type);
		});
	};
	
	this.registerAll = function() {
		this.register({
			keys : "ctrl+c",
			handler : function() {
				eventBus.publish(mindmaps.Event.COPY_NODE);
			}
		});

		this.register({
			keys : "ctrl+x",
			handler : function() {
				eventBus.publish(mindmaps.Event.CUT_NODE);
			}
		});

		this.register({
			keys : "ctrl+v",
			handler : function() {
				eventBus.publish(mindmaps.Event.PASTE_NODE);
			}
		});

	};
};
