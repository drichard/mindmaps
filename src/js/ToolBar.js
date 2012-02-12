/**
 * Creates a new ToolBarView.
 * 
 * @constructor
 */
mindmaps.ToolBarView = function() {
  var self = this;

  this.init = function() {
  };

  /**
   * Adds a button to the toolbar with the given align function.
   * 
   * @param {mindmaps.ToolBarButton} button
   * @param {Function} alignFunc
   */
  this.addButton = function(button, alignFunc) {
    // var $button = this.createButton(button);
    alignFunc(button.asJquery());
  };

  /**
   * Adds a set of buttons grouped together to the toolbar.
   * 
   * @param {mindmaps.ToolBarButton[]} buttons
   * @param {Function} alignFunc
   */
  this.addButtonGroup = function(buttons, alignFunc) {
    var $buttonset = $("<span/>");
    buttons.forEach(function(button) {
      // var $button = self.createButton(button);
      $buttonset.append(button.asJquery());
    });
    $buttonset.buttonset();
    alignFunc($buttonset);
  };

  /**
   * Adds a menu to the toolbar.
   * 
   * @param {mindmaps.ToolBarMenu} menu
   */
  this.addMenu = function(menu) {
    this.alignRight(menu.getContent());
  };

  /**
   * Adds the element to the left side of the toolbar.
   * 
   * @param {jQuery} $el
   */
  this.alignLeft = function($el) {
    $el.appendTo("#toolbar .buttons-left");
  };

  /**
   * Adds the element to the right side of the toolbar.
   * 
   * @param {jQuery} $el
   */
  this.alignRight = function($el) {
    $el.appendTo("#toolbar .buttons-right");
  };
};

/**
 * Toolbar button model.
 * 
 * @constructor
 * @param {mindmaps.Command} command
 */

mindmaps.ToolBarButton = function(command) {
  this.command = command;

  // callback to update display state
  var self = this;
  command.subscribe(mindmaps.Command.Event.ENABLED_CHANGED,
      function(enabled) {
        if (self.setEnabled) {
          self.setEnabled(enabled);
        }
      });
};

/**
 * Returns whether the button should have an enabled style.
 * 
 * @returns {Boolean}
 */
mindmaps.ToolBarButton.prototype.isEnabled = function() {
  return this.command.enabled;
};

/**
 * Executes the button's command.
 */
mindmaps.ToolBarButton.prototype.click = function() {
  this.command.execute();
};

/**
 * Gets the button's title.
 * 
 * @returns {String}
 */
mindmaps.ToolBarButton.prototype.getTitle = function() {
  return this.command.label;
};

/**
 * Gets the tooltip.
 * 
 * @returns {String}
 */
mindmaps.ToolBarButton.prototype.getToolTip = function() {
  var tooltip = this.command.description; 
  
  var shortcut = this.command.shortcut;
  if (shortcut) {
    if (Array.isArray(shortcut)) {
      shortcut = shortcut.join(", ");
    }

    tooltip += " [" + shortcut.toUpperCase() + "]";
  }

  return tooltip;
};

/**
 * Gets the unique id of the button.
 * 
 * @returns {String}
 */
mindmaps.ToolBarButton.prototype.getId = function() {
  return "button-" + this.command.id;
};

/**
 * Constructs a jQuery element that represents the button.
 * 
 * @returns {jQuery}
 */
mindmaps.ToolBarButton.prototype.asJquery = function() {
  var self = this;
  var $button = $("<button/>", {
    id : this.getId(),
    title : this.getToolTip()
  }).click(function() {
    self.click();
  }).button({
    label : this.getTitle(),
    disabled : !this.isEnabled()
  });

  var icon = this.command.icon;
  if (icon) {
    $button.button({
      icons : {
        primary : icon
      }
    });
  }

  // callback to update display state
  this.setEnabled = function(enabled) {
    $button.button(enabled ? "enable" : "disable");
  };

  return $button;
};

/**
 * Creates a new ToolBarMenu.
 * 
 * @constructor
 * @param {String} title
 * @param {String} icon
 */
mindmaps.ToolBarMenu = function(title, icon) {
  var self = this;
  this.$menuWrapper = $("<span/>", {
    "class" : "menu-wrapper"
  }).hover(function() {
    self.$menu.show();
  }, function() {
    self.$menu.hide();
  });

  this.$menuButton = $("<button/>").button({
    label : title,
    icons : {
      primary : icon,
      secondary : "ui-icon-triangle-1-s"
    }
  }).appendTo(this.$menuWrapper);

  this.$menu = $("<div/>", {
    "class" : "menu"
  }).click(function() {
    self.$menu.hide();
  }).appendTo(this.$menuWrapper);

  /**
   * Adds a new button entry to the menu.
   * 
   * @param {mindmaps.ToolBarButton|mindmaps.ToolBarButtons[]} buttons a
   *            single button or an array of buttons
   */
  this.add = function(buttons) {
    if (!Array.isArray(buttons)) {
      buttons = [ buttons ];
    }

    buttons.forEach(function(button) {
      var $button = button.asJquery().removeClass("ui-corner-all")
          .addClass("menu-item");
      this.$menu.append($button);
    }, this);

    // last item gets rounded corners
    this.$menu.children().last().addClass("ui-corner-bottom").prev()
        .removeClass("ui-corner-bottom");
  };

  /**
   * Returns the underlying jquery object.
   * 
   * @returns {jQuery}
   */
  this.getContent = function() {
    return this.$menuWrapper;
  };
};

/**
 * Creates a new ToolBarPresenter.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.ToolBarView} view
 * @param {mindmaps.MindMapModel} mindmapModel
 */
mindmaps.ToolBarPresenter = function(eventBus, commandRegistry, view,
    mindmapModel) {
  /**
   * Returns a button that registers with a command of the given commandType
   * 
   * @param {mindmaps.Command} commandType
   * @returns {mindmaps.ToolBarButton}
   */
  function commandToButton(commandType) {
    var command = commandRegistry.get(commandType);
    return new mindmaps.ToolBarButton(command);
  }

  function commandsToButtons(commands) {
    return commands.map(commandToButton);
  }

  // populate toolbar

  // node buttons
  var nodeCommands = [ mindmaps.CreateNodeCommand, mindmaps.DeleteNodeCommand ];
  var nodeButtons = commandsToButtons(nodeCommands);
  view.addButtonGroup(nodeButtons, view.alignLeft);

  // undo buttons
  var undoCommands = [ mindmaps.UndoCommand, mindmaps.RedoCommand ];
  var undoButtons = commandsToButtons(undoCommands);
  view.addButtonGroup(undoButtons, view.alignLeft);

  // clipboard buttons.
  var clipboardCommands = [ mindmaps.CopyNodeCommand,
      mindmaps.CutNodeCommand, mindmaps.PasteNodeCommand ];
  var clipboardButtons = commandsToButtons(clipboardCommands);
  view.addButtonGroup(clipboardButtons, view.alignLeft);

  // file menu
  var fileMenu = new mindmaps.ToolBarMenu("Mind map", "ui-icon-document");
  var fileCommands = [ mindmaps.NewDocumentCommand,
      mindmaps.OpenDocumentCommand, mindmaps.SaveDocumentCommand,
      mindmaps.ExportCommand, mindmaps.PrintCommand,
      mindmaps.CloseDocumentCommand ];
  var fileButtons = commandsToButtons(fileCommands);
  fileMenu.add(fileButtons);
  view.addMenu(fileMenu);

  // help button
  view.addButton(commandToButton(mindmaps.HelpCommand), view.alignRight);

  this.go = function() {
    view.init();
  };
};
