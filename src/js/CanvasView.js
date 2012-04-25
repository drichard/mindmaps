// TODO take container as argument,c reate drawing area dynamically. remove on
// clear();, recreate on init()

/**
 * Creates a new CanvasView. This is the base class for all canvas view
 * implementations.
 * 
 * @constructor
 */
mindmaps.CanvasView = function() {
  /**
   * Returns the element that used to draw the map upon.
   * 
   * @returns {jQuery}
   */
  this.$getDrawingArea = function() {
    return $("#drawing-area");
  };

  /**
   * Returns the element that contains the drawing area.
   * 
   * @returns {jQuery}
   */
  this.$getContainer = function() {
    return $("#canvas-container");
  };

  /**
   * Scrolls the container to show the center of the drawing area.
   */
  this.center = function() {
    var c = this.$getContainer();
    var area = this.$getDrawingArea();
    var w = area.width() - c.width();
    var h = area.height() - c.height();
    this.scroll(w / 2, h / 2);
  };

  /**
   * Scrolls the container.
   * 
   * @param {Number} x
   * @param {Number} y
   */
  this.scroll = function(x, y) {
    var c = this.$getContainer();
    c.scrollLeft(x).scrollTop(y);
  };

  /**
   * Changes the size of the drawing area to match with with the new zoom
   * factor and scrolls the container to adjust the view port.
   */
  this.applyViewZoom = function() {
    var delta = this.zoomFactorDelta;
    // console.log(delta);

    var c = this.$getContainer();
    var sl = c.scrollLeft();
    var st = c.scrollTop();

    var cw = c.width();
    var ch = c.height();
    var cx = cw / 2 + sl;
    var cy = ch / 2 + st;

    cx *= this.zoomFactorDelta;
    cy *= this.zoomFactorDelta;

    sl = cx - cw / 2;
    st = cy - ch / 2;
    // console.log(sl, st);

    var drawingArea = this.$getDrawingArea();
    var width = drawingArea.width();
    var height = drawingArea.height();
    drawingArea.width(width * delta).height(height * delta);

    // scroll only after drawing area's width was set.
    this.scroll(sl, st);

    // adjust background size
    var backgroundSize = parseFloat(drawingArea.css("background-size"));
    if (isNaN(backgroundSize)) {
      // parsing could possibly fail in the future.
      console.warn("Could not set background-size!");
    }
    drawingArea.css("background-size", backgroundSize * delta);
  };

  /**
   * Applies the new size according to current zoom factor.
   * 
   * @param {Integer} width
   * @param {Integer} height
   */
  this.setDimensions = function(width, height) {
    width = width * this.zoomFactor;
    height = height * this.zoomFactor;

    var drawingArea = this.$getDrawingArea();
    drawingArea.width(width).height(height);
  };

  /**
   * Sets the new zoom factor and stores the delta to the old one.
   * 
   * @param {Number} zoomFactor
   */
  this.setZoomFactor = function(zoomFactor) {
    this.zoomFactorDelta = zoomFactor / (this.zoomFactor || 1);
    this.zoomFactor = zoomFactor;
  };
};

/**
 * Should draw the mind map onto the drawing area.
 * 
 * @param {mindmaps.MindMap} map
 */
mindmaps.CanvasView.prototype.drawMap = function(map) {
  throw new Error("Not implemented");
};

/**
 * Creates a new DefaultCanvasView. This is the reference implementation for
 * drawing mind maps.
 * 
 * @extends mindmaps.CanvasView
 * @constructor
 */
mindmaps.DefaultCanvasView = function() {
  var self = this;
  var nodeDragging = false;
  var creator = new Creator(this);
  var captionEditor = new CaptionEditor(this);
  captionEditor.commit = function(node, text) {
    if (self.nodeCaptionEditCommitted) {
      self.nodeCaptionEditCommitted(node, text);
    }
  };

  var textMetrics = mindmaps.TextMetrics;
  var branchDrawer = new mindmaps.CanvasBranchDrawer();
  branchDrawer.beforeDraw = function(width, height, left, top) {
    this.$canvas.attr({
      width : width,
      height : height
    }).css({
      left : left,
      top : top
    });
  };

  /**
   * Enables dragging of the map with the mouse.
   */
  function makeDraggable() {
    self.$getContainer().dragscrollable({
      dragSelector : "#drawing-area, canvas.line-canvas",
      acceptPropagatedEvent : false,
      delegateMode : true,
      preventDefault : true
    });
  }

  function $getNodeCanvas(node) {
    return $("#node-canvas-" + node.id);
  }

  function $getNode(node) {
    return $("#node-" + node.id);
  }

  function $getNodeCaption(node) {
    return $("#node-caption-" + node.id);
  }

  function drawLineCanvas($canvas, depth, offsetX, offsetY, $node, $parent,
      color) {
    var canvas = $canvas[0];
    var ctx = canvas.getContext("2d");

    // set $canvas for beforeDraw() callback.
    branchDrawer.$canvas = $canvas;
    branchDrawer.render(ctx, depth, offsetX, offsetY, $node, $parent,
        color, self.zoomFactor);
  }

  this.init = function() {
    makeDraggable();
    this.center();

    var $drawingArea = this.$getDrawingArea();
    $drawingArea.addClass("mindmap");

    // setup delegates
    $drawingArea.delegate("div.node-caption", "mousedown", function(e) {
      var node = $(this).parent().data("node");
      if (self.nodeMouseDown) {
        self.nodeMouseDown(node);
      }
    });

    $drawingArea.delegate("div.node-caption", "mouseup", function(e) {
      var node = $(this).parent().data("node");
      if (self.nodeMouseUp) {
        self.nodeMouseUp(node);
      }
    });

    $drawingArea.delegate("div.node-caption", "dblclick", function(e) {
      var node = $(this).parent().data("node");
      if (self.nodeDoubleClicked) {
        self.nodeDoubleClicked(node);
      }
    });

    $drawingArea.delegate("div.node-container", "mouseover", function(e) {
      if (e.target === this) {
        var node = $(this).data("node");
        if (self.nodeMouseOver) {
          self.nodeMouseOver(node);
        }
      }
      return false;
    });

    $drawingArea.delegate("div.node-caption", "mouseover", function(e) {
      if (e.target === this) {
        var node = $(this).parent().data("node");
        if (self.nodeCaptionMouseOver) {
          self.nodeCaptionMouseOver(node);
        }
      }
      return false;
    });

    // mouse wheel listener
    this.$getContainer().bind("mousewheel", function(e, delta) {
      if (self.mouseWheeled) {
        self.mouseWheeled(delta);
      }
    });
  };

  /**
   * Clears the drawing area.
   */
  this.clear = function() {
    var drawingArea = this.$getDrawingArea();
    drawingArea.children().remove();
    drawingArea.width(0).height(0);
  };

  /**
   * Calculates the width of a branch for a node for the given depth
   * 
   * @param {Integer} depth the depth of the node
   * @returns {Number}
   */
  this.getLineWidth = function(depth) {
    return mindmaps.CanvasDrawingUtil.getLineWidth(this.zoomFactor, depth);
  };

  /**
   * Draws the complete map onto the drawing area. This should only be called
   * once for a mind map.
   */
  this.drawMap = function(map) {
    var now = new Date().getTime();
    var $drawingArea = this.$getDrawingArea();

    // clear map first
    $drawingArea.children().remove();

    var root = map.root;

    // 1.5. do NOT detach for now since DIV dont have widths and heights,
    // and loading maps draws wrong canvases (or create nodes and then draw
    // canvases)

    var detach = false;
    if (detach) {
      // detach drawing area during map creation to avoid unnecessary DOM
      // repaint events. (binary7 is 3 times faster)
      var $parent = $drawingArea.parent();
      $drawingArea.detach();
      self.createNode(root, $drawingArea);
      $drawingArea.appendTo($parent);
    } else {
      self.createNode(root, $drawingArea);
    }

    console.debug("draw map ms: ", new Date().getTime() - now);
  };

  /**
   * Inserts a new node including all of its children into the DOM.
   * 
   * @param {mindmaps.Node} node - The model of the node.
   * @param {jQuery} [$parent] - optional jquery parent object the new node is
   *            appended to. Usually the parent node. If argument is omitted,
   *            the getParent() method of the node is called to resolve the
   *            parent.
   * @param {Integer} [depth] - Optional. The depth of the tree relative to
   *            the root. If argument is omitted the getDepth() method of the
   *            node is called to resolve the depth.
   */
  this.createNode = function(node, $parent, depth) {
    var parent = node.getParent();
    var $parent = $parent || $getNode(parent);
    var depth = depth || node.getDepth();
    var offsetX = node.offset.x;
    var offsetY = node.offset.y;

    // div node container
    var $node = $("<div/>", {
      id : "node-" + node.id,
      "class" : "node-container"
    }).data({
      node : node
    }).css({
      "font-size" : node.text.font.size
    });
    $node.appendTo($parent);

    if (node.isRoot()) {
      var w = this.getLineWidth(depth);
      $node.css("border-bottom-width", w);
    }

    if (!node.isRoot()) {
      // draw border and position manually only non-root nodes
      var bThickness = this.getLineWidth(depth);
      var bColor = node.branchColor;
      var bb = bThickness + "px solid " + bColor;

      $node.css({
        left : this.zoomFactor * offsetX,
        top : this.zoomFactor * offsetY,
        "border-bottom" : bb
      });

      // node drag behaviour
      /**
       * Only attach the drag handler once we mouse over it. this speeds
       * up loading of big maps.
       */
      $node.one("mouseenter", function() {
        $node.draggable({
          // could be set
          // revert: true,
          // revertDuration: 0,
          handle : "div.node-caption:first",
          start : function() {
            nodeDragging = true;
          },
          drag : function(e, ui) {
            // reposition and draw canvas while dragging
            var offsetX = ui.position.left / self.zoomFactor;
            var offsetY = ui.position.top / self.zoomFactor;
            var color = node.branchColor;
            var $canvas = $getNodeCanvas(node);

            drawLineCanvas($canvas, depth, offsetX, offsetY, $node,
                $parent, color);

            // fire dragging event
            if (self.nodeDragging) {
              self.nodeDragging();
            }
          },
          stop : function(e, ui) {
            nodeDragging = false;
            var pos = new mindmaps.Point(ui.position.left
                / self.zoomFactor, ui.position.top
                / self.zoomFactor);

            // fire dragged event
            if (self.nodeDragged) {
              self.nodeDragged(node, pos);
            }
          }
        });
      });
    }

    // text caption
    var font = node.text.font;
    var $text = $("<div/>", {
      id : "node-caption-" + node.id,
      "class" : "node-caption node-text-behaviour",
      text : node.text.caption
    }).css({
      "color" : font.color,
      "font-size" : this.zoomFactor * 100 + "%",
      "font-weight" : font.weight,
      "font-style" : font.style,
      "text-decoration" : font.decoration
    }).appendTo($node);

    var metrics = textMetrics.getTextMetrics(node, this.zoomFactor);
    $text.css(metrics);

    // create fold button for parent if he hasn't one already
    var parentAlreadyHasFoldButton = $parent.data("foldButton");
    var nodeOrParentIsRoot = node.isRoot() || parent.isRoot();
    if (!parentAlreadyHasFoldButton && !nodeOrParentIsRoot) {
      this.createFoldButton(parent);
    }

    if (!node.isRoot()) {
      // toggle visibility
      if (parent.foldChildren) {
        $node.hide();
      } else {
        $node.show();
      }

      // draw canvas to parent if node is not a root
      var $canvas = $("<canvas/>", {
        id : "node-canvas-" + node.id,
        "class" : "line-canvas"
      });

      // position and draw connection
      drawLineCanvas($canvas, depth, offsetX, offsetY, $node, $parent,
          node.branchColor);
      $canvas.appendTo($node);
    }

    if (node.isRoot()) {
      $node.children().andSelf().addClass("root");
    }

    // draw child nodes
    node.forEachChild(function(child) {
      self.createNode(child, $node, depth + 1);
    });
  };

  /**
   * Removes a node from the view and with it all its children and the branch
   * leading to the parent.
   * 
   * @param {mindmaps.Node} node
   */
  this.deleteNode = function(node) {
    // detach creator first, we need still him
    // creator.detach();

    // delete all DOM below
    var $node = $getNode(node);
    $node.remove();
  };

  /**
   * Highlights a node to show that it is selected.
   * 
   * @param {mindmaps.Node} node
   */
  this.highlightNode = function(node) {
    var $text = $getNodeCaption(node);
    $text.addClass("selected");
  };

  /**
   * Removes the hightlight of a node.
   * 
   * @param {mindmaps.Node} node
   */
  this.unhighlightNode = function(node) {
    var $text = $getNodeCaption(node);
    $text.removeClass("selected");
  };

  /**
   * Hides all children of a node.
   * 
   * @param {mindmaps.Node} node
   */
  this.closeNode = function(node) {
    var $node = $getNode(node);
    $node.children(".node-container").hide();

    var $foldButton = $node.children(".button-fold").first();
    $foldButton.removeClass("open").addClass("closed");
  };

  /**
   * Shows all children of a node.
   * 
   * @param {mindmaps.Node} node
   */
  this.openNode = function(node) {
    var $node = $getNode(node);
    $node.children(".node-container").show();

    var $foldButton = $node.children(".button-fold").first();
    $foldButton.removeClass("closed").addClass("open");
  };

  /**
   * Creates the fold button for a node that shows/hides its children.
   * 
   * @param {mindmaps.Node} node
   */
  this.createFoldButton = function(node) {
    var position = node.offset.x > 0 ? " right" : " left";
    var openClosed = node.foldChildren ? " closed" : " open";
    var $foldButton = $("<div/>", {
      "class" : "button-fold no-select" + openClosed + position
    }).click(function(e) {
      // fire event
      if (self.foldButtonClicked) {
        self.foldButtonClicked(node);
      }

      e.preventDefault();
      return false;
    });

    // remember that foldButton was set and attach to node
    var $node = $getNode(node);
    $node.data({
      foldButton : true
    }).append($foldButton);
  };

  /**
   * Removes the fold button.
   * 
   * @param {mindmaps.Node} node
   */
  this.removeFoldButton = function(node) {
    var $node = $getNode(node);
    $node.data({
      foldButton : false
    }).children(".button-fold").remove();
  };

  /**
   * Goes into edit mode for a node.
   * 
   * @param {mindmaps.Node} node
   */
  this.editNodeCaption = function(node) {
    captionEditor.edit(node, this.$getDrawingArea());
  };

  /**
   * Stops the current edit mode.
   */
  this.stopEditNodeCaption = function() {
    captionEditor.stop();
  };

  /**
   * Updates the text caption for a node.
   * 
   * @param {mindmaps.Node} node
   * @param {String} value
   */
  this.setNodeText = function(node, value) {
    var $text = $getNodeCaption(node);
    var metrics = textMetrics.getTextMetrics(node, this.zoomFactor, value);
    $text.css(metrics).text(value);
  };

  /**
   * Get a reference to the creator tool.
   * 
   * @returns {Creator}
   */
  this.getCreator = function() {
    return creator;
  };

  /**
   * Returns whether a node is currently being dragged.
   * 
   * @returns {Boolean}
   */
  this.isNodeDragging = function() {
    return nodeDragging;
  };

  /**
   * Redraws a node's branch to its parent.
   * 
   * @param {mindmaps.Node} node
   * @param {String} optional color
   */
  function drawNodeCanvas(node, color) {
    var parent = node.getParent();
    var depth = node.getDepth();
    var offsetX = node.offset.x;
    var offsetY = node.offset.y;
    color = color || node.branchColor;

    var $node = $getNode(node);
    var $parent = $getNode(parent);
    var $canvas = $getNodeCanvas(node);

    drawLineCanvas($canvas, depth, offsetX, offsetY, $node, $parent, color);
  }

  /**
   * Redraws all branches that a node is connected to.
   * 
   * @param {mindmaps.Node} node
   */
  this.redrawNodeConnectors = function(node) {

    // redraw canvas to parent
    if (!node.isRoot()) {
      drawNodeCanvas(node);
    }

    // redraw all child canvases
    if (!node.isLeaf()) {
      node.forEachChild(function(child) {
        drawNodeCanvas(child);
      });
    }
  };

  /**
   * Changes only the color of the branch leading up to it's parent.
   */
  this.updateBranchColor = function(node, color) {
    var $node = $getNode(node);
    $node.css("border-bottom-color", color);
    
    // redraw canvas to parent
    if (!node.isRoot()) {
      drawNodeCanvas(node, color);
    }
  };

  /**
   * Changes only the font color of a node.
   */
  this.updateFontColor = function(node, color) {
    var $text = $getNodeCaption(node);
    $text.css("color", color);
  };

  /**
   * Does a complete visual update of a node to reflect all of its attributes.
   * 
   * @param {mindmaps.Node} node
   */
  this.updateNode = function(node) {
    var $node = $getNode(node);
    var $text = $getNodeCaption(node);
    var font = node.text.font;
    $node.css({
      "font-size" : font.size,
      "border-bottom-color" : node.branchColor
    });

    var metrics = textMetrics.getTextMetrics(node, this.zoomFactor);

    $text.css({
      "color" : font.color,
      "font-weight" : font.weight,
      "font-style" : font.style,
      "text-decoration" : font.decoration
    }).css(metrics);

    this.redrawNodeConnectors(node);
  };

  /**
   * Moves the node a new position.
   * 
   * @param {mindmaps.Node} node
   */
  this.positionNode = function(node) {
    var $node = $getNode(node);
    // TODO try animate
    // position
    $node.css({
      left : this.zoomFactor * node.offset.x,
      top : this.zoomFactor * node.offset.y
    });

    // redraw canvas to parent
    drawNodeCanvas(node);
  };

  /**
   * Redraws the complete map to adapt to a new zoom factor.
   */
  this.scaleMap = function() {
    var zoomFactor = this.zoomFactor;
    var $root = this.$getDrawingArea().children().first();
    var root = $root.data("node");

    var w = this.getLineWidth(0);
    $root.css("border-bottom-width", w);

    // handle root differently
    var $text = $getNodeCaption(root);
    var metrics = textMetrics.getTextMetrics(root, this.zoomFactor);
    $text.css(
        {
          "font-size" : zoomFactor * 100 + "%",
          "left" : zoomFactor
              * -mindmaps.TextMetrics.ROOT_CAPTION_MIN_WIDTH / 2
        }).css(metrics);

    root.forEachChild(function(child) {
      scale(child, 1);
    });

    function scale(node, depth) {
      var $node = $getNode(node);

      // draw border and position manually
      var bWidth = self.getLineWidth(depth);

      $node.css({
        left : zoomFactor * node.offset.x,
        top : zoomFactor * node.offset.y,
        "border-bottom-width" : bWidth
      });

      var $text = $getNodeCaption(node);
      $text.css({
        "font-size" : zoomFactor * 100 + "%"
      });

      var metrics = textMetrics.getTextMetrics(node, self.zoomFactor);
      $text.css(metrics);

      // redraw canvas to parent
      drawNodeCanvas(node);

      // redraw all child canvases
      if (!node.isLeaf()) {
        node.forEachChild(function(child) {
          scale(child, depth + 1);
        });
      }
    }
  };

  /**
   * Creates a new CaptionEditor. This tool offers an inline editor component
   * to change a node's caption.
   * 
   * @constructor
   * @param {mindmaps.CanvasView} view
   */
  function CaptionEditor(view) {
    var self = this;
    var attached = false;

    // text input for node edits.
    var $editor = $("<textarea/>", {
      id : "caption-editor",
      "class" : "node-text-behaviour"
    }).bind("keydown", "esc", function() {
      self.stop();
    }).bind("keydown", "return", function() {
      commitText();
    }).mousedown(function(e) {
      // avoid premature canceling
      e.stopPropagation();
    }).blur(function() {
      commitText();
    }).bind(
        "input",
        function() {
          var metrics = textMetrics.getTextMetrics(self.node,
              view.zoomFactor, $editor.val());
          $editor.css(metrics);
          alignBranches();
        });

    function commitText() {
      if (attached && self.commit) {
        self.commit(self.node, $editor.val());
      }
    }

    function alignBranches() {
      // slightly defer execution for better performance on slow
      // browsers
      setTimeout(function() {
        view.redrawNodeConnectors(self.node);
      }, 1);
    }

    /**
     * Attaches the textarea to the node and temporarily removes the
     * original node caption.
     * 
     * @param {mindmaps.Node} node
     * @param {jQuery} $cancelArea
     */
    this.edit = function(node, $cancelArea) {
      if (attached) {
        return;
      }
      this.node = node;
      attached = true;

      // TODO put text into span and hide()
      this.$text = $getNodeCaption(node);
      this.$cancelArea = $cancelArea;

      this.text = this.$text.text();

      this.$text.css({
        width : "auto",
        height : "auto"
      }).empty().addClass("edit");

      // jquery ui prevents blur() event from happening when dragging a
      // draggable. need this
      // workaround to detect click on other draggable
      $cancelArea.bind("mousedown.editNodeCaption", function(e) {
        commitText();
      });

      var metrics = textMetrics.getTextMetrics(self.node,
          view.zoomFactor, this.text);
      $editor.attr({
        value : this.text
      }).css(metrics).appendTo(this.$text).select();

    };

    /**
     * Removes the editor from the node and restores its old text value.
     */
    this.stop = function() {
      if (attached) {
        attached = false;
        this.$text.removeClass("edit");
        $editor.detach();
        this.$cancelArea.unbind("mousedown.editNodeCaption");
        view.setNodeText(this.node, this.text);

        alignBranches();
      }
    };
  }

  /**
   * Creates a new Creator. This tool is used to drag out new branches to
   * create new nodes.
   * 
   * @constructor
   * @param {mindmaps.CanvasView} view
   * @returns {Creator}
   */
  function Creator(view) {
    var self = this;
    var dragging = false;

    this.node = null;
    this.lineColor = null;

    var $wrapper = $("<div/>", {
      id : "creator-wrapper"
    }).bind("remove", function(e) {
      // detach the creator when some removed the node or opened a new map
      self.detach();
      // and avoid removing from DOM
      e.stopImmediatePropagation();

      console.debug("creator detached.");
      return false;
    });

    // red dot creator element
    var $nub = $("<div/>", {
      id : "creator-nub"
    }).appendTo($wrapper);

    var $fakeNode = $("<div/>", {
      id : "creator-fakenode"
    }).appendTo($nub);

    // canvas used by the creator tool to draw new lines
    var $canvas = $("<canvas/>", {
      id : "creator-canvas",
      "class" : "line-canvas"
    }).hide().appendTo($wrapper);

    // make it draggable
    $wrapper.draggable({
      revert : true,
      revertDuration : 0,
      start : function() {
        dragging = true;
        // show creator canvas
        $canvas.show();
        if (self.dragStarted) {
          self.lineColor = self.dragStarted(self.node);
        }
      },
      drag : function(e, ui) {
        // update creator canvas
        var offsetX = ui.position.left / view.zoomFactor;
        var offsetY = ui.position.top / view.zoomFactor;

        // set depth+1 because we are drawing the canvas for the child
        var $node = $getNode(self.node);
        drawLineCanvas($canvas, self.depth + 1, offsetX, offsetY,
            $fakeNode, $node, self.lineColor);
      },
      stop : function(e, ui) {
        dragging = false;
        // remove creator canvas, gets replaced by real canvas
        $canvas.hide();
        if (self.dragStopped) {
          var $wp = $wrapper.position();
          var $wpLeft = $wp.left / view.zoomFactor;
          var $wpTop = $wp.top / view.zoomFactor;
          var nubLeft = ui.position.left / view.zoomFactor;
          var nubTop = ui.position.top / view.zoomFactor;

          var distance = mindmaps.Util.distance($wpLeft - nubLeft,
              $wpTop - nubTop);
          self.dragStopped(self.node, nubLeft, nubTop, distance);
        }

        // remove any positioning that the draggable might have caused
        $wrapper.css({
          left : "",
          top : ""
        });
      }
    });

    /**
     * Attaches the tool to a node.
     * 
     * @param {mindmaps.Node} node
     */
    this.attachToNode = function(node) {
      if (this.node === node) {
        return;
      }
      this.node = node;

      // position the nub correctly
      $wrapper.removeClass("left right");
      if (node.offset.x > 0) {
        $wrapper.addClass("right");
      } else if (node.offset.x < 0) {
        $wrapper.addClass("left");
      }

      // set border on our fake node for correct line drawing
      this.depth = node.getDepth();
      var w = view.getLineWidth(this.depth + 1);
      $fakeNode.css("border-bottom-width", w);

      var $node = $getNode(node);
      $wrapper.appendTo($node);
    };

    /**
     * Removes the tool from the current node.
     */
    this.detach = function() {
      $wrapper.detach();
      this.node = null;
    };

    /**
     * Returns whether the tool is currently in use being dragged.
     * 
     * @returns {Boolean}
     */
    this.isDragging = function() {
      return dragging;
    };
  }
};

// inherit from base canvas view
mindmaps.DefaultCanvasView.prototype = new mindmaps.CanvasView();
