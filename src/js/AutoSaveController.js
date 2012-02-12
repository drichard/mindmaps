mindmaps.AutoSaveController = function(eventBus, mindmapModel) {
  var LS_KEY = "mindmaps.config.autosave";
  var SAVE_INTERVAL = 1000 * 5;
  var timer = null;


  function save() {
    console.debug("Autosaving...");
    // TODO DRY that up. @see SaveDocument.js#82
    var doc = mindmapModel.getDocument();
    doc.dates.modified = new Date();
    doc.title = mindmapModel.getMindMap().getRoot().getCaption();
    var success = mindmaps.LocalDocumentStorage.saveDocument(doc);

    if (success) {
      eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
    }
  }

  function autosave() {
    timer = setInterval(save, SAVE_INTERVAL);
  }
  
  function stopAutosave() {
    if (timer) {
      clearInterval(timer);
    }
  }

  this.enable = function() {
    autosave();
    mindmaps.LocalStorage.put(LS_KEY, 1);
  }

  this.disable = function() {
    stopAutosave();
    mindmaps.LocalStorage.put(LS_KEY, 0);
  }

  this.isEnabled = function() {
    return mindmaps.LocalStorage.get(LS_KEY) == 1;
  }

  this.init = function() {
    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened
        .bind(this));

    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed
        .bind(this));
  }

  this.documentOpened = function() {
    if (this.isEnabled()) {
      autosave();
    }
  }

  this.documentClosed = function() {
    stopAutosave();
  }

  this.init();
}
