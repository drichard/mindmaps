/**
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.MindMapModel} mindmapModel
 */
mindmaps.PrintController = function(eventBus, commandRegistry, mindmapModel) {
  var printCommand = commandRegistry.get(mindmaps.PrintCommand);
  printCommand.setHandler(doPrintDocument);

  var renderer = new mindmaps.StaticCanvasRenderer();

  function doPrintDocument() {
    var $img = renderer.renderAsPNG(mindmapModel.getDocument());
    $("#print-area").html($img);
    window.print();

    // TODO chrome only: after print() opens a new tab, and one switches
    // back to the old tab the canvas container has scrolled top-left.
  }

  eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
    printCommand.setEnabled(false);
  });

  eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
    printCommand.setEnabled(true);
  });
};
