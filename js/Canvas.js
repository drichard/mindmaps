var CanvasView = function() {
	MicroEvent.mixin(CanvasView);
	this.$canvasContainer = $("#canvas-container");
	this.$drawingArea = $("#drawing-area");

	this.setHeight = function(height) {
		this.$canvasContainer.height(height);
	};

	this.enableScroll = function() {
		this.$canvasContainer.scrollview();
	};
};

CanvasView.prototype.drawMap = function(map) {
	var renderer = new MindMapRenderer(map);
	renderer.draw(this.$drawingArea);
};

var MindMapRenderer = function(map) {
	var drawConnection = function(canvas, depth, offsetX, offsetY) {
		// console.log("drawing");
		var ctx = canvas.getContext("2d");

		var lineWidth = 10 - depth || 1;
		ctx.lineWidth = lineWidth;

		var startX = offsetX > 0 ? 0 : -offsetX;
		var startY = offsetY > 0 ? 0 : -offsetY;

		var endX = startX + offsetX;
		var endY = startY + offsetY;

		ctx.beginPath();
		ctx.moveTo(startX, startY);

		var cp1x = startX + (offsetX / 5);
		var cp1y = startY;
		var cp2x = startX + (offsetX / 2);
		var cp2y = endY;

		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
		// ctx.lineTo(startX + offsetX, startY + offsetY);
		ctx.stroke();

		// control points
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc(cp1x, cp1y, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.arc(cp2x, cp2y, 4, 0, Math.PI * 2);
		ctx.fill();
	};

	var positionCanvas = function($canvas, offsetX, offsetY) {
		var width = Math.abs(offsetX);
		var height = Math.abs(offsetY);

		var left = offsetX < 0 ? 0 : -width;
		var top = offsetY < 0 ? 0 : -height;

		$canvas.attr({
			width : width,
			height : height
		}).css({
			left : left + "px",
			top : top + "px"
		});
	};

	function createNode(node, $parent, depth) {
		var offsetX = node.offset.x;
		var offsetY = node.offset.y;

		// div node container
		var $node = $("<div/>", {
			id : "node-" + node.id,
			class : "node-container"
		}).css({
			left : offsetX + "px",
			top : offsetY + "px"
		}).data({
			depth : depth
		}).appendTo($parent);

		// node drag behaviour
		$node.draggable({
			handle : "div.node-caption:first",
			start : function() {
				console.log("drag start");
				// cant drag root
				if (node.isRoot()) {
					return false;
				}
			},
			drag : function(e, ui) {
				// reposition and draw canvas while dragging
				var $canvas = $("#canvas-node-" + node.id);
				var offsetX = ui.position.left;
				var offsetY = ui.position.top;
				var depth = $node.data("depth");

				positionCanvas($canvas, offsetX, offsetY);
				drawConnection($canvas[0], depth, offsetX, offsetY);
			},
			stop : function() {

			}
		});

		// text
		var $text = $("<div/>", {
			class : "node-caption",
			text : node.text.caption,
			click : function(e) {
				e.preventDefault();
				console.log(node.id, "clicked");
				return false;
			}
		}).appendTo($node);

		// draw canvas to parent if node is not a root
		if (!node.isRoot()) {
			// create canvas element
			var $canvas = $("<canvas>", {
				id : "canvas-node-" + node.id,
				class : "line-canvas"
			});

			// position and draw connection
			positionCanvas($canvas, offsetX, offsetY);
			drawConnection($canvas[0], depth, offsetX, offsetY);

			$canvas.appendTo($node);
		}

		// draw child nodes
		node.forEachChild(function(child) {
			createNode(child, $node, depth + 1);
		});
	}

	this.draw = function($container) {
		var root = map.root;

		// center root
		var center = new Point($container.width() / 2, $container.height() / 2);
		root.offset = center;

		createNode(root, $container, 0);
	};
};

var CanvasPresenter = function(view, eventBus) {
	this.view = view;

	eventBus.subscribe("mindMapLoaded", function(map) {
		view.drawMap(map);
	});
};