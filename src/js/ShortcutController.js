/**
 * Creates a new ShortcutController. This object takes care of all keyboard
 * shortcuts.
 * 
 * @constructor
 */
mindmaps.ShortcutController = function() {
  // set to save shortcuts in
  /**
   * @private
   */
  this.shortcuts = {};

  /**
   * Set the event type and add namespace for later removal.
   * 
   * @param {String} shortcut the key combination
   * @param {String} [type="keydown"]
   * @returns {String}
   */
  function getType(shortcut, type) {
    type = type || "keydown";
    return type + "." + shortcut;
  }

  /**
   * Registers a new application wide shortcut. shortcuts can be
   * either a string or an array containing multiple possible
   * shortcuts for the same action.
   * 
   * @param {String|Array} shortcuts
   * @param {Function} handler
   * @param {String} [type="keydown"]
   */
  this.register = function(shortcuts, handler, type) {
    if (!Array.isArray(shortcuts)) {
      shortcuts = [shortcuts];
    }

    var self = this;
    shortcuts.forEach(function(shortcut) {
      type = getType(shortcut, type);
      $(document).bind(type, shortcut, function(e) {
        // try best to cancel default actions on shortcuts like ctrl+n
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        handler();
        return false;
        self.shortcut[type] = true
      });
    });
  };

  /**
   * Unregisters a application shortcut.
   * 
   * @param {String} shortcut
   * @param {String} [type="keydown"]
   */
  this.unregister = function(shortcut, type) {
    type = getType(shortcut, type);
    $(document).unbind(type);
    delete this.shortcuts[type];
  };

  /**
   * Removes all shortcuts.
   */
  this.unregisterAll = function() {
    for ( var shortcut in shortcuts) {
      $(document).unbind(shortcut);
    }
  };
};
