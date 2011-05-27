/*!
 * jQuery dragscrollable Plugin
 * version: 1.0 (25-Jun-2009)
 * Copyright (c) 2009 Miquel Herrera
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Modified by David Richard (2011)
 *   - added delegateMode option
 */
;
(function($) { // secure $ jQuery alias

	/**
	 * <pre>
	 * Adds the ability to manage elements scroll by dragging
	 * one or more of its descendant elements. Options parameter
	 * allow to specifically select which inner elements will
	 * respond to the drag events.
	 * 
	 * options properties:
	 * ------------------------------------------------------------------------		
	 *  dragSelector         | jquery selector to apply to each wrapped element 
	 *                       | to find which will be the dragging elements. 
	 *                       | Defaults to '&gt;:first' which is the first child of 
	 *                       | scrollable element
	 * ------------------------------------------------------------------------		
	 *  acceptPropagatedEvent| Will the dragging element accept propagated 
	 *                       | events? default is yes, a propagated mouse event 
	 *                       | on a inner element will be accepted and processed.
	 *                       | If set to false, only events originated on the
	 *                       | draggable elements will be processed.
	 * ------------------------------------------------------------------------
	 *  preventDefault       | Prevents the event to propagate further effectivey
	 *                       | dissabling other default actions. Defaults to true
	 * ------------------------------------------------------------------------
	 *  delegateMode	     | Attach the dragSelector using $.delegate() instead of $.bind()
	 *  
	 *  usage examples:
	 *  To add the scroll by drag to the element id=viewport when dragging its 
	 *  first child accepting any propagated events
	 * $('#viewport').dragscrollable(); 
	 *  To add the scroll by drag ability to any element div of class viewport
	 *  when dragging its first descendant of class dragMe responding only to
	 *  evcents originated on the '.dragMe' elements.
	 * $('div.viewport').dragscrollable({dragSelector:'.dragMe:first',
	 * 								  acceptPropagatedEvent: false});
	 *  Notice that some 'viewports' could be nested within others but events
	 *  would not interfere as acceptPropagatedEvent is set to false.
	 * </pre>
	 */
	$.fn.dragscrollable = function(options) {

		var settings = $.extend({
			dragSelector : '>:first',
			acceptPropagatedEvent : true,
			preventDefault : true,
			delegateMode : false
		}, options || {});

		var dragscroll = {
			mouseDownHandler : function(event) {
				// mousedown, left click, check propagation
				// if (event.which != 1
				// || (!event.data.acceptPropagatedEvent && event.target !=
				// this)) {
				// return false;
				// }

				// fix:
				// http://plugins.jquery.com/content/problems-input-boxes-inside-elements-draggable-area
				if (event.which != 1) {
					return false;
				} else if (!event.data.acceptPropagatedEvent) {
					if ((event.target.localName == "input")
							|| (event.target.localName == "textarea")) {
						return true;
					} else if (event.target != this) {
						return false;
					}
				}

				// Initial coordinates will be the last when dragging
				event.data.lastCoord = {
					left : event.clientX,
					top : event.clientY
				};

				$.event.add(document, "mouseup", dragscroll.mouseUpHandler,
						event.data);
				$.event.add(document, "mousemove", dragscroll.mouseMoveHandler,
						event.data);
				if (event.data.preventDefault) {
					event.preventDefault();
					return false;
				}
			},
			mouseMoveHandler : function(event) { // User is dragging
				// How much did the mouse move?
				var delta = {
					left : (event.clientX - event.data.lastCoord.left),
					top : (event.clientY - event.data.lastCoord.top)
				};

				// Set the scroll position relative to what ever the scroll is
				// now
				event.data.scrollable.scrollLeft(event.data.scrollable
						.scrollLeft()
						- delta.left);
				event.data.scrollable.scrollTop(event.data.scrollable
						.scrollTop()
						- delta.top);

				// Save where the cursor is
				event.data.lastCoord = {
					left : event.clientX,
					top : event.clientY
				};
				if (event.data.preventDefault) {
					event.preventDefault();
					return false;
				}

			},
			mouseUpHandler : function(event) { // Stop scrolling
				$.event.remove(document, "mousemove",
						dragscroll.mouseMoveHandler);
				$.event.remove(document, "mouseup", dragscroll.mouseUpHandler);
				if (event.data.preventDefault) {
					event.preventDefault();
					return false;
				}
			}
		};

		// set up the initial events
		this.each(function() {
			// closure object data for each scrollable element
			var data = {
				scrollable : $(this),
				acceptPropagatedEvent : settings.acceptPropagatedEvent,
				preventDefault : settings.preventDefault
			};

			// Set mouse initiating event on the desired descendant
			if (settings.delegateMode) {
				$(this).delegate(settings.dragSelector, 'mousedown', data,
						dragscroll.mouseDownHandler);
			} else {
				$(this).find(settings.dragSelector).bind('mousedown', data,
						dragscroll.mouseDownHandler);
			}

		});
	}; // end plugin dragscrollable

})(jQuery); // confine scope
