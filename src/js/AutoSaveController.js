/**
 * Creates a new AutoSaveController. This controller is able to automatically
 * save the document every X minutes. This setting is global for all mindmaps.
 *
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 */
mindmaps.AutoSaveController = function(eventBus, mindmapModel) {
  var SAVE_INTERVAL = 1000 * 60; // 1 minute
  var timer = null;

  function save() {
    console.debug("Autosaving...");
    mindmapModel.saveToLocalStorage();
  }

  function autosave() {
    if (!timer) {
      timer = setInterval(save, SAVE_INTERVAL);
    }
  }

  function stopAutosave() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  /**
   * Enable autosave.
   */
  this.enable = function() {
    autosave();
    mindmapModel.getDocument().setAutoSave(true);
  }

  /**
   * Disable autosave.
   */
  this.disable = function() {
    stopAutosave();
    mindmapModel.getDocument().setAutoSave(false);
  }

  this.isEnabled = function() {
    return mindmapModel.getDocument().isAutoSave();
  }

  this.init = function() {
    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened
        .bind(this));

    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed
        .bind(this));
  }

  this.documentOpened = function(doc) {
    if (this.isEnabled()) {
      autosave();
    }
  }

  this.documentClosed = function() {
    stopAutosave();
  }

  this.init();
}
