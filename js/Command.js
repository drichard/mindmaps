/**
 * Base command
 */
mindmaps.Command = function() {
	this.id = "BASE_COMMAND";
	this.shortcut = null;
	this.handler = null;
	this.description = null;
	this.enabled = true;
};

mindmaps.CommandEvent = {
	HANDLER_REGISTERED : "HandlerRegisteredCommandEvent",
	HANDLER_REMOVED : "HandlerRemovedCommandEvent",
	ENABLED_CHANGED : "EnabledChangedCommandEvent"
};

mindmaps.Command.prototype = {
	execute : function() {
		if (this.handler) {
			this.handler();
		}
	},

	setHandler : function(handler) {
		this.removeHandler();
		this.handler = handler;
		this.publish(mindmaps.CommandEvent.HANDLER_REGISTERED);
	},

	removeHandler : function() {
		this.handler = null;
		this.publish(mindmaps.CommandEvent.HANDLER_REMOVED);
	},

	setEnabled : function(enabled) {
		this.enabled = enabled;
		this.publish(mindmaps.CommandEvent.ENABLED_CHANGED, enabled);
	}
};
MicroEvent.mixin(mindmaps.Command);

/**
 * Node commands
 */
mindmaps.CreateNodeCommand = function() {
	this.id = "CREATE_NODE_COMMAND";
	this.shortcut = "insert";
	this.description = "Creates a new node";
};
mindmaps.CreateNodeCommand.prototype = new mindmaps.Command();

mindmaps.DeleteNodeCommand = function() {
	this.id = "DELETE_NODE_COMMAND";
	this.shortcut = "del";
	this.description = "Deletes a new node";
};
mindmaps.DeleteNodeCommand.prototype = new mindmaps.Command();

/**
 * Undo commands
 */
mindmaps.UndoCommand = function() {
	this.id = "UNDO_COMMAND";
	this.shortcut = "ctrl+z";
	this.description = "Undo";
};
mindmaps.UndoCommand.prototype = new mindmaps.Command();

mindmaps.RedoCommand = function() {
	this.id = "REDO_COMMAND";
	this.shortcut = "ctrl+y";
	this.description = "Redo";
};
mindmaps.RedoCommand.prototype = new mindmaps.Command();

/**
 * Clipboard commands
 */
mindmaps.CopyNodeCommand = function() {
	this.id = "COPY_COMMAND";
	this.shortcut = "ctrl+c";
	this.description = "Copy a branch";
};
mindmaps.CopyNodeCommand.prototype = new mindmaps.Command();

mindmaps.CutNodeCommand = function() {
	this.id = "CUT_COMMAND";
	this.shortcut = "ctrl+x";
	this.description = "Cut a branch";
};
mindmaps.CutNodeCommand.prototype = new mindmaps.Command();

mindmaps.PasteNodeCommand = function() {
	this.id = "PASTE_COMMAND";
	this.shortcut = "ctrl+v";
	this.description = "Paste a branch";
};
mindmaps.PasteNodeCommand.prototype = new mindmaps.Command();


mindmaps.NewDocumentCommand = function() {
	this.id = "NEW_DOCUMENT_COMMAND";
	this.description = "Start working on a new mind map";
};
mindmaps.NewDocumentCommand.prototype = new mindmaps.Command();


mindmaps.OpenDocumentCommand = function() {
	this.id = "OPEN_DOCUMENT_COMMAND";
	this.description = "Open an existing mind map";
};
mindmaps.OpenDocumentCommand.prototype = new mindmaps.Command();


mindmaps.SaveDocumentCommand = function() {
	this.id = "SAVE_DOCUMENT_COMMAND";
	this.description = "Save the mind map";
};
mindmaps.SaveDocumentCommand.prototype = new mindmaps.Command();

mindmaps.CloseDocumentCommand = function() {
	this.id = "CLOSE_DOCUMENT_COMMAND";
	this.description = "Close the mind map";
};
mindmaps.CloseDocumentCommand.prototype = new mindmaps.Command();