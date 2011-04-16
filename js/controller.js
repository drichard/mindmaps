var CanvasGraphDrawer = function(ctx, map) {
	var root = map.root;

	this.draw = function() {
		function drawNode(node) {
			ctx.save();
			ctx.translate(node.offset.x, node.offset.y);
			// ctx.font = 'normal 12px sans-serif';
			// ctx.fillText(node.text.caption, 0, 0);
			// ctx.fillText(node.id, 0, 10);

			node.forEachChild(function(child) {
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(child.offset.x, child.offset.y);
				ctx.stroke();
				drawNode(child);
			});
			ctx.restore();
		}

		timeit(function() {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			drawNode(root);
		}, "draw graph");
	};
};

var ViewNodeManager = function(map) {
	var self = this;
	MicroEvent.mixin(ViewNodeManager);

	var $nodeHolder = $("#node-holder");

	this.updatePosition = function(node) {
		var pos = node.getPosition();
		node.$label.css({
			left: pos.x + "px",
			top: pos.y + "px"
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

		node.$label = $label;
		// $label.draggable();

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

	var map = getBinaryMapWithDepth(8);
	console.log(map);
	var ctx = this.view.canvas.getContext();

	var cgd = new CanvasGraphDrawer(ctx, map);
	cgd.draw();

	var vnm = new ViewNodeManager(map);

	vnm.subscribe("nodeDrag", function(node, offset) {
		node.offset.x += offset.x;
		node.offset.y += offset.y;
		cgd.draw();
		vnm.updatePosition(node);
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
};
