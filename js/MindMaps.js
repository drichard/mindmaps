// first file to load
var DEBUG = true;
var mindmaps = mindmaps || {};

//start up
$(function() {
	var eventBus = new mindmaps.EventBus();
	var undoManager = new UndoManager();
	var appModel = new mindmaps.ApplicationModel(eventBus, undoManager);
	var appController = new mindmaps.AppController(eventBus, appModel);
	
	appController.go();

	// eventBus.publish(Event.OPEN_DOCUMENT);
});