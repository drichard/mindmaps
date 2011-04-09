/**
 * MIT License
 * 
 * Copyright (c) 2011 Jerome Etienne, http://jetienne.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. MicroEvent - to make any js object an event emitter (server or
 * browser)
 * 
 *  - pure javascript - server compatible, browser compatible - dont rely on the
 * browser doms - super simple - you get it immediatly, no mistery, no magic
 * involved
 *  - create a MicroEventDebug with goodies to debug - make it safer to use
 */

var MicroEvent = function() {
};
MicroEvent.prototype = {
	subscribe : function(event, fct) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(fct);
		return this;
	},
	unsubscribe : function(event, fct) {
		this._events = this._events || {};
		if (event in this._events === false)
			return this;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
		return this;
	},
	publish : function(event /* , args... */) {
		this._events = this._events || {};
		if (event in this._events === false)
			return this;
		for ( var i = 0; i < this._events[event].length; i++) {
			this._events[event][i].apply(this, Array.prototype.slice.call(
					arguments, 1));
		}
		return this;
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *  - require('MicroEvent').mixin(Foobar) will make Foobar able to use
 * MicroEvent
 * 
 * @param {Object}
 *            the object which will support MicroEvent
 */
MicroEvent.mixin = function(destObject) {
	var props = [ 'subscribe', 'unsubscribe', 'publish' ];
	for ( var i = 0; i < props.length; i++) {
		destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
	}
};

// export in common js
if (typeof module !== "undefined" && ('exports' in module)) {
	module.exports = MicroEvent;
}
