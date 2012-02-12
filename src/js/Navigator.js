/**
 * Creates a NavigatorView. This view shows a minified version of the mindmap +
 * controls for adjusting the zoom.
 * 
 * @constructor
 */
mindmaps.NavigatorView = function() {
  var self = this;

  var $content = $("#template-navigator").tmpl();
  var $contentActive = $content.children(".active").hide();
  var $contentInactive = $content.children(".inactive").hide();
  var $dragger = $("#navi-canvas-overlay", $content);
  var $canvas = $("#navi-canvas", $content);

  /**
   * Returns the content.
   * 
   * @returns {jQuery}
   */
  this.getContent = function() {
    return $content;
  };

  /**
   * Shows the active content.
   */
  this.showActiveContent = function() {
    $contentInactive.hide();
    $contentActive.show();
  };

  /**
   * Shows the inactive content.
   */
  this.showInactiveContent = function() {
    $contentActive.hide();
    $contentInactive.show();
  };

  /**
   * Adjusts the size of the red rectangle.
   * 
   * @param {Number} width
   * @param {Nubmer} height
   */
  this.setDraggerSize = function(width, height) {
    $dragger.css({
      width : width,
      height : height
    });
  };

  /**
   * Sets the position of the dragger rectangle.
   * 
   * @param {Number} x
   * @param {Number} y
   */
  this.setDraggerPosition = function(x, y) {
    $dragger.css({
      left : x,
      top : y
    });
  };

  /**
   * Sets the height of the mini canvas.
   * 
   * @param {Number} height
   */
  this.setCanvasHeight = function(height) {
    $("#navi-canvas", $content).css({
      height : height
    });
  };

  /**
   * Gets the width of the mini canvas.
   * 
   * @returns {Number}
   */
  this.getCanvasWidth = function() {
    return $("#navi-canvas", $content).width();
  };

  this.init = function(canvasSize) {
    $("#navi-slider", $content).slider({
      // TODO remove magic numbers. get values from presenter
      min : 0,
      max : 11,
      step : 1,
      value : 3,
      slide : function(e, ui) {
        if (self.sliderChanged) {
          self.sliderChanged(ui.value);
        }
      }
    });

    $("#button-navi-zoom-in", $content).button({
      text : false,
      icons : {
        primary : "ui-icon-zoomin"
      }
    }).click(function() {
      if (self.buttonZoomInClicked) {
        self.buttonZoomInClicked();
      }
    });

    $("#button-navi-zoom-out", $content).button({
      text : false,
      icons : {
        primary : "ui-icon-zoomout"
      }
    }).click(function() {
      if (self.buttonZoomOutClicked) {
        self.buttonZoomOutClicked();
      }
    });

    // make draggable
    $dragger.draggable({
      containment : "parent",
      start : function(e, ui) {
        if (self.dragStart) {
          self.dragStart();
        }
      },
      drag : function(e, ui) {
        if (self.dragging) {
          var x = ui.position.left;
          var y = ui.position.top;
          self.dragging(x, y);
        }
      },
      stop : function(e, ui) {
        if (self.dragStop) {
          self.dragStop();
        }
      }
    });
  };

  /**
   * Draws the complete mindmap onto the mini canvas.
   * 
   * @param {mindmaps.MindMap} mindmap
   * @param {Number} scaleFactor
   */
  this.draw = function(mindmap, scaleFactor) {
    var root = mindmap.root;
    var canvas = $canvas[0];
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.8;

    drawNode(root, width / 2, height / 2);

    // draw rect for root
    ctx.fillRect(width / 2 - 4, height / 2 - 2, 8, 4);

    function scale(value) {
      return value / scaleFactor;
    }

    function drawNode(node, x, y) {
      ctx.save();
      ctx.translate(x, y);

      if (!node.collapseChildren) {
        node.forEachChild(function(child) {
          ctx.beginPath();
          ctx.strokeStyle = child.branchColor;
          ctx.moveTo(0, 0);
          var posX = scale(child.offset.x);
          var posY = scale(child.offset.y);
          // var textWidth =
          // ctx.measureText(child.getCaption()).width;
          var textWidth = 5;

          /**
           * draw two lines: one going up to the node, and a second
           * horizontal line for the node caption. if node is left of
           * the parent (posX < 0), we shorten the first line and draw
           * the rest horizontally to arrive at the node's offset
           * position. in the other case, we draw the line to the
           * node's offset and draw another for the text.
           */
          if (posX < 0) {
            var firstStop = posX + textWidth;
            var secondStop = posX;
          } else {
            var firstStop = posX;
            var secondStop = posX + textWidth;
          }
          ctx.lineTo(firstStop, posY);
          ctx.lineTo(secondStop, posY);

          ctx.stroke();
          drawNode(child, secondStop, posY);
        });
      }
      ctx.restore();
    }
  };

  /**
   * Shows the zoom level as percentage.
   * 
   * @param {String} zoom
   */
  this.showZoomLevel = function(zoom) {
    $("#navi-zoom-level").text(zoom);
  };

  /**
   * Sets the value of the zoom slider.
   * 
   * @param {Integer} value
   */
  this.setSliderValue = function(value) {
    $("#navi-slider").slider("value", value);
  };
};

/**
 * Creates a new NavigatorPresenter.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.NavigatorView} view
 * @param {mindmaps.CanvasContainer} container
 * @param {mindmaps.ZoomController} zoomController
 */
mindmaps.NavigatorPresenter = function(eventBus, view, container,
    zoomController) {
  var self = this;
  var $container = container.getContent();
  var viewDragging = false;
  var scale = zoomController.DEFAULT_ZOOM;
  var canvasSize = new mindmaps.Point();
  var docSize = null;
  var mindmap = null;

  /**
   * Calculates and sets the size of the dragger element.
   */
  function calculateDraggerSize() {
    var cw = $container.width() / scale;
    var ch = $container.height() / scale;
    // doc.x / container.x = canvas.x / dragger.x
    var width = (cw * canvasSize.x) / docSize.x;
    var height = (ch * canvasSize.y) / docSize.y;

    // limit size to bounds of canvas
    if (width > canvasSize.x) {
      width = canvasSize.x;
    }

    if (height > canvasSize.y) {
      height = canvasSize.y;
    }

    view.setDraggerSize(width, height);
  }

  /**
   * Calculates and sets the size of the mini canvas.
   */
  function calculateCanvasSize() {
    var width = view.getCanvasWidth();
    var _scale = docSize.x / width;
    var height = docSize.y / _scale;

    view.setCanvasHeight(height);

    canvasSize.x = width;
    canvasSize.y = height;
  }

  /**
   * Calculates and sets the possition of the dragger element.
   */
  function calculateDraggerPosition() {
    var sl = $container.scrollLeft() / scale;
    var st = $container.scrollTop() / scale;

    // sl / dox = dl / cw
    // dl = sl * cw / dox
    var left = sl * canvasSize.x / docSize.x;
    var top = st * canvasSize.y / docSize.y;
    view.setDraggerPosition(left, top);
  }

  /**
   * Calculates and sets the zoom level.
   */
  function calculateZoomLevel() {
    var zoomlevel = scale * 100 + " %";
    view.showZoomLevel(zoomlevel);
  }

  /**
   * Calculates and sets the slider value for the zoom level.
   */
  function calculateSliderValue() {
    var val = scale / zoomController.ZOOM_STEP - 1;
    view.setSliderValue(val);
  }

  /**
   * Initialize view when a document was opened.
   */
  function documentOpened(doc) {
    docSize = doc.dimensions;
    mindmap = doc.mindmap;

    calculateCanvasSize();
    calculateDraggerPosition();
    calculateDraggerSize();
    calculateZoomLevel();
    calculateSliderValue();
    renderView();

    view.showActiveContent();

    // move dragger when container was scrolled
    $container.bind("scroll.navigator-view", function() {
      if (!viewDragging) {
        calculateDraggerPosition();
      }
    });
  }

  /**
   * Update the canvas of the view component.
   */
  function renderView() {
    // draw canvas
    var scale = docSize.x / canvasSize.x;
    view.draw(mindmap, scale);
  }

  /**
   * Reset when document was closed.
   */
  function documentClosed() {
    docSize = null;
    mindmap = null;
    scale = 1;
    // clean up
    // remove listeners
    $container.unbind("scroll.navigator-view");

    view.showInactiveContent();
  }

  /**
   * View callbacks.
   * 
   * @ignore
   */

  view.dragStart = function() {
    viewDragging = true;
  };

  // scroll container when the dragger is dragged
  view.dragging = function(x, y) {
    var scrollLeft = scale * docSize.x * x / canvasSize.x;
    var scrollTop = scale * docSize.y * y / canvasSize.y;
    $container.scrollLeft(scrollLeft).scrollTop(scrollTop);
  };

  view.dragStop = function() {
    viewDragging = false;
  };

  view.buttonZoomInClicked = function() {
    zoomController.zoomIn();
  };

  view.buttonZoomOutClicked = function() {
    zoomController.zoomOut();
  };

  view.sliderChanged = function(value) {
    zoomController.zoomTo((value + 1) * zoomController.ZOOM_STEP);
  };

  // set dragger size when container was resized
  container.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function() {
    if (docSize) {
      calculateDraggerSize();
    }
  });

  // document events
  eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, documentOpened);
  eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, documentClosed);

  // node events
  eventBus.subscribe(mindmaps.Event.NODE_MOVED, renderView);
  eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, renderView);
  eventBus.subscribe(mindmaps.Event.NODE_CREATED, renderView);
  eventBus.subscribe(mindmaps.Event.NODE_DELETED, renderView);
  eventBus.subscribe(mindmaps.Event.NODE_OPENED, renderView);
  eventBus.subscribe(mindmaps.Event.NODE_CLOSED, renderView);

  eventBus.subscribe(mindmaps.Event.ZOOM_CHANGED, function(zoomFactor) {
    scale = zoomFactor;
    calculateDraggerPosition();
    calculateDraggerSize();
    calculateZoomLevel();
    calculateSliderValue();
  });

  this.go = function() {
    view.init();
    view.showInactiveContent();
  };
};
