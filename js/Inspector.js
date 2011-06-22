mindmaps.InspectorView = function() {
	var self = this;
	var $content = $("#template-inspector").tmpl();
	var $sizeDecreaseButton = $("#inspector-button-font-size-decrease",
			$content);
	var $sizeIncreaseButton = $("#inspector-button-font-size-increase",
			$content);
	var $boldCheckbox = $("#inspector-checkbox-font-bold", $content);
	var $italicCheckbox = $("#inspector-checkbox-font-italic", $content);
	var $underlineCheckbox = $("#inspector-checkbox-font-underline", $content);
	var $applyToAllButton = $("#inspector-button-apply-all", $content);
	var branchColorPicker = $("#inspector-branch-color-picker", $content);
	var fontColorPicker = $("#inspector-font-color-picker", $content);
	var $allButtons = [ $sizeDecreaseButton, $sizeIncreaseButton,
			$boldCheckbox, $italicCheckbox, $underlineCheckbox,
			$applyToAllButton ];
	var $allColorpickers = [ branchColorPicker, fontColorPicker ];

	/**
	 * Returns a jquery object.
	 */
	this.getContent = function() {
		return $content;
	};

	this.setControlsEnabled = function(enabled) {
		var state = enabled ? "enable" : "disable";
		$allButtons.forEach(function($button) {
			$button.button(state);
		});

		$allColorpickers.forEach(function($colorpicker) {
			$colorpicker.miniColors("disabled", !enabled);
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
		$applyToAllButton.button();

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

mindmaps.InspectorPresenter = function(eventBus, mindmapModel, view) {
	var self = this;

	view.fontSizeDecreaseButtonClicked = function() {
		var action = new mindmaps.action.DecreaseNodeFontSizeAction(
				mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	view.fontSizeIncreaseButtonClicked = function() {
		var action = new mindmaps.action.IncreaseNodeFontSizeAction(
				mindmapModel.selectedNode);
		mindmapModel.executeAction(action);
	};

	view.fontBoldCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontWeightAction(
				mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.fontItalicCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontStyleAction(
				mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.fontUnderlineCheckboxClicked = function(checked) {
		var action = new mindmaps.action.SetFontDecorationAction(
				mindmapModel.selectedNode, checked);
		mindmapModel.executeAction(action);
	};

	view.branchColorPicked = function(color) {
		var action = new mindmaps.action.SetBranchColorAction(
				mindmapModel.selectedNode, color);
		mindmapModel.executeAction(action);
	};

	view.fontColorPicked = function(color) {
		var action = new mindmaps.action.SetFontColorAction(
				mindmapModel.selectedNode, color);
		mindmapModel.executeAction(action);
	};

	eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(node) {
		if (mindmapModel.selectedNode === node) {
			updateView(node);
		}
	});

	eventBus.subscribe(mindmaps.Event.NODE_BRANCH_COLOR_CHANGED,
			function(node) {
				if (mindmapModel.selectedNode === node) {
					updateView(node);
				}
			});

	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		updateView(node);
	});

	eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
		view.setControlsEnabled(true);
	});
	
	eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
		view.setControlsEnabled(false);
	});

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