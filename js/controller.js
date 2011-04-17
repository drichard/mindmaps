var CanvasGraphDrawer = function(ctx, map) {
	var root = map.root;

	this.draw = function() {
		function drawNode(node, depth) {
			ctx.save();
			ctx.translate(node.offset.x, node.offset.y);
			// ctx.font = 'normal 12px sans-serif';
			// ctx.fillText(node.text.caption, 0, 0);
			// ctx.fillText(node.id, 0, 10);

			// thin lines in higher levels
			var lineWidth = 8 - depth || 1;
			ctx.lineWidth = lineWidth;

			node.forEachChild(function(child) {
				ctx.beginPath();
				ctx.moveTo(0, 0);
				var x = child.offset.x;
				var y = child.offset.y;
				var cp1x = x / 3;
				var cp1y = 0;
				var cp2x = x / 2;
				var cp2y = y;

				ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
				// ctx.lineTo(x, y);
				ctx.stroke();
				// ctx.fill();
				drawNode(child, depth + 1);
			});
			ctx.restore();
		}

		timeit(function() {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			drawNode(root, 0);
		}, "draw graph");
	};
};

var ViewNodeManager = function(map) {
	var self = this;
	MicroEvent.mixin(ViewNodeManager);

	var $nodeHolder = $("#node-holder");
	var nodes = {};

	var setPosition = function(node) {
		var pos = node.getPosition();
		// var $label = $("#node-" + node.id);
		var $label = nodes[node.id];
		$label.css({
			left : pos.x + "px",
			top : pos.y + "px"
		});
	};

	this.updatePosition = function(node) {
		setPosition(node);
		node.forEachDescendant(function(desc) {
			setPosition(desc);
		});
	};

	function createNodeLabels(node, position) {
		var x = position.x + node.offset.x;
		var y = position.y + node.offset.y;

		var $label = $("<div/>", {
			id : "node-" + node.id,
			text : node.text.caption,
			click : function(e) {
				e.preventDefault();
				console.log(node.id, "clicked");
				return false;
			},
			mousedown : function(e) {
				// avoid grab scroll to kick in
				e.stopPropagation();
			},
			draggable : true
		}).css({
			position : "absolute",
			left : x + "px",
			top : y + "px",
			cursor : "move"
		}).appendTo($nodeHolder);

		// node.$label = $label;
		// $label.draggable();
		nodes[node.id] = $label;

		var pX, pY;
		var startX, startY;

		// avoid fire drag event after dragend. TODO check if this is still
		// needed
		var dragging = false;
		$label.bind("dragstart", function(e) {
			dragging = true;
			console.log(e.pageX, e.clientX, e.offsetX);

			startX = $label.position().left;
			startY = $label.position().top;

			pX = e.pageX;
			pY = e.pageY;

			$(this).css("opacity", 0.5);
			console.log("drag start");
		});

		var onDrag = _.throttle(function(e) {
			if (dragging) {
				var diffLeft = e.pageX - pX;
				var diffTop = e.pageY - pY;

				if (Math.abs(diffLeft) < 1 && Math.abs(diffTop) < 1) {
					e.stopPropagation();
					return;
				}

				pX = e.pageX;
				pY = e.pageY;

				console.log("dragging");
				self.publish("nodeDrag", node, new Point(diffLeft, diffTop));
			}
		}, 10);
		$label.bind("drag", onDrag);

		$label.bind("dragend", function(e) {
			dragging = false;
			var diffLeft = e.pageX - pX;
			var diffTop = e.pageY - pY;

			$label.css({
				left : startX + diffLeft + "px",
				top : startY + diffTop + "px"
			});

			self.publish("nodeDragged", node, new Point(diffLeft, diffTop));

			$(this).css("opacity", 1);
			console.log("drag end");
		});

		node.forEachChild(function(child) {
			createNodeLabels(child, new Point(x, y));
		});
	}

	timeit(function() {
		createNodeLabels(map.root, Point.ZERO);
	}, "create node labels");
};

var AppPresenter = function(view) {
	this.view = view;
	MicroEvent.mixin(AppPresenter);

	var map = getBinaryMapWithDepth(5);
	console.log(map);

	// old stuff
	var old = false;
	if (old) {
		var ctx = this.view.canvas.getContext();
		var cgd = new CanvasGraphDrawer(ctx, map);
		cgd.draw();

		var vnm = new ViewNodeManager(map);

		vnm.subscribe("nodeDrag", function(node, offset) {
			node.offset.x += offset.x;
			node.offset.y += offset.y;
			cgd.draw();
			timeit(function() {
				vnm.updatePosition(node);
			}, "update label position");
		});

		vnm.subscribe("nodeDragged", function(node, offset) {
			// node.offset.x += offset.x;
			// node.offset.y += offset.y;
			cgd.draw();
			vnm.updatePosition(node);
		});

		view.toolbar.subscribe("buttonDrawClicked", function() {
			cgd.draw();
		});
	} else {
		var mmr = new MindMapRenderer(this.view.canvas.$drawingArea, map);
		mmr.draw();
	}
};

var MindMapRenderer = function($container, map) {
	var root = map.root;

	// center root
	var center = new Point($container.width() / 2, $container.height() / 2);
	root.offset = center;

	var drawConnection = function(canvas, depth, offsetX, offsetY) {
		// console.log("drawing");
		var ctx = canvas.getContext("2d");

		var lineWidth = 8 - depth || 1;
		ctx.lineWidth = lineWidth;

		var startX = offsetX > 0 ? 0 : -offsetX;
		var startY = offsetY > 0 ? 0 : -offsetY;
		ctx.beginPath();
		ctx.moveTo(startX, startY);

		var cp1x = (startX + offsetX) / 3;
		var cp1y = startY;
		var cp2x = (startX + offsetX) / 2;
		var cp2y = startY + offsetY;

		ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, startX + offsetX, startY
				+ offsetY);
		// ctx.lineTo(startX + offsetX, startY + offsetY);
		ctx.stroke();

	};

	this.draw = function() {
		createNode(root, $container, 0);

		function createNode(node, $parent, depth) {
			var x = node.offset.x;
			var y = node.offset.y;


			// div node container
			var $node = $("<div/>", {
				id : "node-" + node.id,
				mousedown : function(e) {
					// avoid grab scroll to kick in
					e.stopPropagation();
					return false;
				}
			}).css({
				position : "absolute",
				left : x + "px",
				top : y + "px"
			}).appendTo($parent);

			// text
			var $text = $("<div/>", {
				class : "text",
				text : node.text.caption,
				click : function(e) {
					e.preventDefault();
					console.log(node.id, "clicked");
					return false;
				}
			}).css({
				position : "absolute",
				cursor : "move",
				"z-index": 1000
			});
			
			$text.appendTo($node);

			$node.draggable({
				// cancel : "canvas",
				// handle : "div.text",
				start : function() {
					console.log("drag start");
					// cant drag root
					if (node.isRoot()) {
						return false;
					}
				},
				drag : function(e, ui) {
					// console.log("drag");
					var $canvas = $("#canvas-node-" + node.id);

					// TODO DRY
					var offsetX = ui.position.left;
					var offsetY = ui.position.top;

					var width = Math.abs(offsetX);
					var height = Math.abs(offsetY);

					var left = offsetX > 0 ? 0 : -width;
					var top = offsetY > 0 ? 0: -height;

					$canvas.attr({
						width : width,
						height : height
					}).css({
						position : "absolute",
						left : left + "px",
						top : top + "px"
					});

					// TODO depth
					drawConnection($canvas[0], 2, offsetX, offsetY);
				},
				stop : function() {

				}
			});

			// canvas
			var parent = node.parent;
			if (parent) {
				var offsetX = node.offset.x;
				var offsetY = node.offset.y;

				var width = Math.abs(offsetX);
				var height = Math.abs(offsetY);

				var left = offsetX > 0 ? 0 : -width;
				var top = offsetY > 0 ? 0: -height ;

				var $canvas = $("<canvas>", {
					id : "canvas-node-" + node.id
				}).attr({
					width : width,
					height : height
				}).css({
					position : "absolute",
					left : left + "px",
					top : top + "px",
					"z-index" : 1
				});
				
				$canvas.mousedown(function(e) {
					console.log("canvas");
				});

				drawConnection($canvas[0], depth, offsetX, offsetY);
				$canvas.appendTo($parent);
			}

			node.forEachChild(function(child) {
				createNode(child, $node, depth + 1);
			});
		}
	};
};
