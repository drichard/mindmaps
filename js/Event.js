
// TODO maybe bundle events: DocumentEvent, NodeEvent (Type.MOVED, Type.CREATED)
/**
 * Events that the event bus carries.
 */
mindmaps.Event = {
	DELETE_SELECTED_NODE : "DeleteSelectedNodeEvent",

	NEW_DOCUMENT : "NewDocumentEvent",
	OPEN_DOCUMENT : "OpenDocumentEvent",
	SAVE_DOCUMENT : "SaveDocumentEvent",
	CLOSE_DOCUMENT : "CloseDocumentEvent",

	/**
	 * @param The
	 *            document
	 */
	DOCUMENT_CREATED : "DocumentCreatedEvent",

	/**
	 * @param The
	 *            document
	 */
	DOCUMENT_OPENED : "DocumentOpenedEvent",

	/**
	 * @param The
	 *            document
	 */
	DOCUMENT_SAVED : "DocumentSavedEvent",

	/**
	 * @param The
	 *            document
	 */
	DOCUMENT_CLOSED : "DocumentClosedEvent",

	/**
	 * @param The
	 *            node
	 */
	NODE_MOVED : "NodeMovedEvent",

	/**
	 * @param The
	 *            node
	 */
	NODE_TEXT_CAPTION_CHANGED : "NodeTextCaptionChangedEvent",

	/**
	 * @param The
	 *            node
	 * @param The
	 *            origin of creation
	 */
	NODE_CREATED : "NodeCreatedEvent",

	/**
	 * @param The
	 *            node
	 * @param The
	 *            parent
	 */
	NODE_DELETED : "NodeDeletedEvent",

	/**
	 * @param The
	 *            node
	 */
	NODE_OPENED : "NodeOpenedEvent",

	/**
	 * @param The
	 *            node
	 */
	NODE_CLOSED : "NodeClosedEvent",
	
	/**
	 * @param the new zoom factor
	 */
	ZOOM_CHANGED: "ZoomChangedEvent"
};

/**
 * Simple Event bus powered by MicroEvent.
 */
mindmaps.EventBus = function() {
};
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
