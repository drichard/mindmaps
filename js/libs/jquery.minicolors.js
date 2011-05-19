/*
 * jQuery miniColors: A small color selector
 *
 * Copyright 2011 Cory LaViska for A Beautiful Site, LLC. (http://abeautifulsite.net/)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses
 *
 *
 * Usage:
 *
 *	1. Link to jQuery: <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"></script>
 *
 *  2. Link to miniColors: <script type="text/javascript" src="jquery.miniColors.js"></script>
 *
 *  3. Include miniColors stylesheet: <link type="text/css" rel="stylesheet" href="jquery.miniColors.css" />
 *
 *	4. Apply $([selector]).miniColors() to one or more INPUT elements
 *
 *
 * Options:
 *
 *	disabled		[true|false]
 *	readonly		[true|false]
 *
 *
 *  Specify options on creation:
 *
 *		$([selector]).miniColors({
 *
 *			optionName: value,
 *			optionName: value,
 *			...
 *
 *		});
 *
 *
 * Methods:
 *
 *	Call a method using: $([selector]).miniColors('methodName', [value]);
 *
 *	disabled		[true|false]
 *	readonly		[true|false]
 *	value			[hex value]
 *	destroy
 *
 *
 * Events:
 *
 *	Attach events on creation:
 *
 *		$([selector]).miniColors({
 *
 *			change: function(hex, rgb) { ... }
 *
 *		});
 *
 *	change(hex, rgb)	called when the color value changes; 'this' will refer to the original input element;
 *                      hex is the string hex value of the selected color; rgb is an object with the RGB values
 *
 *
 * Change log:
 *
 *	- v0.1 (2011-02-24) - Initial release
 *
 *
 * Attribution:
 *
 *	- The color picker icon is based on an icon from the amazing Fugue icon set: 
 *    http://p.yusukekamiyamane.com/
 *
 *	- The gradient image, the hue image, and the math functions are courtesy of 
 *    the eyecon.co jQuery color picker: http://www.eyecon.ro/colorpicker/
 *
 *
*/
if(jQuery) (function($) {
	
	$.extend($.fn, {
		
		miniColors: function(o, data) {
			
			
			var create = function(input, o, data) {
				
				//
				// Creates a new instance of the miniColors selector
				//
				
				// Determine initial color (defaults to white)
				var color = cleanHex(input.val());
				if( !color ) color = 'FFFFFF';
				var hsb = hex2hsb(color);
				
				// Create trigger
				var trigger = $('<a class="miniColors-trigger" style="background-color: #' + color + '" href="#"></a>');
				trigger.insertAfter(input);
				
				// Add necessary attributes
				input.addClass('miniColors').attr('maxlength', 7).attr('autocomplete', 'off');
				
				// Set input data
				input.data('trigger', trigger);
				input.data('hsb', hsb);
				if( o.change ) input.data('change', o.change);
				
				// Handle options
				if( o.readonly ) input.attr('readonly', true);
				if( o.disabled ) disable(input);
				
				// Show selector when trigger is clicked
				trigger.bind('click.miniColors', function(event) {
					event.preventDefault();
					input.trigger('focus');
				});
				
				// Show selector when input receives focus
				input.bind('focus.miniColors', function(event) {
					show(input);
				});
				
				// Hide on blur
				input.bind('blur.miniColors', function(event) {
					var hex = cleanHex(input.val());
					input.val( hex ? '#' + hex : '' );
				});
				
				// Hide when tabbing out of the input
				input.bind('keydown.miniColors', function(event) {
					if( event.keyCode === 9 ) hide(input);
				});
				
				// Update when color is typed in
				input.bind('keyup.miniColors', function(event) {
					// Remove non-hex characters
					var filteredHex = input.val().replace(/[^A-F0-9#]/ig, '');
					input.val(filteredHex);
					if( !setColorFromInput(input) ) {
						// Reset trigger color when color is invalid
						input.data('trigger').css('backgroundColor', '#FFF');
					}
				});
				
				// Handle pasting
				input.bind('paste.miniColors', function(event) {
					// Short pause to wait for paste to complete
					setTimeout( function() {
						input.trigger('keyup');
					}, 5);
				});
				
			};
			
			
			var destroy = function(input) {
				
				//
				// Destroys an active instance of the miniColors selector
				//
				
				hide();
				
				input = $(input);
				input.data('trigger').remove();
				input.removeAttr('autocomplete');
				input.removeData('trigger');
				input.removeData('selector');
				input.removeData('hsb');
				input.removeData('huePicker');
				input.removeData('colorPicker');
				input.removeData('mousebutton');
				input.removeData('moving');
				input.unbind('click.miniColors');
				input.unbind('focus.miniColors');
				input.unbind('blur.miniColors');
				input.unbind('keyup.miniColors');
				input.unbind('keydown.miniColors');
				input.unbind('paste.miniColors');
				$(document).unbind('mousedown.miniColors');
				$(document).unbind('mousemove.miniColors');
				
			};
			
			
			var enable = function(input) {
				
				//
				// Disables the input control and the selector
				//
				
				input.attr('disabled', false);
				input.data('trigger').css('opacity', 1);
				
			};
			
			
			var disable = function(input) {
				
				//
				// Disables the input control and the selector
				//
				
				hide(input);
				input.attr('disabled', true);
				input.data('trigger').css('opacity', .5);
				
			};
			
			
			var show = function(input) {
				
				//
				// Shows the miniColors selector
				//
				
				if( input.attr('disabled') ) return false;
				
				// Hide all other instances 
				hide();				
				
				// Generate the selector
				var selector = $('<div class="miniColors-selector"></div>');
				selector.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>');
				selector.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>');
				selector.css({
					top: input.is(':visible') ? input.offset().top + input.outerHeight() : input.data('trigger').offset().top + input.data('trigger').outerHeight(),
					left: input.is(':visible') ? input.offset().left : input.data('trigger').offset().left,
					display: 'none'
				}).addClass( input.attr('class') );
				
				// Set background for colors
				var hsb = input.data('hsb');
				selector.find('.miniColors-colors').css('backgroundColor', '#' + hsb2hex({ h: hsb.h, s: 100, b: 100 }));
				
				// Set colorPicker position
				var colorPosition = input.data('colorPosition');
				if( !colorPosition ) colorPosition = getColorPositionFromHSB(hsb);
				selector.find('.miniColors-colorPicker').css('top', colorPosition.y + 'px').css('left', colorPosition.x + 'px');
				
				// Set huePicker position
				var huePosition = input.data('huePosition');
				if( !huePosition ) huePosition = getHuePositionFromHSB(hsb);
				selector.find('.miniColors-huePicker').css('top', huePosition.y + 'px');
				
				
				// Set input data
				input.data('selector', selector);
				input.data('huePicker', selector.find('.miniColors-huePicker'));
				input.data('colorPicker', selector.find('.miniColors-colorPicker'));
				input.data('mousebutton', 0);
				
				$('BODY').append(selector);
				selector.fadeIn(100);
				
				// Prevent text selection in IE
				selector.bind('selectstart', function() { return false; });
				
				$(document).bind('mousedown.miniColors', function(event) {
					input.data('mousebutton', 1);
					
					if( $(event.target).parents().andSelf().hasClass('miniColors-colors') ) {
						event.preventDefault();
						input.data('moving', 'colors');
						moveColor(input, event);
					}
					
					if( $(event.target).parents().andSelf().hasClass('miniColors-hues') ) {
						event.preventDefault();
						input.data('moving', 'hues');
						moveHue(input, event);
					}
					
					if( $(event.target).parents().andSelf().hasClass('miniColors-selector') ) {
						event.preventDefault();
						return;
					}
					
					if( $(event.target).parents().andSelf().hasClass('miniColors') ) return;
					
					hide(input);
				});
				
				$(document).bind('mouseup.miniColors', function(event) {
					input.data('mousebutton', 0);
					input.removeData('moving');
				});
				
				$(document).bind('mousemove.miniColors', function(event) {
					if( input.data('mousebutton') === 1 ) {
						if( input.data('moving') === 'colors' ) moveColor(input, event);
						if( input.data('moving') === 'hues' ) moveHue(input, event);
					}
				});
				
			};
			
			
			var hide = function(input) {
				
				//
				// Hides one or more miniColors selectors
				//
				
				// Hide all other instances if input isn't specified
				if( !input ) input = '.miniColors';
				
				$(input).each( function() {
					var selector = $(this).data('selector');
					$(this).removeData('selector');
					$(selector).fadeOut(100, function() {
						$(this).remove();
					});
				});
				
				$(document).unbind('mousedown.miniColors');
				$(document).unbind('mousemove.miniColors');
				
			};
			
			
			var moveColor = function(input, event) {
				
				var colorPicker = input.data('colorPicker');
				
				colorPicker.hide();
				
				var position = {
					x: event.clientX - input.data('selector').find('.miniColors-colors').offset().left + $(document).scrollLeft() - 5,
					y: event.clientY - input.data('selector').find('.miniColors-colors').offset().top + $(document).scrollTop() - 5
				};
				
				if( position.x <= -5 ) position.x = -5;
				if( position.x >= 144 ) position.x = 144;
				if( position.y <= -5 ) position.y = -5;
				if( position.y >= 144 ) position.y = 144;
				input.data('colorPosition', position);
				colorPicker.css('left', position.x).css('top', position.y).show();
				
				// Calculate saturation
				var s = Math.round((position.x + 5) * .67);
				if( s < 0 ) s = 0;
				if( s > 100 ) s = 100;
				
				// Calculate brightness
				var b = 100 - Math.round((position.y + 5) * .67);
				if( b < 0 ) b = 0;
				if( b > 100 ) b = 100;
				
				// Update HSB values
				var hsb = input.data('hsb');
				hsb.s = s;
				hsb.b = b;
				
				// Set color
				setColor(input, hsb, true);
				
			};
			
			
			var moveHue = function(input, event) {
				
				var huePicker = input.data('huePicker');
				
				huePicker.hide();
				
				var position = {
					y: event.clientY - input.data('selector').find('.miniColors-colors').offset().top + $(document).scrollTop() - 1
				};
				
				if( position.y <= -1 ) position.y = -1;
				if( position.y >= 149 ) position.y = 149;
				input.data('huePosition', position);
				huePicker.css('top', position.y).show();
				
				// Calculate hue
				var h = Math.round((150 - position.y - 1) * 2.4);
				if( h < 0 ) h = 0;
				if( h > 360 ) h = 360;
				
				// Update HSB values
				var hsb = input.data('hsb');
				hsb.h = h;
				
				// Set color
				setColor(input, hsb, true);
				
			};
			
			
			var setColor = function(input, hsb, updateInputValue) {
				
				input.data('hsb', hsb);
				var hex = hsb2hex(hsb);	
				if( updateInputValue ) input.val('#' + hex);
				input.data('trigger').css('backgroundColor', '#' + hex);
				if( input.data('selector') ) input.data('selector').find('.miniColors-colors').css('backgroundColor', '#' + hsb2hex({ h: hsb.h, s: 100, b: 100 }));
				
				if( input.data('change') ) {
					input.data('change').call(input, '#' + hex, hsb2rgb(hsb));
				}
				
			};
			
			
			var setColorFromInput = function(input) {
				
				// Don't update if the hex color is invalid
				var hex = cleanHex(input.val());
				if( !hex ) return false;
				
				// Get HSB equivalent
				var hsb = hex2hsb(hex);
				
				// If color is the same, no change required
				var currentHSB = input.data('hsb');
				if( hsb.h === currentHSB.h && hsb.s === currentHSB.s && hsb.b === currentHSB.b ) return true;
				
				// Set colorPicker position
				var colorPosition = getColorPositionFromHSB(hsb);
				var colorPicker = $(input.data('colorPicker'));
				colorPicker.css('top', colorPosition.y + 'px').css('left', colorPosition.x + 'px');
				
				// Set huePosition position
				var huePosition = getHuePositionFromHSB(hsb);
				var huePicker = $(input.data('huePicker'));
				huePicker.css('top', huePosition.y + 'px');
				
				setColor(input, hsb, false);
				
				return true;
				
			};
			
			
			var getColorPositionFromHSB = function(hsb) {
				
				var x = Math.ceil(hsb.s / .67);
				if( x < 0 ) x = 0;
				if( x > 150 ) x = 150;
				
				var y = 150 - Math.ceil(hsb.b / .67);
				if( y < 0 ) y = 0;
				if( y > 150 ) y = 150;
				
				return { x: x - 5, y: y - 5 };
				
			}
			
			
			var getHuePositionFromHSB = function(hsb) {
				
				var y = 150 - (hsb.h / 2.4);
				if( y < 0 ) h = 0;
				if( y > 150 ) h = 150;				
				
				return { y: y - 1 };
				
			}
			
			
			var cleanHex = function(hex) {
				
				//
				// Turns a dirty hex string into clean, 6-character hex color
				//
				
				hex = hex.replace(/[^A-Fa-f0-9]/, '');
				
				if( hex.length == 3 ) {
					hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
				}
				
				return hex.length === 6 ? hex : null;
				
			};			
			
			
			var hsb2rgb = function(hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255 - s) * v / 255;
					var t3 = (t1 - t2) * (h % 60) / 60;
					if( h == 360 ) h = 0;
					if( h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
					else if( h<120 ) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
					else if( h<180 ) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
					else if( h<240 ) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
					else if( h<300 ) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
					else if( h<360 ) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
					else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
				}
				return {
					r: Math.round(rgb.r),
					g: Math.round(rgb.g),
					b: Math.round(rgb.b)
				};
			};
			
			
			var rgb2hex = function(rgb) {
				
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function(nr, val) {
					if (val.length == 1) hex[nr] = '0' + val;
				});
				
				return hex.join('');
			};
			
			
			var hex2rgb = function(hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				
				return {
					r: hex >> 16,
					g: (hex & 0x00FF00) >> 8,
					b: (hex & 0x0000FF)
				};
			};
			
			
			var rgb2hsb = function(rgb) {
				var hsb = { h: 0, s: 0, b: 0 };
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if( hsb.s != 0 ) {
					if( rgb.r == max ) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if( rgb.g == max ) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if( hsb.h < 0 ) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			};			
			
			
			var hex2hsb = function(hex) {
				var hsb = rgb2hsb(hex2rgb(hex));
				// Zero out hue marker for black, white, and grays (saturation === 0)
				if( hsb.s === 0 ) hsb.h = 360;
				return hsb;
			};
			
			
			var hsb2hex = function(hsb) {
				return rgb2hex(hsb2rgb(hsb));
			};

			
			//
			// Handle calls to $([selector]).miniColors()
			//
			switch(o) {
			
				case 'readonly':
					
					$(this).each( function() {
						$(this).attr('readonly', data);
					});
					
					return $(this);
					
					break;
				
				case 'disabled':
					
					$(this).each( function() {
						if( data ) {
							disable($(this));
						} else {
							enable($(this));
						}
					});
										
					return $(this);
			
				case 'value':
					
					$(this).each( function() {
						$(this).val(data).trigger('keyup');
					});
					
					return $(this);
					
					break;
					
				case 'destroy':
					
					$(this).each( function() {
						destroy($(this));
					});
										
					return $(this);
				
				default:
					
					if( !o ) o = {};
					
					$(this).each( function() {
						
						// Must be called on an input element
						if( $(this)[0].tagName.toLowerCase() !== 'input' ) return;
						
						// If a trigger is present, the control was already created
						if( $(this).data('trigger') ) return;
						
						// Create the control
						create($(this), o, data);
						
					});
										
					return $(this);
					
			}
			
			
		}

			
	});
	
})(jQuery);



