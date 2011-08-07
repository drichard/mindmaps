"use strict";
var mindmaps = mindmaps || {};

$(function() {
	var view = new mindmaps.StaticCanvasView($("#container"));
	var docs = mindmaps.LocalDocumentStorage.getDocuments();
	view.render(docs[1]);
});

mindmaps.StaticCanvasView = function($container) {
	// magic number. node caption padding top/bottom + node padding bottom - two
	// extra pixel from text metrics
	var padding = 8;

	var self = this;
	this.zoomFactor = 1;
	this.$getContainer = function() {
		return $container;
	};

	var textMetrics = new mindmaps.TextMetrics(this);

	var $canvas = $("<canvas/>").appendTo($container);
	var ctx = $canvas[0].getContext("2d");

	var branchDrawer = new mindmaps.CanvasBranchDrawer();
	branchDrawer.beforeDraw = function(width, height, left, top) {
		ctx.translate(left, top);
	};

	function drawBranch(node, depth, $node, $parent) {
		ctx.save();
		branchDrawer.render(ctx, depth, node.offset.x, node.offset.y, $node,
				$parent, node.branchColor, self.zoomFactor);
		ctx.restore();
	}

	function ViewNode(node, metrics, lineWidth) {

		this.width = function() {
			return metrics.width;
		};

		this.innerHeight = function() {
			return metrics.height + padding;
		};

		this.outerHeight = function() {
			return metrics.height + padding + lineWidth;
		};
	}

	function fakeJqueryNode(node, textMetrics, lineWidth) {
		return {
			width : function() {
				if (node.isRoot()) {
					return 0;
				}
				return textMetrics.width;
			},
			innerHeight : function() {
				return textMetrics.height + padding;
			},

			outerHeight : function() {
				return textMetrics.height + lineWidth + padding;
			}
		};
	}

	function prepare(mindmap) {
		var root = mindmap.getRoot();

	}

	/**
	 * @param {mindmaps.Document} document
	 */
	this.render = function(document) {
		var width = document.getWidth();
		var height = document.getHeight();
		$canvas.attr({
			width : width,
			height : height
		});

		var map = document.mindmap;
		var root = map.getRoot();

		ctx.textBaseline = "top";

		ctx.translate(width / 2, height / 2);

		drawNode(root, 0, null);

		function drawNode(node, depth, $parent) {
			ctx.save();
			var x = node.offset.x;
			var y = node.offset.y;
			var tm = textMetrics.getTextMetrics(node);
			var lineWidth = mindmaps.CanvasDrawingUtil.getLineWidth(
					self.zoomFactor, depth);

			ctx.translate(x, y);
			ctx.strokeStyle = "#CCC";
			// ctx.strokeRect(0, 0, tm.width, tm.height);

			var caption = node.getCaption();

			var font = node.text.font;
			ctx.strokeStyle = font.color;
			ctx.fillStyle = font.color;
			ctx.font = font.style + " " + font.weight + " " + font.size
					+ "px sans-serif";
			ctx.textAlign = "center";
			var captionX = tm.width/2;
			if (node.isRoot()) {
				captionX = 0;
			}
			// TODO underline manually. canvas doesnt support it

			function checkLength(str) {
				var ctm = ctx.measureText(str);
				return ctm.width <= tm.width;
			}

			if (checkLength(caption)) {
				ctx.fillText(caption, captionX, 0);
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

			// branch
			var $node = fakeJqueryNode(node, tm, lineWidth);
			if ($parent) {
				drawBranch(node, depth, $node, $parent);
			}

			// bottom border
			if (!node.isRoot()) {
				ctx.fillStyle = node.branchColor;
				ctx.fillRect(0, tm.height + padding, tm.width, lineWidth);
			}
			node.forEachChild(function(child) {
				drawNode(child, depth + 1, $node);
			});

			ctx.restore();
		}
	};
};
