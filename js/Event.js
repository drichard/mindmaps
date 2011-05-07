var mindmaps = mindmaps || {};

/**
 * Events that the event bus carries.
 */
mindmaps.Event = {
	NEW_DOCUMENT : "NewDocumentEvent",
	OPEN_DOCUMENT : "OpenDocumentEvent",
	SAVE_DOCUMENT : "SaveDocumentEvent",
	DOCUMENT_CREATED : "DocumentCreatedEvent",
	DOCUMENT_OPENED : "DocumentOpenedEvent",
	DOCUMENT_SAVED : "DocumentSavedEvent",
	DELETE_SELECTED_NODE : "DeleteSelectedNodeEvent",
	NODE_MOVED : "NodeMovedEvent",
	NODE_TEXT_CAPTION_CHANGED : "NodeTextCaptionChangedEvent",
	NODE_CREATED : "NodeCreatedEvent",
	NODE_DELETED : "NodeDeletedEvent"
};

/**
 * Simple Event bus powered by MicroEvent.
 */
mindmaps.EventBus = function() {};
MicroEvent.mixin(mindmaps.EventBus);

// log all publishes in debug mode
if (DEBUG) {
	mindmaps.EventBus.prototype.publish = function(event /* , args... */) {
		this._events = this._events || {};

		var l = this._events[event] ? this._events[event].length : 0;
		console.log("EventBus > publish: " + event, "(Listeners: " + l + ")");
		if (event in this._events === false)
			return this;
		for ( var i = 0; i < this._events[event].length; i++) {
			this._events[event][i].apply(this, Array.prototype.slice.call(
					arguments, 1));
		}
		return this;
	};
}
