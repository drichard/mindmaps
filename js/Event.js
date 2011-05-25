// TODO maybe bundle events: DocumentEvent, NodeEvent (Type.MOVED, Type.CREATED)
/**
 * Events that the event bus carries.
 */
mindmaps.Event = {
	DELETE_NODE : "DeleteSelectedNodeEvent",
	NEW_NODE : "NewNodeEvent",

	COPY_NODE : "CopyNodeEvent",
	CUT_NODE : "CutNodeEvent",
	PASTE_NODE : "PasteNodeEvent",

	/**
	 * Request undo operation.
	 */
	DO_UNDO : "DoUndoEvent",

	/**
	 * Request redo operation.
	 */
	DO_REDO : "DoRedoEvent",

	/**
	 * Record a new undo action.
	 * 
	 * @param undoFunc
	 * @param redoFunc
	 */
	UNDO_ACTION : "UndoActionEvent",

	/**
	 * @param {boolean}
	 *            undoState
	 * @param {boolean}
	 *            redoState
	 */
	UNDO_STATE_CHANGE : "UndoStateChangeEvent",

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
	NODE_SELECTED : "NodeSelectedEvent",

	/**
	 * @param The
	 *            node
	 */
	NODE_DESELECTED : "NodeDeselectedEvent",

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
	 * Some parameter of the node font attribute has changed.
	 * 
	 * @param The
	 *            node
	 */
	NODE_FONT_CHANGED : "NodeFontChangedEvent",

	/**
	 * @param The
	 *            node
	 */
	NODE_BRANCH_COLOR_CHANGED : "NodeBranchColorChangedEvent",

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

	ZOOM_IN : "ZoomInEvent",

	ZOOM_OUT : "ZoomOutEvent",

	/**
	 * @param the
	 *            new zoom factor
	 */
	ZOOM_CHANGED : "ZoomChangedEvent"
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
