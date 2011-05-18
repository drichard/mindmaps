// first file to load
var DEBUG = true;
var mindmaps = mindmaps || {};

//start up
$(function() {
	var eventBus = new mindmaps.EventBus();
	var appModel = new mindmaps.ApplicationModel(eventBus);
	var undoController = new mindmaps.UndoController(eventBus, appModel);
	var copyPasteController = new mindmaps.CopyCutPasteController(eventBus, appModel);
	var appController = new mindmaps.AppController(eventBus, appModel);
	
	appController.go();

	// eventBus.publish(Event.OPEN_DOCUMENT);
});