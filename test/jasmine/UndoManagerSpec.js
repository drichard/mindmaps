describe("UndoManager", function() {
  var undoManager;

  beforeEach(function() {
    undoManager = new UndoManager();
  });

  describe("when initialized", function() {
    it("should not be a able to undo", function() {
      expect(undoManager.canUndo()).toBeFalsy();
    });

    it("should not be a able to redo", function() {
      expect(undoManager.canRedo()).toBeFalsy();
    });
  });

  describe("when it was resetted", function() {
    beforeEach(function() {
      undoManager.addUndo(noOp);
      undoManager.addUndo(noOp);
      undoManager.addUndo(noOp);
      undoManager.undo();
      undoManager.redo();
      undoManager.reset();
    });

    it("should not be a able to undo", function() {
      expect(undoManager.canUndo()).toBeFalsy();
    });

    it("should not be a able to redo", function() {
      expect(undoManager.canRedo()).toBeFalsy();
    });
  });

  it("should add an undo", function() {
    undoManager.addUndo(noOp);

    expect(undoManager.canUndo()).toBeTruthy();
    expect(undoManager.canRedo()).not.toBeTruthy();
  });

  it("should undo", function() {
    var color = "red";
    color = "blue";
    undoManager.addUndo(function() {
      color = "red";
    });

    undoManager.undo();
    expect(color).toEqual("red");

  });

  it("should redo an undo", function() {
    var color = "red";
    color = "blue";
    undoManager.addUndo(function() {
      color = "red";

      // add redo
      undoManager.addUndo(function() {
        color = "blue";
      });
    });

    undoManager.undo();
    undoManager.redo();
    expect(color).toEqual("blue");
  });

  it("should accept custom redo function", function() {
    var color = "red";
    color = "blue";
    undoManager.addUndo(function() {
      color = "red";
    }, function() {
      color = "yellow";
    });

    undoManager.undo();
    undoManager.redo();
    expect(color).toEqual("yellow");
  });

  it("should not be possible to redo after addUndo", function() {
    undoManager.addUndo(noOp);
    undoManager.addUndo(noOp);
    undoManager.addUndo(noOp);
    undoManager.undo();
    undoManager.undo();
    undoManager.addUndo(noOp);
    expect(undoManager.canRedo()).toBeFalsy();
  });

  it("should respect max stack size", function() {
    undoManager = new UndoManager(2);

    // add too many undo ops
    undoManager.addUndo(noOp);
    undoManager.addUndo(noOp);
    undoManager.addUndo(noOp);
    undoManager.addUndo(noOp);

    undoManager.undo();
    expect(undoManager.canUndo()).toBeTruthy();
    undoManager.undo();
    expect(undoManager.canUndo()).toBeFalsy();
  });

  describe("when a state listener is attached", function() {
    var callback = jasmine.createSpy();

    beforeEach(function() {
      undoManager.stateChanged = callback;
    });

    it("should notify on reset", function() {
      undoManager.reset();
      expect(callback).toHaveBeenCalled();
    });

    it("should notify when undo was added", function() {
      undoManager.addUndo(noOp);
      expect(callback).toHaveBeenCalled();
    });

    it("should notify when undo happend", function() {
      undoManager.addUndo(noOp);
      callback = jasmine.createSpy();
      undoManager.stateChanged = callback;
      undoManager.undo();

      expect(callback).toHaveBeenCalled();
    });

    it("should notify when redo happend", function() {
      undoManager.addUndo(noOp, noOp);
      undoManager.undo();
      callback = jasmine.createSpy();
      undoManager.stateChanged = callback;
      undoManager.redo();

      expect(callback).toHaveBeenCalled();
    });
  });
});

describe("CircularStack", function() {

  describe("when default initialized", function() {
    var stack;
    beforeEach(function() {
      stack = new UndoManager.CircularStack;
    });

    it("should be empty", function() {
      expect(stack.isEmpty()).toBeTruthy();
    });

    it("should not pop anything", function() {
      expect(stack.pop()).toBeNull();
    });

    it("should not peek anything", function() {
      expect(stack.peek()).toBeNull();
    });

    describe("when a single item was added", function() {
      var item = 42;
      beforeEach(function() {
        stack.push(42);
      });

      it("should pop that item", function() {
        expect(stack.pop()).toBe(item);
      });

      it("should peek that item", function() {
        expect(stack.peek()).toBe(item);
      });

      it("should not be empty", function() {
        expect(stack.isEmpty()).toBeFalsy();
      });

      it("should be empty after clear", function() {
        stack.clear();
        expect(stack.isEmpty()).toBeTruthy();
      });
    });

    it("should pop items in LIFO order", function() {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });
  });
  
  it("should be possible to set a max stack size", function() {
    var max = 42;
    var stack = new UndoManager.CircularStack(max);
    
    // fill stack
    for ( var i = 0; i < max; i++) {
      stack.push(i);
    }
    
    // push some more
    for ( var i = 0; i < 5; i++) {
      stack.push(i);
    }
    
    // pop [max] items, should be something
    for ( var i = 0; i < max; i++) {
      expect(stack.pop()).not.toBeNull();
    }
    
    // pop some more, should be null
    expect(stack.pop()).toBeNull();
    expect(stack.pop()).toBeNull();
  });

  describe("when a stack went beyond its max size", function() {
    var stack;
    var max = 5;

    beforeEach(function() {
      stack = new UndoManager.CircularStack(max);

      var overflow = max + 2;
      for ( var i = 0; i < overflow; i++) {
        stack.push(i);
      }
    });

    it("should only pop [max] items", function() {
      for ( var i = 0; i < max; i++) {
        expect(stack.pop()).not.toBeNull();
      }
      expect(stack.pop()).toBeNull();
    });

    it("should remove the oldest item when pushing a new one", function() {
      // unroll stack to get first item
      var items = [];
      while(!stack.isEmpty()) {
        items.push(stack.pop());
      } 
      var oldest = items[0];
      
      // push all items back on stack
      items.forEach(function(item) {
        stack.push(item);
      });
      
      // push new item that should overwrite the oldest item
      stack.push("new item");
      
      // unroll again and get first item
      var newOldest;
      while(!stack.isEmpty()) {
        newOldest = stack.pop();
      } 
      
      // compare both first items
      expect(newOldest).not.toBe(oldest);
    });
  });
});
