mindmaps.ClipboardController = function(eventBus, appModel) {
	var node = null;
	
	/// TODO see if we keep when documents change or not
	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc) {
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CREATED, function(doc) {

	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
	});

	function doCopy() {
		var selected = appModel.selectedNode;
		if (selected) {
			node = selected.clone();
		}
	}

	function doCut() {
		var selected = appModel.selectedNode;
		if (selected) {
			node = selected.clone();
			var action =  new mindmaps.action.DeleteNodeAction(selected);
			appModel.executeAction(action);
		}
	}

	function doPaste() {
		var selected = appModel.selectedNode;
		if (selected) {
			// send a cloned copy of our node, so we can paste multiple times
			var action = new mindmaps.action.CreateNodeAction(node.clone(), selected);
			appModel.executeAction(action);
		}
	}

	eventBus.subscribe(mindmaps.Event.COPY_NODE, doCopy);

	eventBus.subscribe(mindmaps.Event.CUT_NODE, doCut);

	eventBus.subscribe(mindmaps.Event.PASTE_NODE, doPaste);

};