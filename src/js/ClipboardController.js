/**
 * Creates a new ClipboardController.
 * Handles copy, cut and paste commands.
 * 
 * @constructor
 * 
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.MindMapModel} mindmapModel
 */
mindmaps.ClipboardController = function(eventBus, commandRegistry, mindmapModel) {
  var node, copyCommand, cutCommand, pasteCommand;

  function init() {
    copyCommand = commandRegistry.get(mindmaps.CopyNodeCommand);
    copyCommand.setHandler(doCopy);

    cutCommand = commandRegistry.get(mindmaps.CutNodeCommand);
    cutCommand.setHandler(doCut);

    pasteCommand = commandRegistry.get(mindmaps.PasteNodeCommand);
    pasteCommand.setHandler(doPaste);
    pasteCommand.setEnabled(false);

    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
      copyCommand.setEnabled(false);
      cutCommand.setEnabled(false);
      pasteCommand.setEnabled(false);
    });

    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
      copyCommand.setEnabled(true);
      cutCommand.setEnabled(true);
      pasteCommand.setEnabled(node != null);
    });

  }

  function copySelectedNode() {
    node = mindmapModel.selectedNode.clone();
    pasteCommand.setEnabled(true);
  }

  function doCopy() {
    copySelectedNode();
  }

  function doCut() {
    copySelectedNode();
    mindmapModel.deleteNode(mindmapModel.selectedNode);
  }

  function doPaste() {
    if (!node) {
      return;
    }

    // send a cloned copy of our node, so we can paste multiple times
    mindmapModel.createNode(node.clone(), mindmapModel.selectedNode);
  }

  init();
};
