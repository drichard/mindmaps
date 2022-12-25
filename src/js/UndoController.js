mindmaps.UndoController = function(e, t) {
    this.init = function() {
        this.undoManager = new UndoManager(128);
        this.undoManager.stateChanged = this.undoStateChanged.bind(this);
        this.undoCommand = t.get(mindmaps.UndoCommand);
        this.undoCommand.setHandler(this.doUndo.bind(this));
        this.redoCommand = t.get(mindmaps.RedoCommand);
        this.redoCommand.setHandler(this.doRedo.bind(this));
        e.subscribe(mindmaps.Event.DOCUMENT_OPENED, this.documentOpened.bind(this));
        e.subscribe(mindmaps.Event.DOCUMENT_CLOSED, this.documentClosed.bind(this))
    };
    this.undoStateChanged = function() {
        this.undoCommand.setEnabled(this.undoManager.canUndo());
        this.redoCommand.setEnabled(this.undoManager.canRedo())
    };
    this.addUndo = function(e, t) {
        this.undoManager.addUndo(e, t)
    };
    this.doUndo = function() {
        this.undoManager.undo()
    };
    this.doRedo = function() {
        this.undoManager.redo()
    };
    this.documentOpened = function() {
        this.undoManager.reset();
        this.undoStateChanged()
    };
    this.documentClosed = function() {
        this.undoManager.reset();
        this.undoStateChanged()
    };
    this.init()
}