mindmaps.CopyCutPasteController = function(eventBus, appModel) {
	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {

	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
	});
	
	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		this.selectedNode = node;
	});
	
	eventBus.subscribe(mindmaps.Event.NODE_DESELECTED, function(node) {
		this.selectedNode = null;
	});
	
	
	eventBus.subscribe(mindmaps.Event.COPY_NODE, function() {
		this.node = this.selectedNode.clone();
		this.mode = "COPY";
	});
	
	eventBus.subscribe(mindmaps.Event.CUT_NODE, function() {
		this.node = this.selectedNode.clone();
		this.mode = "CUT";
	});
	
	eventBus.subscribe(mindmaps.Event.PASTE_NODE, function() {
	});
	
};