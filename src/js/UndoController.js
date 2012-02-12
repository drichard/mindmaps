/**
 * Creates a new UndoController. The undo controller manages an instance of
 * UndoManager and delegates all undo and redo commands to the undo manager.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 */
mindmaps.UndoController = function(eventBus, commandRegistry) {

  /**
   * Initialise.
   * 
   * @private
   */
  this.init = function() {
    this.undoManager = new UndoManager(128);
    this.undoManager.stateChanged = this.undoStateChanged.bind(this);

    this.undoCommand = commandRegistry.get(mindmaps.UndoCommand);
    this.undoCommand.setHandler(this.doUndo.bind(this));

    this.redoCommand = commandRegistry.get(mindmaps.RedoCommand);
    this.redoCommand.setHandler(this.doRedo.bind(this));

    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened
        .bind(this));

    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed
        .bind(this));
  };

  /**
   * Handler for state changed event from undo manager.
   */
  this.undoStateChanged = function() {
    this.undoCommand.setEnabled(this.undoManager.canUndo());
    this.redoCommand.setEnabled(this.undoManager.canRedo());
  };

  /**
   * @see mindmaps.UndoManager#addUndo
   */
  this.addUndo = function(undoFunc, redoFunc) {
    this.undoManager.addUndo(undoFunc, redoFunc);
  };

  /**
   * Handler for undo command.
   */
  this.doUndo = function() {
    this.undoManager.undo();
  };

  /**
   * Handler for redo command.
   */
  this.doRedo = function() {
    this.undoManager.redo();
  };

  /**
   * Handler for document opened event.
   */
  this.documentOpened = function() {
    this.undoManager.reset();
    this.undoStateChanged();
  };

  /**
   * Handler for document closed event.
   */
  this.documentClosed = function() {
    this.undoManager.reset();
    this.undoStateChanged();
  };

  this.init();
};
