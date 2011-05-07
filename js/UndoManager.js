// TODO limit max stack size?
function UndoManager() {
	var State = {
		UNDO : "undo",
		REDO : "redo"
	};

	var self = this;
	var undoStack = [];
	var redoStack = [];
	var undoContext = false;
	var currentAction = null;
	var currentState = null;

	var onStateChange = function() {
		if (self.stateChanged) {
			self.stateChanged();
		}
	};

	var callAction = function(action) {
		currentAction = action;
		undoContext = true;
		switch (currentState) {
		case State.UNDO:
			action.undo();
			break;
		case State.REDO:
			action.redo();
			break;
		}
		undoContext = false;
	};

	/**
	 * Register an undo operation. A call to .undo() will cause the undo
	 * function to be executed. If you omit the second argument and the undo
	 * function will cause the registration of another undo operation, then this
	 * operation will be used as the redo function.
	 * 
	 * If you provide both arguments, a call to addUndo() during an undo() or
	 * redo() will have no effect.
	 * 
	 * 
	 * @param undoFunc -
	 *            The function that should undo the changes.
	 * @param redoFunc
	 *            (optional) - The function that should redo the undone changes.
	 */
	this.addUndo = function(undoFunc, redoFunc) {
		if (undoContext) {
			/**
			 * If we are currently undoing an action, and addUndo has been
			 * called with one argument, we store this function as the redo
			 * action, otherwise (more arguments) we already have an appropriate
			 * redo function.
			 */
			if (arguments.length === 1 && state == State.UNDO) {
				currentAction.redo = undoFunc;
			}
		} else {
			/**
			 * We are not undoing right now. Store the functions as an action.
			 */
			var action = {
				undo : undoFunc,
				redo : redoFunc
			};
			undoStack.push(action);
			// clear redo stack
			redoStack.length = 0;
			onStateChange();
		}
	};

	this.undo = function() {
		if (this.canUndo()) {
			currentState = State.UNDO;
			var action = undoStack.pop();
			callAction(action);
			redoStack.push(action);

			onStateChange();
		}
	};

	this.redo = function() {
		if (this.canRedo()) {
			currentState = State.REDO;
			var action = redoStack.pop();
			callAction(action);
			undoStack.push(action);

			onStateChange();
		}
	};

	this.canUndo = function() {
		return undoStack.length > 0;
	};

	this.canRedo = function() {
		return redoStack.length > 0;
	};

	this.reset = function() {
		undoStack.length = 0;
		redoStack.length = 0;
		undoContext = false;
		currentAction = null;
		currentState = null;
	};
}