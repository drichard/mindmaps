/**
 * Creates a new CanvasPresenter. The canvas presenter is responsible for drawing the mind map onto a
 * canvas view and reacting to user input on the map (e.g. dragging a node, double clicking it etc.)
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.CanvasView} view
 * @param {mindmaps.ZoomController} zoomController
 */
mindmaps.CanvasPresenter = function(eventBus, commandRegistry, mindmapModel,
    view, zoomController) {
  var self = this;
  var creator = view.getCreator();

  /**
   * Initializes this presenter.
   */
  this.init = function() {
    var editCaptionCommand = commandRegistry
        .get(mindmaps.EditNodeCaptionCommand);
    editCaptionCommand.setHandler(this.editNodeCaption.bind(this));

    var toggleNodeFoldedCommand = commandRegistry
        .get(mindmaps.ToggleNodeFoldedCommand);
    toggleNodeFoldedCommand.setHandler(toggleFold);
  };

  /**
   * Handles the edit caption command. Tells view to start edit mode for node.
   * 
   * @param {mindmaps.Node} node
   */
  this.editNodeCaption = function(node) {
    if (!node) {
      node = mindmapModel.selectedNode;
    }
    view.editNodeCaption(node);
  };

  /**
   * Toggles the fold state of a node.
   * 
   * @param {mindmaps.Node} node
   */
  var toggleFold = function(node) {
    if (!node) {
      node = mindmapModel.selectedNode;
    }

    // toggle node visibility
    var action = new mindmaps.action.ToggleNodeFoldAction(node);
    mindmapModel.executeAction(action);
  };

  /**
   * Tells the view to select a node.
   * 
   * @param {mindmaps.Node} selectedNode
   * @param {mindmaps.Node} oldSelectedNode
   */
  var selectNode = function(selectedNode, oldSelectedNode) {

    // deselect old node
    if (oldSelectedNode) {
      view.unhighlightNode(oldSelectedNode);
    }
    view.highlightNode(selectedNode);
  };

  // listen to events from view
  /**
   * View callback: Zoom on mouse wheel.
   * 
   * @ignore
   */
  view.mouseWheeled = function(delta) {
    view.stopEditNodeCaption();

    if (delta > 0) {
      zoomController.zoomIn();
    } else {
      zoomController.zoomOut();
    }
  };

  /**
   * View callback: Attach creator to node if mouse hovers over node.
   * 
   * @ignore
   */
  view.nodeMouseOver = function(node) {
    if (view.isNodeDragging() || creator.isDragging()) {
      // dont relocate the creator if we are dragging
    } else {
      creator.attachToNode(node);
    }
  };

  /**
   * View callback: Attach creator to node if mouse hovers over node caption.
   * 
   * @ignore
   */
  view.nodeCaptionMouseOver = function(node) {
    if (view.isNodeDragging() || creator.isDragging()) {
      // dont relocate the creator if we are dragging
    } else {
      creator.attachToNode(node);
    }
  };

  /**
   * View callback: Select node if mouse was pressed.
   * 
   * @ignore
   */
  view.nodeMouseDown = function(node) {
    mindmapModel.selectNode(node);
    // show creator
    creator.attachToNode(node);
  };

  // view.nodeMouseUp = function(node) {
  // };

  /**
   * View callback: Go into edit mode when node was double clicked.
   * 
   * @ignore
   */
  view.nodeDoubleClicked = function(node) {
    view.editNodeCaption(node);
  };

  // view.nodeDragging = function() {
  // };

  /**
   * View callback: Execute MoveNodeAction when node was dragged.
   * 
   * @ignore
   */
  view.nodeDragged = function(node, offset) {
    // view has updated itself

    // update model
    var action = new mindmaps.action.MoveNodeAction(node, offset);
    mindmapModel.executeAction(action);
  };

  /**
   * View callback: Toggle fold mode when fold button was clicked.
   * 
   * @ignore
   */
  view.foldButtonClicked = function(node) {
    toggleFold(node);
  };

  // CREATOR TOOL
  /**
   * View callback: Return new random color to view when creator tool was
   * started to drag.
   * 
   * @ignore
   */
  creator.dragStarted = function(node) {
    // set edge color for new node. inherit from parent or random when root
    var color = node.isRoot() ? mindmaps.Util.randomColor()
        : node.branchColor;
    return color;
  };

  /**
   * View callback: Create a new node when creator tool was stopped.
   * 
   * @ignore
   */
  creator.dragStopped = function(parent, offsetX, offsetY, distance) {
    // disregard if the creator was only dragged a bit
    if (distance < 50) {
      return;
    }

    // update the model
    var node = new mindmaps.Node();
    node.branchColor = creator.lineColor;
    node.offset = new mindmaps.Point(offsetX, offsetY);
    // indicate that we want to set this nodes caption after creation
    node.shouldEditCaption = true;

    mindmapModel.createNode(node, parent);
  };

  /**
   * View callback: Change node caption when text change was committed in
   * view.
   * 
   * @ignore
   * @param {mindmaps.Node} node
   * @param {String} str
   */
  view.nodeCaptionEditCommitted = function(node, str) {
    // avoid whitespace only strings
    var str = $.trim(str);
    if (!str) {
      return;
    }

    view.stopEditNodeCaption();
    mindmapModel.changeNodeCaption(node, str);
  };

  this.go = function() {
    view.init();
  };

  /**
   * Draw the mind map on the canvas.
   * 
   * @param {mindmaps.Document} doc
   */
  function showMindMap(doc) {
    view.setZoomFactor(zoomController.DEFAULT_ZOOM);
    var dimensions = doc.dimensions;
    view.setDimensions(dimensions.x, dimensions.y);
    var map = doc.mindmap;
    view.drawMap(map);
    view.center();

    mindmapModel.selectNode(map.root);
  }

  /**
   * Hook up with EventBus.
   */
  function bind() {
    // listen to global events
    eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function(doc,
        newDocument) {
      showMindMap(doc);

      // if (doc.isNew()) {
      // // edit root node on start
      // var root = doc.mindmap.root;
      // view.editNodeCaption(root);
      // }
    });

    eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function(doc) {
      view.clear();
    });

    eventBus.subscribe(mindmaps.Event.NODE_MOVED, function(node) {
      view.positionNode(node);
    });

    eventBus.subscribe(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function(
        node) {
      view.setNodeText(node, node.getCaption());

      // redraw node in case height has changed
      // TODO maybe only redraw if height has changed
      view.redrawNodeConnectors(node);
    });

    eventBus.subscribe(mindmaps.Event.NODE_CREATED, function(node) {
      view.createNode(node);

      // edit node caption immediately if requested
      if (node.shouldEditCaption) {
        delete node.shouldEditCaption;
        // open parent node when creating a new child and the other
        // children are hidden
        var parent = node.getParent();
        if (parent.foldChildren) {
          var action = new mindmaps.action.OpenNodeAction(parent);
          mindmapModel.executeAction(action);
        }

        // select and go into edit mode on new node
        mindmapModel.selectNode(node);
        // attach creator manually, sometimes the mouseover listener wont fire
        creator.attachToNode(node);
        view.editNodeCaption(node);
      }
    });

    eventBus.subscribe(mindmaps.Event.NODE_DELETED, function(node, parent) {
      // select parent if we are deleting a selected node or a descendant
      var selected = mindmapModel.selectedNode;
      if (node === selected || node.isDescendant(selected)) {
        // deselectCurrentNode();
        mindmapModel.selectNode(parent);
      }

      // update view
      view.deleteNode(node);
      if (parent.isLeaf()) {
        view.removeFoldButton(parent);
      }
    });

    eventBus.subscribe(mindmaps.Event.NODE_SELECTED, selectNode);
    
    eventBus.subscribe(mindmaps.Event.NODE_OPENED, function(node) {
      view.openNode(node);
    });

    eventBus.subscribe(mindmaps.Event.NODE_CLOSED, function(node) {
      view.closeNode(node);
    });

    eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(node) {
      view.updateNode(node);
    });

    eventBus.subscribe(mindmaps.Event.NODE_FONT_COLOR_PREVIEW, function(node, color) {
      view.updateFontColor(node, color);
    });

    eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function(
        node) {
      view.updateNode(node);
    });
    
    eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_PREVIEW, function(node, color) {
      view.updateBranchColor(node, color)
    });

    eventBus.subscribe(mindmaps.Event.ZOOM_CHANGED, function(zoomFactor) {
      view.setZoomFactor(zoomFactor);
      view.applyViewZoom();
      view.scaleMap();
    });
  }

  bind();
  this.init();
};
