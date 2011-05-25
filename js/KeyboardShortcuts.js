mindmaps.KeyboardShortcuts = function(eventBus, appModel) {
	this.shortcuts = [];

	this.register = function(shortcut) {
		var type = shortcut.type || "keydown";
		
		$(document).bind(type, shortcut.keys, shortcut.handler);
		this.shortcuts.push(shortcut);
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

		this.register({
			keys : "ctrl+z",
			handler : function() {
				eventBus.publish(mindmaps.Event.DO_UNDO);
			}
		});

		this.register({
			keys : "ctrl+y",
			handler : function() {
				eventBus.publish(mindmaps.Event.DO_REDO);
			}
		});
		
		this.register({
			keys : "insert",
			handler : function() {
				eventBus.publish(mindmaps.Event.NEW_NODE);
			}
		});
		
		this.register({
			keys : "del",
			handler : function() {
				eventBus.publish(mindmaps.Event.DELETE_NODE);
			}
		});
	};
};
