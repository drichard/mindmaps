/**
 * Events that the event bus carries.
 * 
 * @static
 */
mindmaps.Event = {
	/**
	 * @param The document
	 */
	DOCUMENT_OPENED : "DocumentOpenedEvent",

	/**
	 * @param The document
	 */
	DOCUMENT_SAVED : "DocumentSavedEvent",

	/**
	 * @param The document
	 */
	DOCUMENT_CLOSED : "DocumentClosedEvent",

	/**
	 * @param The new selected node
	 * @param The old selected node (can be null)
	 */
	NODE_SELECTED : "NodeSelectedEvent",

	/**
	 * @param The node
	 */
	NODE_DESELECTED : "NodeDeselectedEvent",

	/**
	 * @param The node
	 */
	NODE_MOVED : "NodeMovedEvent",

	/**
	 * @param The node
	 */
	NODE_TEXT_CAPTION_CHANGED : "NodeTextCaptionChangedEvent",

	/**
	 * Some parameter of the node font attribute has changed.
	 * 
	 * @param The node
	 */
	NODE_FONT_CHANGED : "NodeFontChangedEvent",

	/**
	 * @param The node
	 */
	NODE_BRANCH_COLOR_CHANGED : "NodeBranchColorChangedEvent",

	/**
	 * @param The node
	 * @param The origin of creation
	 */
	NODE_CREATED : "NodeCreatedEvent",

	/**
	 * @param The node
	 * @param The parent
	 */
	NODE_DELETED : "NodeDeletedEvent",

	/**
	 * @param The node
	 */
	NODE_OPENED : "NodeOpenedEvent",

	/**
	 * @param The node
	 */
	NODE_CLOSED : "NodeClosedEvent",

	/**
	 * @param the new zoom factor
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