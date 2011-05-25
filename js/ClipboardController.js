mindmaps.ClipboardController = function(eventBus, appModel) {
	var node = null;

	function doCopy() {
		var selected = appModel.selectedNode;
		node = selected.clone();
	}

	function doCut() {
		var selected = appModel.selectedNode;
		node = selected.clone();
		var action = new mindmaps.action.DeleteNodeAction(selected);
		appModel.executeAction(action);
	}

	function doPaste() {
		if (!node) {
			return;
		}
		
		var selected = appModel.selectedNode;
		// send a cloned copy of our node, so we can paste multiple times
		var action = new mindmaps.action.CreateNodeAction(node.clone(),
				selected);
		appModel.executeAction(action);
	}

	eventBus.subscribe(mindmaps.Event.COPY_NODE, doCopy);

	eventBus.subscribe(mindmaps.Event.CUT_NODE, doCut);

	eventBus.subscribe(mindmaps.Event.PASTE_NODE, doPaste);

};