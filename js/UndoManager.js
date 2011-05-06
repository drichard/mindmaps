// TODO limit max stack size?
function UndoManager() {
	this.undoStack = [];
	this.redoStack = [];
}

UndoManager.prototype.addAction = function(undoFunc, redoFunc) {
	var action = {
		undo : undoFunc,
		redo : redoFunc
	};
	this.undoStack.push(action);

	// clear redo stack
	this.redoStack.length = 0;
	
	this.onStateChange();
};

UndoManager.prototype.undo = function() {
	if (this.canUndo()) {
		var action = this.undoStack.pop();
		action.undo();
		this.redoStack.push(action);
		
		this.onStateChange();
	}
};

UndoManager.prototype.redo = function() {
	if (this.canRedo()) {
		var action = this.redoStack.pop();
		action.redo();
		this.undoStack.push(action);
		
		this.onStateChange();
	}
};

UndoManager.prototype.onStateChange = function() {
	if (this.stateChanged) {
		this.stateChanged();
	}
};

UndoManager.prototype.canUndo = function() {
	return this.undoStack.length > 0;
};

UndoManager.prototype.canRedo = function() {
	return this.redoStack.length > 0;
};