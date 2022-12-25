function UndoManager(e) {
    this.maxStackSize = e || 64;
    var t = {
        UNDO: "undo",
        REDO: "redo"
    };
    var n = this;
    var r = new UndoManager.CircularStack(this.maxStackSize);
    var i = new UndoManager.CircularStack(this.maxStackSize);
    var s = false;
    var o = null;
    var u = null;
    var a = function() {
        if (n.stateChanged) {
            n.stateChanged()
        }
    };
    var f = function(e) {
        o = e;
        s = true;
        switch (u) {
            case t.UNDO:
                e.undo();
                break;
            case t.REDO:
                e.redo();
                break
        }
        s = false
    };
    this.addUndo = function(e, n) {
        if (s) {
            if (o.redo == null && u == t.UNDO) {
                o.redo = e
            }
        } else {
            var f = {
                undo: e,
                redo: n
            };
            r.push(f);
            i.clear();
            a()
        }
    };
    this.undo = function() {
        if (this.canUndo()) {
            u = t.UNDO;
            var e = r.pop();
            f(e);
            if (e.redo) {
                i.push(e)
            }
            a()
        }
    };
    this.redo = function() {
        if (this.canRedo()) {
            u = t.REDO;
            var e = i.pop();
            f(e);
            if (e.undo) {
                r.push(e)
            }
            a()
        }
    };
    this.canUndo = function() {
        return !r.isEmpty()
    };
    this.canRedo = function() {
        return !i.isEmpty()
    };
    this.reset = function() {
        r.clear();
        i.clear();
        s = false;
        o = null;
        u = null;
        a()
    };
    this.stateChanged = function() {}
}
UndoManager.CircularStack = function(e) {
    this.maxSize = e || 32;
    this.buffer = [];
    this.nextPointer = 0
};
UndoManager.CircularStack.prototype.push = function(e) {
    this.buffer[this.nextPointer] = e;
    this.nextPointer = (this.nextPointer + 1) % this.maxSize
};
UndoManager.CircularStack.prototype.isEmpty = function() {
    if (this.buffer.length === 0) {
        return true
    }
    var e = this.getPreviousPointer();
    if (e === null) {
        return true
    } else {
        return this.buffer[e] === null
    }
};
UndoManager.CircularStack.prototype.getPreviousPointer = function() {
    if (this.nextPointer > 0) {
        return this.nextPointer - 1
    } else {
        if (this.buffer.length < this.maxSize) {
            return null
        } else {
            return this.maxSize - 1
        }
    }
};
UndoManager.CircularStack.prototype.clear = function() {
    this.buffer.length = 0;
    this.nextPointer = 0
};
UndoManager.CircularStack.prototype.pop = function() {
    if (this.isEmpty()) {
        return null
    }
    var e = this.getPreviousPointer();
    var t = this.buffer[e];
    this.buffer[e] = null;
    this.nextPointer = e;
    return t
};
UndoManager.CircularStack.prototype.peek = function() {
    if (this.isEmpty()) {
        return null
    }
    return this.buffer[this.getPreviousPointer()]
}