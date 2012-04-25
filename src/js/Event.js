/**
 * Events that the event bus carries.
 * 
 * @namespace
 */
mindmaps.Event = {
  /**
   * @event
   * @param {mindmaps.Document} document
   */
  DOCUMENT_OPENED : "DocumentOpenedEvent",

  /**
   * @event
   * @param {mindmaps.Document} document
   */
  DOCUMENT_SAVED : "DocumentSavedEvent",

  /**
   * @event
   * @param {mindmaps.Document} document
   */
  DOCUMENT_CLOSED : "DocumentClosedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   * @param {mindmaps.Node} oldSelectedNode
   */
  NODE_SELECTED : "NodeSelectedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_DESELECTED : "NodeDeselectedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_MOVED : "NodeMovedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_TEXT_CAPTION_CHANGED : "NodeTextCaptionChangedEvent",

  /**
   * Some parameter of the node font attribute has changed.
   * 
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_FONT_CHANGED : "NodeFontChangedEvent",

  /**
   * Preview event for node font color changes.
   *
   * @event
   * @param {mindmaps.Node} node
   * @param {String} color
   */
  NODE_FONT_COLOR_PREVIEW: "NodeFontColorPreviewEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_BRANCH_COLOR_CHANGED : "NodeBranchColorChangedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   * @param {String} color
   */
  NODE_BRANCH_COLOR_PREVIEW : "NodeBranchColorPreviewEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_CREATED : "NodeCreatedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   * @param {mindmaps.Node} parent
   */
  NODE_DELETED : "NodeDeletedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_OPENED : "NodeOpenedEvent",

  /**
   * @event
   * @param {mindmaps.Node} node
   */
  NODE_CLOSED : "NodeClosedEvent",

  /**
   * @event
   * @param {Number} zoomFactor
   */
  ZOOM_CHANGED : "ZoomChangedEvent",
  
  /**
   * @event
   * @param {String} message
   */
  NOTIFICATION_INFO: "NotificationInfoEvent",
  
  /**
   * @event
   * @param {String} message
   */
  NOTIFICATION_WARN: "NotificationWarnEvent",
  
  /**
   * @event
   * @param {String} message
   */
  NOTIFICATION_ERROR: "NotificationErrorEvent"
};

/**
 * Simple Event bus powered by EventEmitter.
 * 
 * @constructor
 * @augments EventEmitter
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
