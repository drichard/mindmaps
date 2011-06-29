mindmaps.ToolBarView = function() {
	var self = this;

	this.init = function() {
	};

	this.addButton = function(button, alignFunc) {
		// var $button = this.createButton(button);
		alignFunc(button.asJquery());
	};

	this.addButtonGroup = function(buttons, alignFunc) {
		var $buttonset = $("<span/>");
		buttons.forEach(function(button) {
			// var $button = self.createButton(button);
			$buttonset.append(button.asJquery());
		});
		$buttonset.buttonset();
		alignFunc($buttonset);
	};

	this.addMenu = function(menu) {
		this.alignRight(menu.getContent());
	};

	this.alignLeft = function($button) {
		$button.appendTo("#toolbar .buttons-left");
	};

	this.alignRight = function($button) {
		$button.appendTo("#toolbar .buttons-right");
	};
};

/**
 * Toolbar button object
 * 
 * @constructor
 * @param {mindmaps.Command} command
 */

mindmaps.ToolBarButton = function(command) {
	this.command = command;

	// callback to update display state
	var self = this;
	command.subscribe(mindmaps.Command.Event.ENABLED_CHANGED, function(enabled) {
		if (self.setEnabled) {
			self.setEnabled(enabled);
		}
	});
};

mindmaps.ToolBarButton.prototype.isEnabled = function() {
	return this.command.enabled;
};

mindmaps.ToolBarButton.prototype.click = function() {
	this.command.execute();
};

mindmaps.ToolBarButton.prototype.getTitle = function() {
	return this.command.label;
};

mindmaps.ToolBarButton.prototype.getToolTip = function() {
	var tooltip = this.command.description;

	var shortcut = this.command.shortcut;
	if (shortcut) {
		tooltip += " [" + shortcut.toUpperCase() + "]";
	}

	return tooltip;
};

mindmaps.ToolBarButton.prototype.getId = function() {
	return "button-" + this.command.id;
};

mindmaps.ToolBarButton.prototype.asJquery = function() {
	var self = this;
	var $button = $("<div/>", {
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

mindmaps.ToolBarMenu = function(title, icon) {
	var self = this;
	this.$menuWrapper = $("<span/>", {
		"class" : "menu-wrapper"
	});

	this.$menuButton = $("<div/>").button({
		label : title,
		icons : {
			primary : icon,
			secondary : "ui-icon-triangle-1-s"
		}
	}).appendTo(this.$menuWrapper);

	this.$menu = $("<div/>", {
		"class" : "menu"
	}).click(function() {
		/*
		 * hack to hide menu on click. visibility on hover is triggered by CSS.
		 * force display:none for a short time and remove class immediately
		 * again.
		 */
		self.$menu.addClass("hidden");
		setTimeout(function() {
			self.$menu.removeClass("hidden");
		}, 10);
	}).appendTo(this.$menuWrapper);

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

	this.getContent = function() {
		return this.$menuWrapper;
	};
};

mindmaps.ToolBarPresenter = function(eventBus, commandRegistry, view,
		mindmapModel) {
	// map commands to buttons
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

	var undoCommands = [ mindmaps.UndoCommand, mindmaps.RedoCommand ];
	var undoButtons = commandsToButtons(undoCommands);
	view.addButtonGroup(undoButtons, view.alignLeft);

	var clipboardCommands = [ mindmaps.CopyNodeCommand,
			mindmaps.CutNodeCommand, mindmaps.PasteNodeCommand ];
	var clipboardButtons = commandsToButtons(clipboardCommands);
	view.addButtonGroup(clipboardButtons, view.alignLeft);

	// file menu
	var fileMenu = new mindmaps.ToolBarMenu("Mind map", "ui-icon-document");
	var fileCommands = [ mindmaps.NewDocumentCommand,
			mindmaps.OpenDocumentCommand, mindmaps.SaveDocumentCommand,
			mindmaps.CloseDocumentCommand ];
	var fileButtons = commandsToButtons(fileCommands);
	fileMenu.add(fileButtons);

	view.addMenu(fileMenu);

	view.addButton(commandToButton(mindmaps.HelpCommand), view.alignRight);

	this.go = function() {
		view.init();
	};
};