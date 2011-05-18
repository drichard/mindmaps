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
	
	function doCopy() {
		this.node = this.selectedNode.clone();
	}
	
	function doCut() {
		this.node = this.selectedNode.clone();
		appModel.deleteNode(this.selectedNode);
	}
	
	function doPaste() {
		// send a cloned copy of our node, so we can paste multiple times
		appModel.createNode(this.node.clone(), this.selectedNode);
	}
	
	eventBus.subscribe(mindmaps.Event.COPY_NODE, doCopy);
	
	eventBus.subscribe(mindmaps.Event.CUT_NODE, doCut);
	
	eventBus.subscribe(mindmaps.Event.PASTE_NODE, doPaste);
	
};