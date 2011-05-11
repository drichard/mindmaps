var mindmaps = mindmaps || {};

mindmaps.CanvasDialogFactory = function($container) {
	var dialogs = [];
	var padding = 5;

	function setPosition(dialog) {
		$(window).resize(function() {
			_.each(dialogs, function(dialog) {
				// TODO move dialogs into view port if window too small
			});
		});

		var ccw = $container.outerWidth();
		var hh = $container.offset().top;
		var dw = dialog.width();
		var dh = dialog.height();
		var heightOffset = _.reduce(dialogs, function(memo, dialog) {
			return memo + dialog.height() + padding;
		}, 0);

		dialog.setPosition(ccw - dw - padding, hh + padding + heightOffset);
	}

	this.create = function(caption) {
		var dialog = new mindmaps.CanvasDialog(caption, $container);
		setPosition(dialog);
		dialogs.push(dialog);
		return dialog;
	};
};


/**
 * A reusable, draggable dialog gui element. The dialog is contained within the
 * canvas-container. When a $hideTarget is set, the hide/show animations will
 * show a transfer effect.
 * 
 * @param caption
 */
mindmaps.CanvasDialog = function(caption, container) {
	var self = this;
	var animating = false;

	this.caption = caption;
	this.visible = false;
	this.animationDuration = 400;

	this.$widget = (function() {
		var $titleText = $("<span/>", {
			"class" : "ui-dialog-title"
		}).text(caption);

		var $closeButton = $("<span/>", {
			"class" : "ui-icon"
		});

		var $titleButton = $("<a/>", {
			"class" : "ui-dialog-titlebar-close ui-corner-all",
			href : "#",
			role : "button"
		}).click(function() {
			self.hide();
		}).append($closeButton);

		var $title = $("<div/>", {
			"class" : "ui-dialog-titlebar ui-widget-header ui-helper-clearfix"
		}).append($titleText).append($titleButton);

		var $dialog = $(
				"<div/>",
				{
					"class" : "ui-widget ui-dialog ui-corner-all ui-widget-content canvas-dialog "
				}).draggable({
			containment : "parent",
			handle : "div.ui-dialog-titlebar"
		}).hide().append($title).appendTo(container);

		return $dialog;
	})();

	this.hide = function() {
		if (!animating && this.visible) {
			this.visible = false;
			this.$widget.fadeOut(this.animationDuration * 1.5);

			// show transfer effect is hide target is set
			if (this.$hideTarget) {
				this.transfer(this.$widget, this.$hideTarget);
			}
		}
	};

	this.show = function() {
		if (!animating && !this.visible) {
			this.visible = true;
			this.$widget.fadeIn(this.animationDuration * 1.5);

			// show transfer effect is hide target is set
			if (this.$hideTarget) {
				this.transfer(this.$hideTarget, this.$widget);
			}
		}
	};

	this.toggle = function() {
		if (this.visible) {
			this.hide();
		} else {
			this.show();
		}
	};

	this.transfer = function($from, $to) {
		animating = true;
		var endPosition = $to.offset(), animation = {
			top : endPosition.top,
			left : endPosition.left,
			height : $to.innerHeight(),
			width : $to.innerWidth()
		}, startPosition = $from.offset(), transfer = $(
				'<div class="ui-effects-transfer"></div>').appendTo(
				document.body).css({
			top : startPosition.top,
			left : startPosition.left,
			height : $from.innerHeight(),
			width : $from.innerWidth(),
			position : 'absolute'
		}).animate(animation, this.animationDuration, "linear", function() {
			// end
			transfer.remove();
			animating = false;
		});
	};

	this.width = function() {
		return this.$widget.outerWidth();
	};

	this.height = function() {
		return this.$widget.outerHeight();
	};

	this.offset = function() {
		return this.$widget.offset();
	};

	this.setPosition = function(x, y) {
		this.$widget.offset({
			left : x,
			top : y
		});
	};
};