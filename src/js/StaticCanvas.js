/**
 * Singleton module for communication between application and static canvas
 * viewer. Stores data about the mind map to render in session storage and
 * retrieves it.
 */
mindmaps.StaticCanvas = (function() {
	// session storage keys
	var prefix = "mindmaps.view.";
	var keyDocument = prefix + "document";
	var keyAction = prefix + "action";
	var keyOptions = prefix + "options";

	return {
		Action : {
			Print : "Print",
			View : "View",
			SaveAsPNG : "SaveAsPNG"
		},

		launch : function(document, action, options) {
			mindmaps.SessionStorage.put(keyDocument, document.serialize());
			mindmaps.SessionStorage.put(keyAction, action);

			if (options) {
				mindmaps.SessionStorage
						.put(keyOptions, JSON.stringify(options));
			}

			window.open("/mapviewer.html");
		},

		getAction : function() {
			var action = mindmaps.SessionStorage.get(keyAction);
			return action;
		},

		getDocument : function() {
			var json = mindmaps.SessionStorage.get(keyDocument);
			return mindmaps.Document.fromJSON(json);
		},

		getOptions : function() {
			var json = mindmaps.SessionStorage.get(keyOptions);
			if (!json) {
				return null;
			}

			return JSON.parse(json);
		}
	};
})();

/**
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

	function prepareNodes(mindmap) {
		// TODO check if we should clone the map instead of in-place edits
		var root = mindmap.getRoot();

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
	}

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

			if (pos.y + tm.height > bottom) {
				bottom = pos.y + tm.height;
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
	 * @returns {String}
	 */
	this.getImageData = function(document) {
		renderCanvas(document);
		return $canvas[0].toDataURL("image/png");
	};

	this.renderAsPNG = function(document) {
		var data = this.getImageData(document);

		var img = $("<img/>", {
			src : data,
			"class" : "map"
		});

		return img;
	};

	this.renderAsCanvas = function(document) {
		renderCanvas(document);
		return $canvas;
	};

	/**
	 * @param {mindmaps.Document} document
	 */
	function renderCanvas(document) {
		var map = document.mindmap;
		var root = map.getRoot();

		prepareNodes(map);
		var dimensions = getMindMapDimensions(root);

		var width = dimensions.width;
		var height = dimensions.height;
		$canvas.attr({
			width : width,
			height : height
		});

		ctx.textBaseline = "top";

		// fill background white
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);

		ctx.translate(width / 2, height / 2);

		// render in two passes: 1. lines, 2. captions. because we have
		// no z-index, captions should not be covered by lines
		drawLines(root);
		drawCaptions(root);

		function roundedRect(ctx, x, y, width, height, radius) {
			ctx.beginPath();
			ctx.moveTo(x, y + radius);
			ctx.lineTo(x, y + height - radius);
			ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
			ctx.lineTo(x + width - radius, y + height);
			ctx.quadraticCurveTo(x + width, y + height, x + width, y + height
					- radius);
			ctx.lineTo(x + width, y + radius);
			ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
			ctx.lineTo(x + radius, y);
			ctx.quadraticCurveTo(x, y, x, y + radius);
			ctx.stroke();
			ctx.fill();
		}

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

		function drawCaptions(node) {
			ctx.save();
			var x = node.offset.x;
			var y = node.offset.y;
			ctx.translate(x, y);

			// ctx.strokeStyle = "#CCC";
			// ctx.strokeRect(0, 0, tm.width, tm.height);

			var tm = node.textMetrics;
			var caption = node.getCaption();
			var font = node.text.font;

			ctx.font = font.style + " " + font.weight + " " + font.size
					+ "px sans-serif";
			ctx.textAlign = "center";
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
				roundedRect(ctx, 0 - tm.width / 2 - 4, 20 - 4, tm.width + 8,
						tm.height + 8, 10);
			}

			ctx.strokeStyle = font.color;
			ctx.fillStyle = font.color;

			// TODO underline manually. canvas doesnt support it

			function checkLength(str) {
				var ctm = ctx.measureText(str);
				return ctm.width <= tm.width;
			}

			// TODO line split
			if (checkLength(caption)) {
				ctx.fillText(caption, captionX, captionY);
			} else {
				var line = "";
				var lines = [];
				for ( var i = 0; i < caption.length; i++) {
					var c = caption.charAt(i);
					line += c;
					if (checkLength(line)) {
						continue;
					} else {
						var split = line.split(/\W/);
						split.forEach(function(s) {
							lines.push(s);
						});
						line = "";
					}
				}

				for ( var j = 0; j < lines.length; j++) {
					var line = lines[j];
					ctx.fillText(line, captionX, 4 + j * font.size);
				}
			}

			node.forEachChild(function(child) {
				drawCaptions(child);
			});

			ctx.restore();
		}
	}
};
