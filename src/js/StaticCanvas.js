// TODO proper emulation of line-break: word-wrap

/**
 * Object that renders a mindmap model onto a single canvas object. The map will
 * be drawn without it's interactive elements (fold buttons, creator nub) and
 * the resulting image will be trimmed to fit the map plus a bit of padding onto
 * it.
 * 
 * @constructor
 */
mindmaps.StaticCanvasRenderer = function() {

  // magic number. node caption padding top/bottom + node padding bottom - two
  // extra pixel from text metrics
  var padding = 8;
  var zoomFactor = 1;
  var self = this;

  var $canvas = $("<canvas/>", {
    "class" : "map"
  });
  var ctx = $canvas[0].getContext("2d");

  var branchDrawer = new mindmaps.CanvasBranchDrawer();
  branchDrawer.beforeDraw = function(width, height, left, top) {
    ctx.translate(left, top);
  };

  function drawBranch(node, $parent) {
    ctx.save();
    branchDrawer.render(ctx, node.getDepth(), node.offset.x, node.offset.y,
        node, $parent, node.branchColor, zoomFactor);
    ctx.restore();
  }

  /**
   * Adds some information to each node which are needed for rendering.
   * 
   * @param mindmap
   * @returns
   */
  function prepareNodes(mindmap) {
    // clone tree since we modify it
    var root = mindmap.getRoot().clone();

    function addProps(node) {
      var lineWidth = mindmaps.CanvasDrawingUtil.getLineWidth(zoomFactor,
          node.getDepth());
      var metrics = mindmaps.TextMetrics.getTextMetrics(node, zoomFactor);

      var props = {
        lineWidth : lineWidth,
        textMetrics : metrics,
        width : function() {
          if (node.isRoot()) {
            return 0;
          }
          return metrics.width;
        },
        innerHeight : function() {
          return metrics.height + padding;
        },

        outerHeight : function() {
          return metrics.height + lineWidth + padding;
        }
      };

      $.extend(node, props);

      node.forEachChild(function(child) {
        addProps(child);
      });
    }

    addProps(root);

    return root;
  }

  /**
   * Finds the nodes which are farthest away from the root and calculates the
   * actual dimensions of the mind map.
   * 
   * @param {mindmaps.Node} root
   * @returns {object} with properties width and height
   */
  function getMindMapDimensions(root) {
    var pos = root.getPosition();
    var left = 0, top = 0, right = 0, bottom = 0;
    var padding = 50;

    function checkDimensions(node) {
      var pos = node.getPosition();
      var tm = node.textMetrics;

      if (pos.x < left) {
        left = pos.x;
      }

      if (pos.x + tm.width > right) {
        right = pos.x + tm.width;
      }

      if (pos.y < top) {
        top = pos.y;
      }

      if (pos.y + node.outerHeight() > bottom) {
        bottom = pos.y + node.outerHeight();
      }
    }

    checkDimensions(root);
    root.forEachDescendant(function(node) {
      checkDimensions(node);
    });

    // find the longest offset to either side and use twice the length for
    // canvas width
    var horizontal = Math.max(Math.abs(right), Math.abs(left));
    var vertical = Math.max(Math.abs(bottom), Math.abs(top));

    return {
      width : 2 * horizontal + padding,
      height : 2 * vertical + padding
    };
  }

  /**
   * Returns the canvas image in Base64 encoding. The canvas has to be
   * rendered first.
   * 
   * @param {mindmaps.Document} document
   * @returns {String}
   */
  this.getImageData = function(document) {
    renderCanvas(document);
    return $canvas[0].toDataURL("image/png");
  };

  /**
   * Returns a jquery object containing an IMG object with the map as PNG.
   * 
   * @param {mindmaps.Document} document
   * @returns {jQuery}
   */
  this.renderAsPNG = function(document) {
    var data = this.getImageData(document);

    var $img = $("<img/>", {
      src : data,
      "class" : "map"
    });

    return $img;
  };

  /**
   * Returns the rendered canvas as a jQuery object.
   * 
   * @param {mindmaps.Document} document
   * @returns {jQuery}
   */
  this.renderAsCanvas = function(document) {
    renderCanvas(document);
    return $canvas;
  };

  /**
   * Renders the map onto the canvas.
   * 
   * @param {mindmaps.Document} document
   */
  function renderCanvas(document) {
    var map = document.mindmap;
    var root = prepareNodes(map);
    var dimensions = getMindMapDimensions(root);

    var width = dimensions.width;
    var height = dimensions.height;
    $canvas.attr({
      width : width,
      height : height
    });

    ctx.textBaseline = "top";
    ctx.textAlign = "center";

    // fill background white
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    // render in two passes: 1. lines, 2. captions. because we have
    // no z-index, captions should not be covered by lines
    drawLines(root);
    drawCaptions(root);

    /**
     * Draws all branches
     */
    function drawLines(node, parent) {
      ctx.save();
      var x = node.offset.x;
      var y = node.offset.y;
      ctx.translate(x, y);

      // branch
      if (parent) {
        drawBranch(node, parent);
      }

      // bottom border
      if (!node.isRoot()) {
        ctx.fillStyle = node.branchColor;
        var tm = node.textMetrics;
        ctx.fillRect(0, tm.height + padding, tm.width, node.lineWidth);
      }

      node.forEachChild(function(child) {
        drawLines(child, node);
      });

      ctx.restore();
    }

    /**
     * Draws all captions.
     * 
     * @param node
     */
    function drawCaptions(node) {
      ctx.save();
      var x = node.offset.x;
      var y = node.offset.y;
      ctx.translate(x, y);

      var tm = node.textMetrics;
      var caption = node.getCaption();
      var font = node.text.font;

      // ctx.strokeStyle = "#CCC";
      // ctx.strokeRect(0, 0, tm.width, tm.height);

      ctx.font = font.style + " " + font.weight + " " + font.size
          + "px sans-serif";

      var captionX = tm.width / 2;
      var captionY = 0;
      if (node.isRoot()) {
        // TODO remove magic numbers
        captionX = 0;
        captionY = 20;

        // root box
        ctx.lineWidth = 5.0;
        ctx.strokeStyle = "orange";
        ctx.fillStyle = "white";
        mindmaps.CanvasDrawingUtil.roundedRect(ctx,
            0 - tm.width / 2 - 4, 20 - 4, tm.width + 8,
            tm.height + 8, 10);
      }

      ctx.strokeStyle = font.color;
      ctx.fillStyle = font.color;

      // TODO underline manually. canvas doesnt support it
      // TODO strike through manually

      function checkLength(str) {
        var ctm = ctx.measureText(str);
        return ctm.width <= tm.width;
      }

      // write node caption.

      if (checkLength(caption)) {
        // easy part only one line
        ctx.fillText(caption, captionX, captionY);
      } else {
        /**
         * caption consists of multiple lines. needs special handling
         * that imitates the line breaking algorithm "word-wrap:
         * break-word;"
         * 
         * <pre>
         * 1. break up string into words
         * 2. cut words that are too long into smaller pieces so they fit on a line
         * 3. construct lines: fit as many words as possible on a line
         * 4. print lines
         * </pre>
         */

        /**
         * step 1
         */
        // check all words and break words that are too long for a one
        // line
        // TODO not perfect yet
        // find words in string (special treatment for hyphens)
        // a hyphen breaks like a white-space does
        // var regex = /(\w+-+)|(\w+)|(-+)/gi;
        // var regex = /[^- ]+[- ]*/gi;
        // var regex = /[^ -]+-* *|[- ]+/gi;
        // for now just match for words and the trailing space
        // hyphenating has probably be done in step 2
        var regex = /[^ ]+ */gi;
        var words1 = caption.match(regex);
        console.log("words1", words1);

        /**
         * step 2
         */
        var words2 = [];
        words1.forEach(function(word) {
          if (!checkLength(word)) {
            var part = "";
            for ( var i = 0; i < word.length; i++) {
              var c = word.charAt(i);
              if (checkLength(part + c)) {
                part += c;
                continue;
              } else {
                words2.push(part);
                part = c;
              }
            }
            words2.push(part);
          } else {
            words2.push(word);
          }
        });

        console.log("words2", words2);

        /**
         * step 3
         */
        var wordWidth = function(str) {
          return ctx.measureText(str).width;
        };

        var lines = [];
        var line = "";
        var lineWidth = tm.width;

        // construct invidual lines
        words2.forEach(function(word) {
          if (line === "") {
            line = word;
          } else {
            if (wordWidth(line + " " + word) > lineWidth) {
              lines.push(line);
              line = word;
            } else {
              line += " " + word;
            }
          }
        });
        lines.push(line);
        console.log("lines", lines);

        /**
         * step 4
         */
        // print lines
        for ( var j = 0; j < lines.length; j++) {
          var line = lines[j];
          ctx.fillText(line, captionX, captionY + j * font.size);
        }
      }

      node.forEachChild(function(child) {
        drawCaptions(child);
      });

      ctx.restore();
    }
  }
};
