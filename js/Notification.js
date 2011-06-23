/**
 * Creates a new notification.
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
	if ($target.length === 0) {
		/**
		 * Return unfinished, invisible notification if selector didn't match. It will
		 * simply not show up, and does not have to be handled specially by the
		 * caller.
		 */
		return this;
	}

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
		notiTop = targetTop - padding - notiHeight;
		if (notiWidth < targetWidth) {
			notiLeft = targetLeft + (targetWidth - notiWidth) / 2;
		} else {
			notiLeft = targetLeft - (notiWidth - targetWidth) / 2;
		}
		break;
	case "topRight":
		notiTop = targetTop - padding - notiHeight;
		notiLeft = targetLeft + targetWidth - notiWidth;
		break;
	case "rightTop":
		notiTop = targetTop;

		break;
	case "rightMiddle":
		if (notiHeight < targetHeight) {
			notiTop = targetTop + (targetHeight - notiHeight) / 2;
		} else {
			notiTop = targetTop - (notiHeight - targetHeight) / 2;
		}
		notiLeft = targetLeft + padding + targetWidth;
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
		notiTop = targetTop + padding + targetHeight;
		if (notiWidth < targetWidth) {
			notiLeft = targetLeft + (targetWidth - notiWidth) / 2;
		} else {
			notiLeft = targetLeft - (notiWidth - targetWidth) / 2;
		}
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
		if (notiHeight < targetHeight) {
			notiTop = targetTop + (targetHeight - notiHeight) / 2;
		} else {
			notiTop = targetTop - (notiHeight - targetHeight) / 2;
		}
		notiLeft = targetLeft - padding - notiWidth;
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