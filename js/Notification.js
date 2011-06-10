/**
 * 
 * @param target selector
 * @param options
 */
mindmaps.Notification = function(targetSelector, options) {
	var self = this;
	options = $.extend({}, mindmaps.Notification.Defaults, options);

	// render template
	var $notification = this.$el = $("#template-notification").tmpl(options)
			.css({
				"max-width" : options.maxWidth
			});

	// notification target
	var $target = $(targetSelector);
	var offset = $target.offset();
	var targetLeft = offset.left;
	var targetTop = offset.top;
	var targetWidth = $target.outerWidth();
	var targetHeight = $target.outerHeight();

	// add to dom. we need measurings
	$notification.appendTo($("body"));
	var notiWidth = $notification.outerWidth();
	var notiHeight = $notification.outerHeight();
	var notiLeft, notiTop;
	var padding = options.padding;

	// position
	switch (options.position) {

	case "topLeft":
		notiTop = targetTop - padding - notiHeight;
		notiLeft = targetLeft;
		break;
	case "topMiddle":
		// TODO
		break;
	case "topRight":
		notiTop = targetTop - padding - notiHeight;
		notiLeft = targetLeft + targetWidth - notiWidth;
		break;
	case "rightTop":
		notiTop = targetTop;
		notiLeft = targetLeft + padding + targetWidth;
		break;
	case "rightMiddle":
		// TODO
		break;
	case "rightBottom":
		notiTop = targetTop + targetHeight - notiHeight;
		notiLeft = targetLeft + padding + targetWidth;
		break;
	case "bottomLeft":
		notiTop = targetTop + padding + targetHeight;
		notiLeft = targetLeft;
		break;
	case "bottomMiddle":
		// TODO
		break;
	case "bottomRight":
		notiTop = targetTop + padding + targetHeight;
		notiLeft = targetLeft + targetWidth - notiWidth;
		break;
	case "leftTop":
		notiTop = targetTop;
		notiLeft = targetLeft - padding - notiWidth;
		break;
	case "leftMiddle":
		// TODO
		break;
	case "leftBottom":
		notiTop = targetTop + targetHeight - notiHeight;
		notiLeft = targetLeft - padding - notiWidth;
		break;
	}

	$notification.offset({
		left : notiLeft,
		top : notiTop
	});

	// fadeout?
	if (options.expires) {
		setTimeout(function() {
			self.close();
		}, options.expires);
	}

	// close button
	if (options.closeButton) {
		$notification.find(".close-button").click(function() {
			self.close();
		});
	}

	// display
	$notification.fadeIn(600);
};

mindmaps.Notification.prototype = {
	close : function() {
		var n = this.$el;
		n.fadeOut(800, function() {
			n.remove();
			this.removed = true;
		});
	},
	isVisible : function() {
		return !this.removed;
	},
	$ : function() {
		return this.$el;
	}
};

mindmaps.Notification.Defaults = {
	title : null,
	content : "New Notification",
	position : "topLeft",
	padding : 10,
	expires : 0,
	closeButton : false,
	maxWidth : 500
};