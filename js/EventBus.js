/**
 * Simple Event bus powered by MicroEvent.
 */
var EventBus = function() {
};
MicroEvent.mixin(EventBus);

// log all publishes in debug mode
if (DEBUG) {
	EventBus.prototype.publish = function(event /* , args... */) {
		this._events = this._events || {};
		
		var l = this._events[event] ? this._events[event].length : 0;
		console.log("EventBus > publish: " + event, "(Listeners: "
				+ l + ")");
		if (event in this._events === false)
			return this;
		for ( var i = 0; i < this._events[event].length; i++) {
			this._events[event][i].apply(this, Array.prototype.slice.call(
					arguments, 1));
		}
		return this;
	};
}