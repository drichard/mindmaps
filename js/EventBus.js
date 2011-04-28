/**
 * Simple Event bus powered by MicroEvent.
 */
var EventBus = function() {
};
MicroEvent.mixin(EventBus);

if (DEBUG) {
	EventBus.prototype = {
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
				console.log("EventBus > publish: " + event, "(Listeners: " + this._events[event].length + ")");
				return this;
			}
		};
}