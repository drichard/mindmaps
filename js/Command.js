/**
 * Base command
 */
mindmaps.Command = function() {
	this.id = "BASE_COMMAND";
	this.shortcut = null;
	this.handler = null;
	this.label = null;
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
			if (mindmaps.DEBUG) {
				console.log("handler called for", this.id);
			}
		} else {
			if (mindmaps.DEBUG) {
				console.log("no handler found for", this.id);
			}
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
	this.label = "Add";
	this.description = "Creates a new node";
};
mindmaps.CreateNodeCommand.prototype = new mindmaps.Command();

mindmaps.DeleteNodeCommand = function() {
	this.id = "DELETE_NODE_COMMAND";
	this.shortcut = "del";
	this.label = "Delete";
	this.description = "Deletes a new node";
};
mindmaps.DeleteNodeCommand.prototype = new mindmaps.Command();

mindmaps.EditNodeCaptionCommand = function() {
	this.id = "EDIT_NODE_CAPTION_COMMAND";
	this.shortcut = "F2";
	this.label = "Edit node caption";
	this.description = "Edits the node text";
};
mindmaps.EditNodeCaptionCommand.prototype = new mindmaps.Command();

mindmaps.ToggleNodeFoldedCommand = function() {
	this.id = "TOGGLE_NODE_FOLDED_COMMAND";
	this.shortcut = "space";
	this.description = "Show or hide the node's children";
};
mindmaps.ToggleNodeFoldedCommand.prototype = new mindmaps.Command();

/**
 * Undo commands
 */
mindmaps.UndoCommand = function() {
	this.id = "UNDO_COMMAND";
	this.shortcut = "ctrl+z";
	this.label = "Undo";
	this.description = "Undo";
};
mindmaps.UndoCommand.prototype = new mindmaps.Command();

mindmaps.RedoCommand = function() {
	this.id = "REDO_COMMAND";
	this.shortcut = "ctrl+y";
	this.label = "Redo";
	this.description = "Redo";
};
mindmaps.RedoCommand.prototype = new mindmaps.Command();

/**
 * Clipboard commands
 */
mindmaps.CopyNodeCommand = function() {
	this.id = "COPY_COMMAND";
	this.shortcut = "ctrl+c";
	this.label = "Copy";
	this.description = "Copy a branch";
};
mindmaps.CopyNodeCommand.prototype = new mindmaps.Command();

mindmaps.CutNodeCommand = function() {
	this.id = "CUT_COMMAND";
	this.shortcut = "ctrl+x";
	this.label = "Cut";
	this.description = "Cut a branch";
};
mindmaps.CutNodeCommand.prototype = new mindmaps.Command();

mindmaps.PasteNodeCommand = function() {
	this.id = "PASTE_COMMAND";
	this.shortcut = "ctrl+v";
	this.label = "Paste";
	this.description = "Paste a branch";
};
mindmaps.PasteNodeCommand.prototype = new mindmaps.Command();

mindmaps.NewDocumentCommand = function() {
	this.id = "NEW_DOCUMENT_COMMAND";
	this.label = "New";
	this.shortcut = "ctrl+n";
	this.description = "Start working on a new mind map";
};
mindmaps.NewDocumentCommand.prototype = new mindmaps.Command();

mindmaps.OpenDocumentCommand = function() {
	this.id = "OPEN_DOCUMENT_COMMAND";
	this.label = "Open";
	this.shortcut = "ctrl+o";
	this.description = "Open an existing mind map";
};
mindmaps.OpenDocumentCommand.prototype = new mindmaps.Command();

mindmaps.SaveDocumentCommand = function() {
	this.id = "SAVE_DOCUMENT_COMMAND";
	this.label = "Save";
	this.shortcut = "ctrl+s";
	this.description = "Save the mind map";
};
mindmaps.SaveDocumentCommand.prototype = new mindmaps.Command();

mindmaps.CloseDocumentCommand = function() {
	this.id = "CLOSE_DOCUMENT_COMMAND";
	this.label = "Close";
	this.shortcut = "ctrl+w";
	this.description = "Close the mind map";
};
mindmaps.CloseDocumentCommand.prototype = new mindmaps.Command();