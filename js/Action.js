mindmaps.action = {};

mindmaps.action.Action = function() {
};

mindmaps.action.Action.prototype = {
	/**
	 * Make this action un-undoable.
	 * 
	 * @returns {mindmaps.action.Action}
	 */
	noUndo : function() {
		delete this.undo;
		delete this.redo;
		return this;
	},

	/**
	 * Dont emit an event after execution.
	 * 
	 * @returns {mindmaps.action.Action}
	 */
	noEvent : function() {
		delete this.event;
		return this;
	},

	/**
	 * Executes this action. Explicitly returning false will cancel this action
	 * and not raise an event or undoable action.
	 * 
	 * @param the
	 *            execution context, the application model
	 */
	execute : function(context) {
	}
};

mindmaps.action.MoveNodeAction = function(node, offset) {
	var oldOffset = node.offset;

	this.execute = function() {
		node.offset = offset;
	};

	this.event = [ mindmaps.Event.NODE_MOVED, node ];
	this.undo = function() {
		return new mindmaps.action.MoveNodeAction(node, oldOffset);
	};
};
mindmaps.action.MoveNodeAction.prototype = new mindmaps.action.Action();

mindmaps.action.DeleteNodeAction = function(node) {
	var parent = node.getParent();

	this.execute = function(context) {
		if (node.isRoot()) {
			return false;
		}
		var map = context.getMindMap();
		map.removeNode(node);
	};

	this.event = [ mindmaps.Event.NODE_DELETED, node, parent ];
	this.undo = function() {
		return new mindmaps.action.CreateNodeAction(node, parent);
	};
};
mindmaps.action.DeleteNodeAction.prototype = new mindmaps.action.Action();


mindmaps.action.CreateNodeAction = function(node, parent) {
	this.execute = function(context) {
		var map = context.getMindMap();
		map.addNode(node);
		parent.addChild(node);
	};

	this.event = [ mindmaps.Event.NODE_CREATED, node ];
	this.undo = function() {
		return new mindmaps.action.DeleteNodeAction(node);
	};
};
mindmaps.action.CreateNodeAction.prototype = new mindmaps.action.Action();

mindmaps.action.ToggleNodeCollapseAction = function(node) {
	if (node.collapseChildren) {
		return new mindmaps.action.OpenNodeAction(node);
	} else {
		return new mindmaps.action.CloseNodeAction(node);
	}
};
mindmaps.action.ToggleNodeCollapseAction.prototype = new mindmaps.action.Action();

mindmaps.action.OpenNodeAction = function(node) {
	this.execute = function(context) {
		node.collapseChildren = false;
	};

	this.event = [ mindmaps.Event.NODE_OPENED, node ];

};
mindmaps.action.OpenNodeAction.prototype = new mindmaps.action.Action();

mindmaps.action.CloseNodeAction = function(node) {
	this.execute = function(context) {
		node.collapseChildren = true;
	};

	this.event = [ mindmaps.Event.NODE_CLOSED, node ];

};
mindmaps.action.CloseNodeAction.prototype = new mindmaps.action.Action();

mindmaps.action.ChangeNodeCaptionAction = function(node, caption) {
	var oldCaption = node.getCaption();

	this.execute = function(context) {
		// TODO put somewhere
		/*
		 * // change document title when root was renamed if (node.isRoot()) {
		 * document.title = newCaption; }
		 */

		// dont update if nothing has changed
		if (oldCaption === caption) {
			return false;
		}
		node.setCaption(caption);
	};

	this.event = [ mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.ChangeCaptionAction(node, oldCaption);
	};
};
mindmaps.action.ChangeNodeCaptionAction.prototype = new mindmaps.action.Action();

mindmaps.action.ChangeNodeFontSizeAction = function(node, step) {
	this.execute = function(context) {
		node.text.font.size += step;
	};

	this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.ChangeNodeFontSizeAction(node, -step);
	};
};
mindmaps.action.ChangeNodeFontSizeAction.prototype = new mindmaps.action.Action();

mindmaps.action.DecreaseNodeFontSizeAction = function(node) {
	return new mindmaps.action.ChangeNodeFontSizeAction(node, -4);
};

mindmaps.action.IncreaseNodeFontSizeAction = function(node) {
	return new mindmaps.action.ChangeNodeFontSizeAction(node, 4);
};

mindmaps.action.SetFontWeightAction = function(node, bold) {
	this.execute = function(context) {
		var weight = bold ? "bold" : "normal";
		node.text.font.weight = weight;
	};

	this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.SetFontWeightAction(node, !bold);
	};
};
mindmaps.action.SetFontWeightAction.prototype = new mindmaps.action.Action();


mindmaps.action.SetFontStyleAction = function(node, italic) {
	this.execute = function(context) {
		var style = italic ? "italic" : "normal";
		node.text.font.style = style;
	};

	this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.SetFontStyleAction(node, !italic);
	};
};
mindmaps.action.SetFontStyleAction.prototype = new mindmaps.action.Action();


mindmaps.action.SetFontDecorationAction = function(node, underline) {
	this.execute = function(context) {
		var decoration = underline ? "underline" : "none";
		node.text.font.decoration = decoration;
	};

	this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.SetFontDecorationAction(node, !underline);
	};
};
mindmaps.action.SetFontDecorationAction.prototype = new mindmaps.action.Action();

mindmaps.action.SetFontColorAction = function(node, fontColor) {
	var oldColor = node.text.font.color;
	this.execute = function(context) {
		node.text.font.color = fontColor;
	};

	this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.SetFontColorAction(node, oldColor);
	};
};
mindmaps.action.SetFontColorAction.prototype = new mindmaps.action.Action();


mindmaps.action.SetBranchColorAction = function(node, branchColor) {
	var oldColor = node.branchColor;
	this.execute = function(context) {
		node.branchColor = branchColor;
	};

	this.event = [ mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, node ];
	this.undo = function() {
		return new mindmaps.action.SetBranchColorAction(node, oldColor);
	};
};
mindmaps.action.SetBranchColorAction.prototype = new mindmaps.action.Action();