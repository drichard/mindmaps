/*!
 *  mindmaps - a HTML5 powered mind mapping application
 *  Copyright (C) 2011  David Richard
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * Make sure this is the first file to be referenced in index.hml.
 */

// Use ECMA5 strict mode. see:
// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

/**
 * @namespace Application wide namespace for mindmaps.
 */
var mindmaps = mindmaps || {};
mindmaps.VERSION = "0.7.2";


// experimental app cache invalidator. from:
// http://www.html5rocks.com/en/tutorials/appcache/beginner/#toc-updating-cache/
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      window.applicationCache.swapCache();
      window.onbeforeunload = null;
      if (confirm('A new version of the app is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false)

/**
 * Start up. This function is executed when the DOM is loaded.
 */
$(function() {
  removeEventLayerXY();

  // take car of old browsers
  createECMA5Shims();
  createHTML5Shims();

  setupConsole();
  trackErrors();

  if (!mindmaps.DEBUG) {
    addUnloadHook();
  }

  // create a new app controller and go
  var appController = new mindmaps.ApplicationController();
  appController.go();
});

/**
 * Remove layerX and layerY from the jQuery event object, it causes heaps of deprecated
 * warnings in WebKit browsers.
 * See: http://stackoverflow.com/questions/7825448/webkit-issues-with-event-layerx-and-event-layery
 *
 * Can be removed when upgrading to jQuery 1.7+.
 */
function removeEventLayerXY() {
  // remove layerX and layerY
  var all = $.event.props,
  len = all.length,
  res = [];

  while (len--) {
    var el = all[len];
    if (el != 'layerX' && el != 'layerY') res.push(el);
  }
  $.event.props = res;
}

/**
* Adds a confirmation dialog when the user navigates away from the app.
*/
function addUnloadHook () {
  window.onbeforeunload = function (e) {
    var msg = "Are you sure? Any unsaved progress will be lost."
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = msg;
    }

    // For Safari
    return msg;
  };
}


function trackErrors() {
  window.onerror = function(msg, url, line) {
    if (!window._gaq) {
      return;
    }

    // Track JS errors in GA.
    _gaq.push([ '_trackEvent', 'Error Log', msg, url + '_' + line ]);

    return false; // false prevents default error handling.
  };
}

/**
* Initialize the console object.
*/
function setupConsole() {
  var noOp = function() {};

  // provide console object and dummy functions if not built-in
  var console = window.console || {};
  ['log', 'info', 'debug', 'warn', 'error'].forEach(function(prop) {
    console[prop] = console[prop] || noOp;
  });

  // turn all console.xx calls into no-ops when in production mode except
  // for errors, do an alert.
  if (!mindmaps.DEBUG) {
    console.debug = noOp;
    console.info = noOp;
    console.log = noOp;
    console.warn = noOp;
    console.error = function(s) {
      window.alert("Error: " + s);
    };
  }

  window.console = console;
}

// warum sind manche leute nur so drauf...
$(function() {
  $("#bottombar table").remove();
  $("input[name='hosted_button_id']").val("123");
});

/**
* Creates ECMA5 shims if the browser does not implement them.
*/
function createECMA5Shims() {
  // from: https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js

  // ES-5 15.3.4.5
  // http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
  if (!Function.prototype.bind) {
    var slice = Array.prototype.slice;
    Function.prototype.bind = function bind(that) { // .length is 1
      var target = this;
      if (typeof target.apply !== "function"
      || typeof target.call !== "function")
      return new TypeError();
      var args = slice.call(arguments);

      function bound() {

        if (this instanceof bound) {

          var self = Object.create(target.prototype);
          target.apply(self, args.concat(slice.call(arguments)));
          return self;
        } else {
          return target.call.apply(target, args.concat(slice
            .call(arguments)));
        }

      }
      bound.length = (typeof target === "function" ? Math.max(
      target.length - args.length, 0) : 0);
      return bound;
    };
  }

  // ES5 15.4.3.2
  if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    };
  }

  // ES5 15.4.4.18
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(block, thisObject) {
      var len = +this.length;
      for ( var i = 0; i < len; i++) {
        if (i in this) {
          block.call(thisObject, this[i], i, this);
        }
      }
    };
  }

  // ES5 15.4.4.19
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
  if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /* , thisp */) {
      var len = +this.length;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = new Array(len);
      var thisp = arguments[1];
      for ( var i = 0; i < len; i++) {
        if (i in this)
          res[i] = fun.call(thisp, this[i], i, this);
      }

      return res;
    };
  }

  // ES5 15.4.4.20
  if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(block /* , thisp */) {
      var values = [];
      var thisp = arguments[1];
      for ( var i = 0; i < this.length; i++)
        if (block.call(thisp, this[i]))
          values.push(this[i]);
        return values;
    };
  }

  // ES5 15.4.4.16
  if (!Array.prototype.every) {
    Array.prototype.every = function every(block /* , thisp */) {
      var thisp = arguments[1];
      for ( var i = 0; i < this.length; i++)
        if (!block.call(thisp, this[i]))
          return false;
        return true;
    };
  }

  // ES5 15.4.4.17
  if (!Array.prototype.some) {
    Array.prototype.some = function some(block /* , thisp */) {
      var thisp = arguments[1];
      for ( var i = 0; i < this.length; i++)
        if (block.call(thisp, this[i]))
          return true;
        return false;
    };
  }

  // ES5 15.4.4.21
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /* , initial */) {
      var len = +this.length;
      if (typeof fun !== "function")
        throw new TypeError();

      // no value to return if no initial value and an empty array
      if (len === 0 && arguments.length === 1)
        throw new TypeError();

      var i = 0;
      if (arguments.length >= 2) {
        var rv = arguments[1];
      } else {
        do {
          if (i in this) {
            rv = this[i++];
            break;
          }

          // if array contains no values, no initial value to return
          if (++i >= len)
            throw new TypeError();
        } while (true);
      }

      for (; i < len; i++) {
        if (i in this)
          rv = fun.call(null, rv, this[i], i, this);
      }

      return rv;
    };
  }

  // ES5 15.4.4.22
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
  if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /* , initial */) {
      var len = +this.length;
      if (typeof fun !== "function")
        throw new TypeError();

      // no value to return if no initial value, empty array
      if (len === 0 && arguments.length === 1)
        throw new TypeError();

      var rv, i = len - 1;
      if (arguments.length >= 2) {
        rv = arguments[1];
      } else {
        do {
          if (i in this) {
            rv = this[i--];
            break;
          }

          // if array contains no values, no initial value to return
          if (--i < 0)
            throw new TypeError();
        } while (true);
      }

      for (; i >= 0; i--) {
        if (i in this)
          rv = fun.call(null, rv, this[i], i, this);
      }

      return rv;
    };
  }

  // ES5 15.4.4.14
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(value /* , fromIndex */) {
      var length = this.length;
      if (!length)
        return -1;
      var i = arguments[1] || 0;
      if (i >= length)
        return -1;
      if (i < 0)
        i += length;
      for (; i < length; i++) {
        if (!(i in this))
          continue;
        if (value === this[i])
          return i;
      }
      return -1;
    };
  }

  // ES5 15.4.4.15
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(value) {
      var length = this.length;
      if (!length)
        return -1;
      var i = arguments[1] || length;
      if (i < 0)
        i += length;
      i = Math.min(i, length - 1);
      for (; i >= 0; i--) {
        if (!(i in this))
          continue;
        if (value === this[i])
          return i;
      }
      return -1;
    };
  }

  // ES5 15.9.4.4
  if (!Date.now) {
    Date.now = function now() {
      return new Date().getTime();
    };
  }
}

/**
* Create shims for HTML5 functionality if not supported by browser.
*/
function createHTML5Shims() {
  // localstorage dummy (does nothing)
  if (typeof window.localStorage == 'undefined') {
    window.localStorage = {
      getItem : function() {
        return null;
      },
      setItem : function() {
      },
      clear : function() {
      },
      removeItem : function() {
      },
      length : 0,
      key : function() {
        return null;
      }
    };
  }
}
