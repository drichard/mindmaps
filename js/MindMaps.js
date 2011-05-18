// first file to load
var DEBUG = true;
var mindmaps = mindmaps || {};

// start up
$(function() {
	var eventBus = new mindmaps.EventBus();
	var appModel = new mindmaps.ApplicationModel(eventBus);
	var undoController = new mindmaps.UndoController(eventBus, appModel);
	var copyPasteController = new mindmaps.CopyCutPasteController(eventBus,
			appModel);
	var appController = new mindmaps.AppController(eventBus, appModel);
	appController.go();

	// TODO where to put this?
	// setup shortcuts
	var shortcuts = new mindmaps.KeyboardShortcuts();
	shortcuts.register({
		keys : "ctrl+c",
		handler : function() {
			eventBus.publish(mindmaps.Event.COPY_NODE);
		}
	});

	shortcuts.register({
		keys : "ctrl+x",
		handler : function() {
			eventBus.publish(mindmaps.Event.CUT_NODE);
		}
	});

	shortcuts.register({
		keys : "ctrl+v",
		handler : function() {
			eventBus.publish(mindmaps.Event.PASTE_NODE);
		}
	});
	
	shortcuts.register({
		keys : "ctrl+z",
		handler : function() {
			eventBus.publish(mindmaps.Event.UNDO_ACTION);
		}
	});
	
	shortcuts.register({
		keys : "ctrl+y",
		handler : function() {
			eventBus.publish(mindmaps.Event.REDO_ACTION);
		}
	});

	// eventBus.publish(Event.OPEN_DOCUMENT);
});