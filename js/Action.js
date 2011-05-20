mindmaps.action = {};

mindmaps.action.node = {
	move : function(node, offset) {
		var oldOffset = node.offset;

		return {
			execute : function() {
				node.offset = offset;
			},
			event : [ mindmaps.Event.NODE_MOVED, node ],
			undo : function() {
				return mindmaps.action.node.move(node, oldOffset);
			}
		};
	},

	remove : function(node) {
		var parent = node.getParent();
		return {
			execute : function(context) {
				var map = context.getMindMap();
				map.removeNode(node);
			},
			event : [ mindmaps.Event.NODE_DELETED, node, parent ],
			undo : function() {
				return mindmaps.action.node.create(node, parent);
			}
		};
	},

	create : function(node, parent, origin) {
		return {
			execute : function(context) {
				var map = context.getMindMap();
				map.addNode(node);
				parent.addChild(node);
			},
			event : [ mindmaps.Event.NODE_CREATED, node, origin ],
			undo : function() {
				return mindmaps.action.node.remove(node);
			}
		};
	},

	toggleCollapse : function(node) {
		if (node.collapseChildren) {
			return mindmaps.action.node.open(node);
		} else {
			return mindmaps.action.node.close(node);
		}
	},

	open : function(node) {
		return {
			execute : function() {
				node.collapseChildren = false;
			},
			event : [ mindmaps.Event.NODE_OPENED, node ]
		};
	},

	close : function(node) {
		return {
			execute : function() {
				node.collapseChildren = true;
			},
			event : [ mindmaps.Event.NODE_CLOSED, node ]
		};
	},

	changeCaption : function(node, caption) {
		var oldCaption = node.getCaption();

		// dont update if nothing has changed
		if (oldCaption === caption) {
			return;
		}
		// TODO put somewhere
		/*
		 * // change document title when root was renamed if (node.isRoot()) {
		 * document.title = newCaption; }
		 */
		return {
			execute : function() {
				node.setCaption(caption);
			},
			event : [ mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, node ],
			undo : function() {
				return mindmaps.action.node.changeCaption(node, oldCaption);
			}
		};
	},

	changeFontSize : function(node, step) {
		return {
			execute : function() {
				node.text.font.size += step;
			},
			event : [ mindmaps.Event.NODE_FONT_CHANGED, node ],
			undo : function() {
				return mindmaps.action.node.changeFontSize(node, -step);
			}
		};
	},

	decreaseFontSize : function(node) {
		return mindmaps.action.node.changeFontSize(node, -4);
	},

	increaseFontSize : function(node) {
		return mindmaps.action.node.changeFontSize(node, 4);
	},

	setFontWeight : function(node, bold) {
		return {
			execute : function() {
				var weight = bold ? "bold" : "normal";
				node.text.font.weight = weight;
			},
			event : [ mindmaps.Event.NODE_FONT_CHANGED, node ],
			undo : function() {
				return mindmaps.action.node.setFontWeight(node, !bold);
			}
		};
	},

	setFontStyle : function(node, italic) {
		return {
			execute : function() {
				var style = italic ? "italic" : "normal";
				node.text.font.style = style;
			},
			event : [ mindmaps.Event.NODE_FONT_CHANGED, node ],
			undo : function() {
				return mindmaps.action.node.setFontStyle(node, !italic);
			}
		};
	},

	setFontDecoration : function(node, underline) {
		return {
			execute : function() {
				var decoration = underline ? "underline" : "none";
				node.text.font.decoration = decoration;
			},
			event : [ mindmaps.Event.NODE_FONT_CHANGED, node ],
			undo : function() {
				return mindmaps.action.node.setFontDecoration(node, !underline);
			}
		};
	}

};