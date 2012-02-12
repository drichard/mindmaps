// TODO Rename those objects to TaskBar*

/**
 * Creates a new StatusBarView.
 * 
 * @constructor
 */
mindmaps.StatusBarView = function() {
  var self = this;
  var $statusbar = $("#statusbar");

  this.init = function() {
  };

  /**
   * Creates and adds a new button to the stats baar.
   * 
   * @param {String} id
   * @param {String} text
   * @returns {jQuery}
   */
  this.createButton = function(id, text) {
    return $("<button/>", {
      id : "statusbar-button-" + id
    }).button({
      label : text
    }).click(function() {
      if (self.buttonClicked) {
        self.buttonClicked(id);
      }
    }).prependTo($statusbar.find(".buttons"));
  };

  /**
   * Returns the underlying jquery object.
   * 
   * @returns {jQuery}
   */
  this.getContent = function() {
    return $statusbar;
  };
};

/**
 * Creates a new StatusBarPresenter. This object provides buttons for the
 * floating panels for a taskbar-like behaviour.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.StatusBarView} view
 */
mindmaps.StatusBarPresenter = function(eventBus, view) {
  var buttonCounter = 0;
  var buttonIdPanelMap = {};
  var statusController = new mindmaps.StatusNotificationController(eventBus,
      view.getContent());

  view.buttonClicked = function(id) {
    buttonIdPanelMap[id].toggle();
  };

  this.go = function() {
    view.init();

  };

  /**
   * Adds a new button for a panel to the statusbar and registers the button
   * as a hide target for the panel.
   * 
   * @param {mindmaps.FloatPanel} panel
   */
  this.addEntry = function(panel) {
    var id = buttonCounter++;
    var $button = view.createButton(id, panel.caption);
    panel.setHideTarget($button);
    buttonIdPanelMap[id] = panel;
  };
};

/**
 * This object subscribes to some events and displays status messages in the
 * bottom right corner.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.StatusBarView} view
 */
mindmaps.StatusNotificationController = function(eventBus, view) {
  var $anchor = $("<div class='notification-anchor'/>").css({
    position : "absolute",
    right : 20
  }).appendTo(view);

  eventBus.subscribe(mindmaps.Event.DOCUMENT_SAVED, function() {
    var n = new mindmaps.Notification($anchor, {
      position : "topRight",
      expires : 2500,
      content : "Mind map saved"
    });
  });
  
  eventBus.subscribe(mindmaps.Event.NOTIFICATION_INFO, function(message) {
    var n = new mindmaps.Notification($anchor, {
      position : "topRight",
      content : message,
      expires : 2500,
      type: "info"
    });
  });
  
  eventBus.subscribe(mindmaps.Event.NOTIFICATION_WARN, function(message) {
    var n = new mindmaps.Notification($anchor, {
      position : "topRight",
      title: "Warning",
      content : message,
      expires : 3000,
      type: "warn"
    });
  });
  
  
  eventBus.subscribe(mindmaps.Event.NOTIFICATION_ERROR, function(message) {
    var n = new mindmaps.Notification($anchor, {
      position : "topRight",
      title: "Error",
      content : message,
      expires : 3500,
      type: "error"
    });
  });
};
