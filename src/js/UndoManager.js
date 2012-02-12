/**
 * Creates a new UndoManager
 * 
 * @constructor
 * @param {Integer} [maxStackSize=64]
 */
function UndoManager(maxStackSize) {
  this.maxStackSize = maxStackSize || 64;

  var State = {
    UNDO : "undo",
    REDO : "redo"
  };

  var self = this;
  var undoStack = new UndoManager.CircularStack(this.maxStackSize);
  var redoStack = new UndoManager.CircularStack(this.maxStackSize);
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
   * @param {Function} undoFunc The function that should undo the changes.
   * @param {Function} [redoFunc] The function that should redo the undone
   *            changes.
   */
  this.addUndo = function(undoFunc, redoFunc) {
    if (undoContext) {
      /**
       * If we are currently undoing an action and don't have a redo
       * function yet, store the undo function to the undo function, which
       * is in turn the redo function.
       */
      if (currentAction.redo == null && currentState == State.UNDO) {
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
      redoStack.clear();

      onStateChange();
    }
  };

  /**
   * Undoes the last action.
   */
  this.undo = function() {
    if (this.canUndo()) {
      currentState = State.UNDO;
      var action = undoStack.pop();
      callAction(action);

      if (action.redo) {
        redoStack.push(action);
      }

      onStateChange();
    }
  };

  /**
   * Redoes the last action.
   */
  this.redo = function() {
    if (this.canRedo()) {
      currentState = State.REDO;
      var action = redoStack.pop();
      callAction(action);

      if (action.undo) {
        undoStack.push(action);
      }

      onStateChange();
    }
  };

  /**
   * 
   * @returns {Boolean} true if undo is possible, false otherwise.
   */
  this.canUndo = function() {
    return !undoStack.isEmpty();
  };

  /**
   * 
   * @returns {Boolean} true if redo is possible, false otherwise.
   */
  this.canRedo = function() {
    return !redoStack.isEmpty();
  };

  /**
   * Resets this instance of the undo manager.
   */
  this.reset = function() {
    undoStack.clear();
    redoStack.clear();
    undoContext = false;
    currentAction = null;
    currentState = null;

    onStateChange();
  };

  /**
   * Event that is fired when undo or redo state changes.
   * 
   * @event
   */
  this.stateChanged = function() {
  };
}

/**
 * Creates a new CircularStack. This is a stack implementation backed by a
 * circular buffer where the oldest entries automatically are overwritten when
 * new items are pushed onto the stack and the maximum size has been reached.
 * 
 * @constructor
 * @param {Integer} [maxSize=32]
 */
UndoManager.CircularStack = function(maxSize) {
  this.maxSize = maxSize || 32;
  this.buffer = [];
  this.nextPointer = 0;
};

/**
 * Pushes a new item onto the stack.
 * 
 * @param {Any} item
 */
UndoManager.CircularStack.prototype.push = function(item) {
  this.buffer[this.nextPointer] = item;
  this.nextPointer = (this.nextPointer + 1) % this.maxSize;
};

/**
 * Checks whether the stack is empty.
 * 
 * @returns {Boolean} true if empty, false otherwise.
 */
UndoManager.CircularStack.prototype.isEmpty = function() {
  if (this.buffer.length === 0) {
    return true;
  }

  var prevPointer = this.getPreviousPointer();
  if (prevPointer === null) {
    return true;
  } else {
    return this.buffer[prevPointer] === null;
  }
};

/**
 * Gets the position of the previously inserted item in the buffer.
 * 
 * @private
 * @returns {Integer} the previous pointer position or null if no previous
 *          exists.
 */
UndoManager.CircularStack.prototype.getPreviousPointer = function() {
  if (this.nextPointer > 0) {
    return this.nextPointer - 1;
  } else {
    if (this.buffer.length < this.maxSize) {
      return null;
    } else {
      return this.maxSize - 1;
    }
  }
};

/**
 * Clears the stack.
 */
UndoManager.CircularStack.prototype.clear = function() {
  this.buffer.length = 0;
  this.nextPointer = 0;
};

/**
 * Returns and removes the top most item of the stack.
 * 
 * @returns {Any} the last inserted item or null if stack is empty.
 */
UndoManager.CircularStack.prototype.pop = function() {
  if (this.isEmpty()) {
    return null;
  }

  var previousPointer = this.getPreviousPointer();
  var item = this.buffer[previousPointer];
  this.buffer[previousPointer] = null;
  this.nextPointer = previousPointer;

  return item;
};

/**
 * Returns but not removes the top most item of the stack.
 * 
 * @returns {Any} the last inserted item or null if stack is empty.
 */
UndoManager.CircularStack.prototype.peek = function() {
  if (this.isEmpty()) {
    return null;
  }
  return this.buffer[this.getPreviousPointer()];
};
