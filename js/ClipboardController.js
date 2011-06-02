mindmaps.ClipboardController = function(eventBus, commandRegistry,
		mindmapModel) {
	var node = null;

	this.init = function() {
		this.copyCommand = commandRegistry.get(mindmaps.CopyNodeCommand);
		this.copyCommand.setHandler(doCopy.bind(this));

		this.cutCommand = commandRegistry.get(mindmaps.CutNodeCommand);
		this.cutCommand.setHandler(doCut.bind(this));

		this.pasteCommand = commandRegistry.get(mindmaps.PasteNodeCommand);
		this.pasteCommand.setHandler(doPaste.bind(this));
		this.pasteCommand.setEnabled(false);

		eventBus.subscribe(mindmaps.Event.NODE_SELECTED, (function() {
			this.copyCommand.setEnabled(true);
			this.cutCommand.setEnabled(true);
		}).bind(this));
	};

	function doCopy() {
		var selected = mindmapModel.selectedNode;
		node = selected.clone();
		this.pasteCommand.setEnabled(true);
	}

	function doCut() {
		var selected = mindmapModel.selectedNode;
		node = selected.clone();
		mindmapModel.deleteNode(selected);
		this.pasteCommand.setEnabled(true);
	}

	function doPaste() {
		if (!node) {
			return;
		}

		var selected = mindmapModel.selectedNode;
		// send a cloned copy of our node, so we can paste multiple times
		mindmapModel.createNode(node.clone(), selected);
	}

	this.init();
};