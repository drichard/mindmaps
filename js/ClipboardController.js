mindmaps.ClipboardController = function(eventBus, appModel) {
	var selectedNode = null;
	var node = null;
	
	/// TODO see if we keep when documents change or not
	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {

	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
	});

	
	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		selectedNode = node;
	});

	eventBus.subscribe(mindmaps.Event.NODE_DESELECTED, function(node) {
		selectedNode = null;
	});

	function doCopy() {
		if (selectedNode) {
			node = selectedNode.clone();
		}
	}

	function doCut() {
		if (selectedNode) {
			node = selectedNode.clone();
			appModel.deleteNode(selectedNode);
		}
	}

	function doPaste() {
		if (selectedNode) {
			// send a cloned copy of our node, so we can paste multiple times
			appModel.createNode(node.clone(), selectedNode);
		}
	}

	eventBus.subscribe(mindmaps.Event.COPY_NODE, doCopy);

	eventBus.subscribe(mindmaps.Event.CUT_NODE, doCut);

	eventBus.subscribe(mindmaps.Event.PASTE_NODE, doPaste);

};