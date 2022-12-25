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
  
  var connectorDrawer = new mindmaps.CanvasConnectorDrawer();
  connectorDrawer.beforeDraw = function(width, height, left, top) {
    ctx.translate(left, top);
  };

  var branchDrawer = new mindmaps.CanvasBranchDrawer();
  branchDrawer.beforeDraw = function(width, height, left, top) {
    ctx.translate(left, top);
  };

  function drawBranch(node, $parent) {
    ctx.save();
    branchDrawer.render(ctx, node.getDepth(), node.getPluginData("layout", "offset").x, node.getPluginData("layout", "offset").y,
        node, $parent, node.getPluginData("style","branchColor"), zoomFactor);
    ctx.restore();
  }
  
  function drawConnectors(node, depth, ctx) {
  ctx.save();
    //branchDrawer.render(ctx, node.getDepth(), node.getPluginData("layout", "offset").x, node.getPluginData("layout", "offset").y,
    //   node, $parent, node.getPluginData("style","branchColor"), zoomFactor);
	
	
	//dragging = false;
	//offsetX = node.getPluginData("layout","offset").x;
	//offsetY = node.getPluginData("layout","offset").y;
//	if(mindmaps.getConnectedNodes().length == 0)
//		return;



    //ctx.restore();

	 var filNodes = mindmaps.getConnectedNodes().filter(function (obj) {
                    return (obj.from == node.id);
                })

	console.log('con length is ' + filNodes.length);
		filNodes.forEach(function (cfnode) {
			//if($("#node-" + cfnode.from).length)
				//offsetX = node.getPluginData("layout","offset").x;
				//offsetY = node.getPluginData("layout","offset").y;
				drawConnector(ctx, depth, node.getPluginData("layout","offset").x, node.getPluginData("layout","offset").y, true, cfnode.from,cfnode.to, node.getRoot(), false, cfnode.style, cfnode.arrow, cfnode.color);
        });
		
		/*
		filNodes = mindmaps.getConnectedNodes().filter(function (obj) {
                    return (obj.to == node.id);
                })

				console.log('con length is ' + filNodes.length);
		filNodes.forEach(function (cfnode) {
			//if($("#node-" + cfnode.from).length)
				drawConnector(ctx, depth, offsetX, offsetY, false, cfnode.from,cfnode.to, node.getRoot(), dragging, cfnode.style, cfnode.arrow, cfnode.color);
        });
	*/
	ctx.restore();
  }
  
  	function getNodeFromId(root, id) 
	{
	var foundNode = null;
	
	if(root.id == id)
		foundNode = root;
	
	if(!foundNode)
		root.forEachChild(function (child) {
				if ( (r = getNodeFromId(child, id)) !== null )
					foundNode = r;
			});
	
	return foundNode;
}

    function $getNode(node) {
        return $("#node-" + node.id);
    }
	
  function drawConnector(ctx, depth, offsetX, offsetY, fromConnection, node, node2, root, dragging, style, arrow, color){

		dragging = dragging || false;
		node = getNodeFromId(root, node);
		node2 = getNodeFromId(root, node2);
		
		if(!node || !node2)
			return;
		


		var node1FullOffX = 0, node2FullOffX = 0;
					var node1FullOffY = 0, node2FullOffY = 0;
					
					if(fromConnection)
					{
						node1FullOffX = offsetX;
						node1FullOffY = offsetY;
						
						
						node2FullOffX = node2.getPluginData("layout","offset").x;
						node2FullOffY = node2.getPluginData("layout","offset").y;
						
					}
					/*
					else
					{
						node1FullOffX = node.getPluginData("layout","offset").x;
						node1FullOffY = node.getPluginData("layout","offset").y;
						
						node2FullOffX = offsetX;
						node2FullOffY = offsetY;
					}
					*/
					if(node.isRoot())
					{
						node1FullOffX = 0;
						node1FullOffY = 0;

					}
					if(!node.isRoot())
					{
					 tmp = node.getParent();
					 while(!tmp.isRoot())
					 {
						if(!fromConnection && tmp.id == node2.id)
						{
							node1FullOffX += offsetX;
							node1FullOffY += offsetY;
						}
						else
						{
							node1FullOffX += tmp.getPluginData("layout","offset").x;
							node1FullOffY += tmp.getPluginData("layout","offset").y;
							
						}
						tmp = tmp.getParent();
					 }
					
					}

					if(!node2.isRoot())
					{
					 tmp = node2.getParent();
					 while(!tmp.isRoot())
					 {
						if(fromConnection && tmp.id == node.id)
						{
							node2FullOffX += offsetX;
							node2FullOffY += offsetY;
							
						}
						else
						{
							node2FullOffX += tmp.getPluginData("layout","offset").x;
							node2FullOffY += tmp.getPluginData("layout","offset").y;
						}
						tmp = tmp.getParent();
					 }
					
					}

					 // position and draw connection
					    ctx.save();
					 drawConnectorLineCanvas(ctx, depth, node1FullOffX, node1FullOffY, node2FullOffX, node2FullOffY,  $getNode(node2), $getNode(node),
					color, style, arrow);
					//connectorDrawer.render(ctx, depth, node1FullOffX, node1FullOffY, node2FullOffX, node2FullOffY, $getNode(node2), $getNode(node),
            //color, zoomFactor, style, arrow);
			
			//branchDrawer.render(ctx, node.getDepth(), node.getPluginData("layout", "offset").x, node.getPluginData("layout", "offset").y,
       // node, $parent, node.getPluginData("style","branchColor"), zoomFactor);
    ctx.restore();
	}

		function drawConnectorLineCanvas(ctx, depth, node1FullOffX, node1FullOffY, node2FullOffX, node2FullOffY, $node, $parent, color, style, arrow) {
        //var canvas = $canvas[0];
        //var ctx = canvas.getContext("2d");


        // set $canvas for beforeDraw() callback.
        connectorDrawer.$canvas = $canvas;
        connectorDrawer.render(ctx, depth, node1FullOffX, node1FullOffY, node2FullOffX, node2FullOffY, $parent, $node,
            color, zoomFactor, style, arrow);
    }
	
  /**
   * Adds some information to each node which are needed for rendering.
   * 
   * @param mindmap
   */
  function prepareNodes(mindmap) {
    // clone tree since we modify it
    var root = mindmap.getRoot().cloneForExport();

    function addProps(node) {
      var lineWidth = mindmaps.CanvasDrawingUtil.getLineWidth(node,zoomFactor,
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
		console.log('left ' + left);
		console.log('right ' + right);
		console.log('top ' + top);
		console.log('bottom ' + bottom);
		
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
	drawAllConnectors(root);
    drawCaptions(root);
	
	 /**
     * Draws all connectors
     */
    function drawAllConnectors(node) {
		console.log('drawAllConnectors ' + node.getCaption());
      ctx.save();
      var x = node.getPluginData("layout", "offset").x;
      var y = node.getPluginData("layout", "offset").y;
      ctx.translate(x, y);


      drawConnectors(node, node.getDepth(), ctx);


      node.forEachChild(function(child) {
        drawAllConnectors(child);
      });

      ctx.restore();
    }
	

    /**
     * Draws all branches
     */
    function drawLines(node, parent) {
      ctx.save();
      var x = node.getPluginData("layout", "offset").x;
      var y = node.getPluginData("layout", "offset").y;
      ctx.translate(x, y);

      // branch
      if (parent) {
        drawBranch(node, parent);
      }

      // bottom border
      if (!node.isRoot()) {
        ctx.fillStyle = node.getPluginData("style","branchColor");
        var tm = node.textMetrics;
        ctx.fillRect(0, tm.height + padding, tm.width, node.lineWidth);
      }

      node.forEachChild(function(child) {
        drawLines(child, node);
      });

      ctx.restore();
    }

	function setLineDashCatch(ctx,param) {
  try {
    ctx.setLineDash(param);
  } catch (e) {
		 try {
		 ctx.mozDash = param;
	  } catch (e) {
	  }
	  finally {
	 }
  }
  finally {
 }
}

    /**
     * Draws all captions.
     * 
     * @param node
     */
    function drawCaptions(node) {
      ctx.save();
	  var borderStyle = node.getPluginData("style", "border") || {visible: true, style: "dashed", color: "#ffa500", background: "#ffffff"};
      var x = node.getPluginData("layout", "offset").x;
      var y = node.getPluginData("layout", "offset").y;
	  console.log(x + ',' + y);
      ctx.translate(x, y);

      var tm = node.textMetrics;
      var caption = node.getCaption();
      var font = node.getPluginData("style","font")
	  var imgData = node.getPluginData("image","data")
		

      // ctx.strokeStyle = "#CCC";
      // ctx.strokeRect(0, 0, tm.width, tm.height);

	  ctx.textAlign="center";
      ctx.font = font.style + " " + font.weight + " " + font.size
          + "px " + font.fontfamily;

      var captionX = tm.width / 2;
      var captionY = 0;


      if (node.isRoot()) 
	 {
        // TODO remove magic numbers
        captionX = 0;
        captionY = 20;

		if(borderStyle.style == 'dotted')
			setLineDashCatch(ctx,[3]);
		else if(borderStyle.style == 'dashed')
			setLineDashCatch(ctx,[8]);
		else
			setLineDashCatch(ctx,[0]);
			
	
        // root box
        ctx.lineWidth = 5.0;
        ctx.strokeStyle = borderStyle.color;
        ctx.fillStyle = borderStyle.background;
		x = 0 - tm.width / 2 - 4;
		y = 20 - 4;
        mindmaps.CanvasDrawingUtil.roundedRect(ctx,
            x, y, tm.width + 8,
            tm.height + 8, 10);
		
		if(imgData)
		{
			var nodeImg = new Image();
			nodeImg.src = imgData.data;
			if(imgData.align == 'bottom')
			{
				if(tm.fontW <= imgData.width)
					ctx.drawImage(nodeImg,x+6,y+tm.fontH+8,parseInt(imgData.width),parseInt(imgData.height));
				else
					ctx.drawImage(nodeImg,x+6+(tm.fontW-imgData.width)/2,y+tm.fontH+8,parseInt(imgData.width),parseInt(imgData.height));
				
			}
			else if(imgData.align == 'top')
			{
				if(tm.fontW <= imgData.width)
					ctx.drawImage(nodeImg,x+6,y+6,imgData.width,imgData.height);
				else
					ctx.drawImage(nodeImg,x+6+(tm.fontW-imgData.width)/2,y+6,imgData.width,imgData.height);
				captionY += parseInt(imgData.height);
			}
			else if(imgData.align == 'center')
			{
				startX = x+6;
				startY = y+6;
				if(tm.fontW > imgData.width)
					startX = x+6+(tm.fontW-imgData.width)/2;
				if(tm.fontH > imgData.height)
					startY = y+6+(tm.fontH-imgData.height)/2;
					
				ctx.drawImage(nodeImg,startX,startY,parseInt(imgData.width),parseInt(imgData.height));

				captionY += (tm.height/2 - tm.fontH/2);
			}
			else if(imgData.align == 'right')
			{
				ctx.textAlign="left";
				if(tm.fontH > imgData.height)
					ctx.drawImage(nodeImg,x+4+(tm.width-parseInt(imgData.width)),y+6+(tm.fontH-imgData.height)/2,parseInt(imgData.width),parseInt(imgData.height));
				else
					ctx.drawImage(nodeImg,x+4+(tm.width-parseInt(imgData.width)),y+6,parseInt(imgData.width),parseInt(imgData.height));
				captionY += (tm.height/2 - tm.fontH/2);
				captionX = x + /*tm.fontW/2 +*/ 4;
			}
			else if(imgData.align == 'left')
			{
				ctx.textAlign="right";
				if(tm.fontH > imgData.height)
					ctx.drawImage(nodeImg,x+6,y+6+(tm.fontH-imgData.height)/2,parseInt(imgData.width),parseInt(imgData.height));
				else
					ctx.drawImage(nodeImg,x+6,y+6,parseInt(imgData.width),parseInt(imgData.height));
				captionY += (tm.height/2 - tm.fontH/2);
				captionX = x + tm.width /*- tm.fontW*/ + 6;
			}
		}
      }
	  
	  else
	  {
        // TODO remove magic numbers
        //captionX = 0;
        //captionY = 20;

        // root box
        ctx.lineWidth = 5.0;
		
		if(borderStyle.visible)
		{
			ctx.strokeStyle = borderStyle.color;// "orange";
			
			if(borderStyle.style == 'dotted')
				ctx.setLineDash([3]);
			else if(borderStyle.style == 'dashed')
				ctx.setLineDash([8]);
			else
				ctx.setLineDash([0]);			
		}			
		else
		{
			ctx.strokeStyle = borderStyle.background;// "orange";
			ctx.setLineDash([0]);
		}
		
		x = 0 - 4;
		y = 20 - 4 - 20;
        ctx.fillStyle = borderStyle.background;// "white";
        mindmaps.CanvasDrawingUtil.roundedRect(ctx,
            x, y, tm.width + 8,
            tm.height + 8, 10);
		if(imgData)
		{
			var nodeImg = new Image();
			nodeImg.src = imgData.data;
			if(imgData.align == 'bottom')
			{
				if(tm.fontW <= imgData.width)
					ctx.drawImage(nodeImg,x+6,y+tm.fontH+8,parseInt(imgData.width),parseInt(imgData.height));
				else
					ctx.drawImage(nodeImg,x+6+(tm.fontW-imgData.width)/2,y+tm.fontH+8,parseInt(imgData.width),parseInt(imgData.height));
				
			}
			else if(imgData.align == 'top')
			{
				if(tm.fontW <= imgData.width)
					ctx.drawImage(nodeImg,x+6,y+6,imgData.width,imgData.height);
				else
					ctx.drawImage(nodeImg,x+6+(tm.fontW-imgData.width)/2,y+6,imgData.width,imgData.height);
				captionY += parseInt(imgData.height);
			}
			else if(imgData.align == 'center')
			{
				startX = x+6;
				startY = y+6;
				if(tm.fontW > imgData.width)
					startX = x+6+(tm.fontW-imgData.width)/2;
				if(tm.fontH > imgData.height)
					startY = y+6+(tm.fontH-imgData.height)/2;
					
				ctx.drawImage(nodeImg,startX,startY,parseInt(imgData.width),parseInt(imgData.height));

				captionY += (tm.height/2 - tm.fontH/2);
			}
			else if(imgData.align == 'right')
			{
				ctx.textAlign="left";
				if(tm.fontH > imgData.height)
					ctx.drawImage(nodeImg,x+4+(tm.width-parseInt(imgData.width)),y+6+(tm.fontH-imgData.height)/2,parseInt(imgData.width),parseInt(imgData.height));
				else
					ctx.drawImage(nodeImg,x+4+(tm.width-parseInt(imgData.width)),y+6,parseInt(imgData.width),parseInt(imgData.height));
				captionY += (tm.height/2 - tm.fontH/2);
				captionX = x + /*tm.fontW/2 +*/ 4;
			}
			else if(imgData.align == 'left')
			{
				ctx.textAlign="right";
				if(tm.fontH > imgData.height)
					ctx.drawImage(nodeImg,x+6,y+6+(tm.fontH-imgData.height)/2,parseInt(imgData.width),parseInt(imgData.height));
				else
					ctx.drawImage(nodeImg,x+6,y+6,parseInt(imgData.width),parseInt(imgData.height));
				captionY += (tm.height/2 - tm.fontH/2);
				captionX = x + tm.width /*- tm.fontW*/ + 6;
			}
		}
      }
	  

      ctx.strokeStyle = font.color;
      ctx.fillStyle = font.color;

      // TODO underline manually. canvas doesnt support it
      // TODO strike through manually

   /*
	function checkLength(str) {
        var ctm = ctx.measureText(str);
        return ctm.width <= tm.width;
      }
	*/ 
      // write node caption.
		//hasNewLine(caption);
		
		linesWords = caption.split(/\r\n|\r|\n/g);
		
      if (linesWords.length == 1 /*checkLength(caption)*/) {
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

 //       var regex = /[^ ]+ */gi;
 //       var words1 = caption.match(regex);
 //       console.log("words1", words1);

        /**
         * step 2
         */
/*
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
*/

        /**
         * step 3
         */
 /*
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
*/

        /**
         * step 4
         */
        // print lines
        for ( var j = 0; j < linesWords.length; j++) {
          var line = linesWords[j];
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
