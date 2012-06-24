/**
 * <pre>
 * Creates a new MindMapModel. 
 * 
 * This object represents the underlying mind map model and provides access 
 * to the document, the mind map and the currently selected node.
 * 
 * All changes to the mind map pass through this object, either through calling
 * methods directly or using the executeAction() method to perform NodeActions.
 * </pre>
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 */
mindmaps.MindMapModel = function(eventBus, commandRegistry, undoController) {
  var self = this;
  this.document = null;
  this.selectedNode = null;

  /**
   * Gets the current document.
   * 
   * @returns {mindmaps.Document} the current document.
   */
  this.getDocument = function() {
    return this.document;
  };

  /**
   * Sets the current document and will publish a DOCUMENT_OPENED or
   * DOCUMENT_CLOSED event.
   * 
   * @param {mindmaps.Document} doc or pass null to close the document
   */
  this.setDocument = function(doc) {
    this.document = doc;
    if (doc) {
      eventBus.publish(mindmaps.Event.DOCUMENT_OPENED, doc);
    } else {
      eventBus.publish(mindmaps.Event.DOCUMENT_CLOSED);
    }
  };

  /**
   * Gets the current mind map associated with the document.
   * 
   * @returns {mindmaps.MindMap} the mind map or null
   */
  this.getMindMap = function() {
    if (this.document) {
      return this.document.mindmap;
    }
    return null;
  };

  /**
   * Initialise.
   * 
   * @private
   */
  this.init = function() {
    var createNodeCommand = commandRegistry.get(mindmaps.CreateNodeCommand);
    createNodeCommand.setHandler(this.createNode.bind(this));

    var createSiblingNodeCommand = commandRegistry
        .get(mindmaps.CreateSiblingNodeCommand);
    createSiblingNodeCommand.setHandler(this.createSiblingNode.bind(this));

    var deleteNodeCommand = commandRegistry.get(mindmaps.DeleteNodeCommand);
    deleteNodeCommand.setHandler(this.deleteNode.bind(this));

    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
      createNodeCommand.setEnabled(false);
      createSiblingNodeCommand.setEnabled(false);
      deleteNodeCommand.setEnabled(false);
    });

    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
      createNodeCommand.setEnabled(true);
      createSiblingNodeCommand.setEnabled(true);
      deleteNodeCommand.setEnabled(true);
    });
  };

  /**
   * Deletes a node or the currently selected one if no argument is passed.
   * 
   * @param {mindmaps.Node} [node] defaults to currently selected.
   */
  this.deleteNode = function(node) {
    if (!node) {
      node = this.selectedNode;
    }
    var map = this.getMindMap();
    var action = new mindmaps.action.DeleteNodeAction(node, map);
    this.executeAction(action);
  };

  /**
   * Attaches a new node the mind map. If invoked without arguments, it will
   * add a new child to the selected node with an automatically generated
   * position.
   * 
   * @param {mindmaps.Node} node the new node
   * @param {mindmaps.Node} parent
   */
  this.createNode = function(node, parent) {
    var map = this.getMindMap();
    if (!(node && parent)) {
      parent = this.selectedNode;
      var action = new mindmaps.action.CreateAutoPositionedNodeAction(
          parent, map);
    } else {
      var action = new mindmaps.action.CreateNodeAction(node, parent, map);
    }

    this.executeAction(action);
  };

  /**
   * Creates a new auto positioned node as a sibling to the current selected
   * node.
   */
  this.createSiblingNode = function() {
    var map = this.getMindMap();
    var selected = this.selectedNode;
    var parent = selected.getParent();

    // root nodes dont have a parent
    if (parent === null) {
      return;
    }

    var action = new mindmaps.action.CreateAutoPositionedNodeAction(parent,
        map);
    this.executeAction(action);
  };

  /**
   * Sets the node as the currently selected.
   * 
   * @param {mindmaps.Node} node
   */
  this.selectNode = function(node) {
    if (node === this.selectedNode) {
      return;
    }

    var oldSelected = this.selectedNode;
    this.selectedNode = node;
    eventBus.publish(mindmaps.Event.NODE_SELECTED, node, oldSelected);
  };

  /**
   * Changes the caption for the passed node or for the selected one if node
   * is null.
   * 
   * @param {mindmaps.Node} node
   * @param {String} caption
   */
  this.changeNodeCaption = function(node, caption) {
    if (!node) {
      node = this.selectedNode;
    }

    var action = new mindmaps.action.ChangeNodeCaptionAction(node, caption);
    this.executeAction(action);
  };

  /**
   * Executes a node action. An executed action might raise an event over the
   * event bus and cause an undo event to be emitted via
   * MindMapModel#undoAction.
   * 
   * @param {mindmaps.Action} action
   */
  this.executeAction = function(action) {
    // a composite action consists of multiple actions which are
    // processed individually.
    if (action instanceof mindmaps.action.CompositeAction) {
      var execute = this.executeAction.bind(this);
      action.forEachAction(execute);
      return;
    }

    var executed = action.execute();

    // cancel action if false was returned
    if (executed !== undefined && !executed) {
      return false;
    }

    // publish event
    if (action.event) {
      if (!Array.isArray(action.event)) {
        action.event = [ action.event ];
      }
      eventBus.publish.apply(eventBus, action.event);
    }

    // register undo function if available
    if (action.undo) {
      var undoFunc = function() {
        self.executeAction(action.undo());
      };

      // register redo function
      if (action.redo) {
        var redoFunc = function() {
          self.executeAction(action.redo());
        };
      }

      undoController.addUndo(undoFunc, redoFunc);
    }
  };

  /**
   * Saves a document to the localstorage and publishes DOCUMENT_SAVED event on success.
   *
   * @returns {Boolean} whether the save was successful.
   */
  this.saveToLocalStorage = function() {
    var doc = this.document.prepareSave();
    var success = mindmaps.LocalDocumentStorage.saveDocument(doc);
    if (success) {
      eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
    }

    return success;
  }

  this.init();
};
