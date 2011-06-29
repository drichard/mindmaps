/**
 * Events that the event bus carries.
 * 
 * @namespace
 */
mindmaps.Event = {
	/**
	 * @param {mindmaps.Document} The document
	 */
	DOCUMENT_OPENED : "DocumentOpenedEvent",

	/**
	 * @param {mindmaps.Document} The document
	 */
	DOCUMENT_SAVED : "DocumentSavedEvent",

	/**
	 * @param {mindmaps.Document} The document
	 */
	DOCUMENT_CLOSED : "DocumentClosedEvent",

	/**
	 * @param {mindmaps.Node} The new selected node
	 * @param {mindmaps.Node} The old selected node (can be null)
	 */
	NODE_SELECTED : "NodeSelectedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_DESELECTED : "NodeDeselectedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_MOVED : "NodeMovedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_TEXT_CAPTION_CHANGED : "NodeTextCaptionChangedEvent",

	/**
	 * Some parameter of the node font attribute has changed.
	 * 
	 * @param {mindmaps.Node} The node
	 */
	NODE_FONT_CHANGED : "NodeFontChangedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_BRANCH_COLOR_CHANGED : "NodeBranchColorChangedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_CREATED : "NodeCreatedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 * @param {mindmaps.Node} The parent
	 */
	NODE_DELETED : "NodeDeletedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_OPENED : "NodeOpenedEvent",

	/**
	 * @param {mindmaps.Node} The node
	 */
	NODE_CLOSED : "NodeClosedEvent",

	/**
	 * @param {Number} the new zoom factor
	 */
	ZOOM_CHANGED : "ZoomChangedEvent"
};

/**
 * Simple Event bus powered by EventEmitter.
 * 
 * @constructor
 * 
 */
mindmaps.EventBus = EventEmitter;

if (mindmaps.DEBUG) {
	// overwrite publish func and display amount of listeners
	var old = mindmaps.EventBus.prototype.emit;
	mindmaps.EventBus.prototype.publish = function(type) {
		var l = this.listeners(type).length;
		console.log("EventBus > publish: " + type, "(Listeners: " + l + ")");

		old.apply(this, arguments);
	};
}