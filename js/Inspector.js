mindmaps.InspectorView = function() {
	var self = this;
	var $content = $("#inspector");
	var $sizeDecreaseButton = $("#inspector-button-font-size-decrease");
	var $sizeIncreaseButton = $("#inspector-button-font-size-increase");
	var $boldCheckbox = $("#inspector-checkbox-font-bold");
	var $italicCheckbox = $("#inspector-checkbox-font-italic");
	var $underlineCheckbox = $("#inspector-checkbox-font-underline");
	var $applyToAllButton = $("#inspector-button-apply-all");
	var branchColorPicker = $("#inspector-branch-color-picker");
	var fontColorPicker = $("#inspector-font-color-picker");
	var $allControls = [ $sizeDecreaseButton, $sizeIncreaseButton,
			$boldCheckbox, $italicCheckbox, $underlineCheckbox,
			$applyToAllButton ];

	/**
	 * Returns a jquery object.
	 */
	this.getContent = function() {
		return $content;
	};

	this.setControlsEnabled = function(enabled) {
		_.each($allControls, function($button) {
			var state = enabled ? "enable" : "disable";
			$button.button(state);
		});
	};

	this.setBoldCheckboxState = function(checked) {
		$boldCheckbox.prop("checked", checked).button("refresh");
	};

	this.setItalicCheckboxState = function(checked) {
		$italicCheckbox.prop("checked", checked).button("refresh");
	};

	this.setUnderlineCheckboxState = function(checked) {
		$underlineCheckbox.prop("checked", checked).button("refresh");
	};

	this.setBranchColorPickerColor = function(color) {
		branchColorPicker.miniColors("value", color);
	};

	this.setFontColorPickerColor = function(color) {
		fontColorPicker.miniColors("value", color);
	};

	this.init = function() {
		$(".buttonset", $content).buttonset();
		$("#inspector-button-apply-all").button();

		$sizeDecreaseButton.click(function() {
			if (self.fontSizeDecreaseButtonClicked) {
				self.fontSizeDecreaseButtonClicked();
			}
		});

		$sizeIncreaseButton.click(function() {
			if (self.fontSizeIncreaseButtonClicked) {
				self.fontSizeIncreaseButtonClicked();
			}
		});

		$boldCheckbox.click(function() {
			if (self.fontBoldCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontBoldCheckboxClicked(checked);
			}
		});

		$italicCheckbox.click(function() {
			if (self.fontItalicCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontItalicCheckboxClicked(checked);
			}
		});

		$underlineCheckbox.click(function() {
			if (self.fontUnderlineCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontUnderlineCheckboxClicked(checked);
			}
		});

		branchColorPicker.miniColors({
			hide : function(hex) {
				console.log("branch", hex);
				if (self.branchColorPicked) {
					self.branchColorPicked(hex);
				}
			}
		});

		fontColorPicker.miniColors({
			hide : function(hex) {
				console.log("font", hex);
				if (self.fontColorPicked) {
					self.fontColorPicked(hex);
				}
			}
		});

		$applyToAllButton.click(function() {
			if (self.applyStylesToChildrenButtonClicked) {
				self.applyStylesToChildrenButtonClicked();
			}
		});
	};
};

mindmaps.InspectorPresenter = function(eventBus, appModel, view) {
	var self = this;

	view.fontSizeDecreaseButtonClicked = function() {
		var action = new mindmaps.action.DecreaseNodeFontSizeAction(
				appModel.selectedNode);
		appModel.executeAction(action);
	};

	view.fontSizeIncreaseButtonClicked = function() {
		var action = new mindmaps.action.IncreaseNodeFontSizeAction(
				appModel.selectedNode);
		appModel.executeAction(action);
	};

	view.fontBoldCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontWeightAction(
				appModel.selectedNode, checked);
		appModel.executeAction(action);
	};

	view.fontItalicCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontStyleAction(
				appModel.selectedNode, checked);
		appModel.executeAction(action);
	};

	view.fontUnderlineCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontDecorationAction(
				appModel.selectedNode, checked);
		appModel.executeAction(action);
	};

	view.branchColorPicked = function(color) {
		var action = new mindmaps.action.SetBranchColorAction(
				appModel.selectedNode, color);
		appModel.executeAction(action);
	};

	view.fontColorPicked = function(color) {
		var action = new mindmaps.action.SetFontColorAction(
				appModel.selectedNode, color);
		appModel.executeAction(action);
	};

	eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(node) {
		if (appModel.selectedNode === node) {
			updateView(node);
		}
	});
	
	eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, function(node) {
		if (appModel.selectedNode === node) {
			updateView(node);
		}
	});

	eventBus.subscribe(mindmaps.Event.NODE_DELETED, function() {
	});

	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		view.setControlsEnabled(true);
		updateView(node);
	});

//	eventBus.subscribe(mindmaps.Event.NODE_DESELECTED, function(node) {
//		view.setControlsEnabled(false);
//	});

	function updateView(node) {
		var font = node.text.font;
		view.setBoldCheckboxState(font.weight === "bold");
		view.setItalicCheckboxState(font.style === "italic");
		view.setUnderlineCheckboxState(font.decoration === "underline");
		view.setFontColorPickerColor(font.color);
		view.setBranchColorPickerColor(node.branchColor);
	}

	this.go = function() {
		view.init();
	};
};