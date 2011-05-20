mindmaps.InspectorView = function() {
	var self = this;
	var $content = $("#inspector");
	var $sizeDecreaseButton = $("#inspector-button-font-size-decrease");
	var $sizeIncreaseButton = $("#inspector-button-font-size-increase");
	var $boldCheckbox = $("#inspector-checkbox-font-bold");
	var $italicCheckbox = $("#inspector-checkbox-font-italic");
	var $underlineCheckbox = $("#inspector-checkbox-font-underline");
	var $applyToAllButton = $("#inspector-button-apply-all");
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

		$("input.colorpicker", $content).miniColors({
			change : function(hex, rgb) {

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
		// TODO split change functions into seperate actions. register those
		// into the app model
		// appModel.decreaseNodeFontSize(selectedNode);
		var action = mindmaps.action.node.decreaseFontSize(appModel.selectedNode);
		appModel.executeAction(action);
	};

	view.fontSizeIncreaseButtonClicked = function() {
		var action = mindmaps.action.node.increaseFontSize(appModel.selectedNode);
		appModel.executeAction(action);
	};

	view.fontBoldCheckboxClicked = function(checked) {
		var action = mindmaps.action.node.setFontWeight(appModel.selectedNode, checked);
		appModel.executeAction(action);
	};

	view.fontItalicCheckboxClicked = function(checked) {
		var action = mindmaps.action.node.setFontStyle(appModel.selectedNode, checked);
		appModel.executeAction(action);
	};

	view.fontUnderlineCheckboxClicked = function(checked) {
		var action = mindmaps.action.node.setFontDecoration(appModel.selectedNode, checked);
		appModel.executeAction(action);
	};

	eventBus.subscribe(mindmaps.Event.NODE_FONT_CHANGED, function(node) {
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

	eventBus.subscribe(mindmaps.Event.NODE_DESELECTED, function(node) {
		view.setControlsEnabled(false);
	});

	function updateView(node) {
		var font =node.text.font;
		view.setBoldCheckboxState(font.weight === "bold");
		view.setItalicCheckboxState(font.style === "italic");
		view.setUnderlineCheckboxState(font.decoration === "underline");
	}

	this.go = function() {
		view.init();
	};
};