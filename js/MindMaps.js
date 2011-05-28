// Use ECMA5 strict mode. see: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// first file to load
var mindmaps = mindmaps || {};

// start up
$(function() {
	var eventBus = new mindmaps.EventBus();
	var appModel = new mindmaps.ApplicationModel(eventBus);
	var undoController = new mindmaps.UndoController(eventBus);
	var clipboardController = new mindmaps.ClipboardController(eventBus,
			appModel);
	var appController = new mindmaps.AppController(eventBus, appModel);
	appController.go();

	// setup shortcuts
	var shortcuts = new mindmaps.KeyboardShortcuts(eventBus);
	shortcuts.registerAll();

	
	eventBus.publish(mindmaps.Event.NEW_DOCUMENT);
});