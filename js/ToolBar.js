mindmaps.ToolBarView = function() {
	var self = this;

	this.init = function() {
	};

	this.createButton = function(button) {
		var $button = $("<button/>", {
			id : button.getId(),
			title : button.getToolTip()
		}).click(function() {
			button.click();
		}).button({
			label : button.getTitle(),
			disabled : !button.isEnabled()
		});

		// callback to update display state
		button.setEnabled = function(enabled) {
			$button.button(enabled ? "enable" : "disable");
		};

		return $button;
	};

	this.addButton = function(button, alignFunc) {
		var $button = this.createButton(button);
		alignFunc($button);
	};

	this.addButtonGroup = function(buttons, alignFunc) {
		var $buttonset = $("<span/>");
		buttons.forEach(function(button) {
			var $button = self.createButton(button);
			$buttonset.append($button);
		});
		$buttonset.buttonset();
		alignFunc($buttonset);
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
 * @param command
 * @returns {Button}
 */

mindmaps.ToolBarButton = function(command) {
	this.command = command;

	// callback to update display state
	var self = this;
	command.subscribe(mindmaps.CommandEvent.ENABLED_CHANGED, function(enabled) {
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
	return this.command.description;
};

mindmaps.ToolBarButton.prototype.getId = function() {
	return "button-" + this.command.id;
};

mindmaps.ToolBarPresenter = function(eventBus, commandRegistry, view,
		mindmapModel) {
	// map commands to buttons
	function commandsToButtons(commands) {
		return commands.map(function(commandType) {
			var command = commandRegistry.get(commandType);
			return new mindmaps.ToolBarButton(command);
		});
	}

	// populate toolbar
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

	var fileCommands = [ mindmaps.NewDocumentCommand,
			mindmaps.OpenDocumentCommand, mindmaps.SaveDocumentCommand,
			mindmaps.CloseDocumentCommand ];
	var fileButtons = commandsToButtons(fileCommands);
	view.addButtonGroup(fileButtons, view.alignRight);

	// debug stuff
	if (mindmaps.DEBUG) {
		var bigmapbutton = {
			getTitle : function() {
				return "big map";
			},
			getId : function() {
				return "bigmap";
			},
			getToolTip : function() {
				return "create a really big map";
			},
			click : function() {
				var map = getBinaryMapWithDepth(8);
				var doc = new mindmaps.Document();
				doc.mindmap = map;
				mindmapModel.setDocument(doc);
			},
			isEnabled : function() {
				return true;
			}
		};
		view.addButton(bigmapbutton, view.alignLeft);
	}

	this.go = function() {
		view.init();
	};
};