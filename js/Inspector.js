mindmaps.InspectorView = function() {
	var self = this;
	var $content = $("#inspector");

	/**
	 * Returns a jquery object.
	 */
	this.getContent = function() {
		return $content;
	};

	this.init = function() {
		$(".buttonset", $content).buttonset();
		$("#inspector-button-apply-all").button();

		$("#inspector-button-font-size-decrease").click(function() {
			if (self.fontSizeDecreaseButtonClicked) {
				self.fontSizeDecreaseButtonClicked();
			}
		});

		$("#inspector-button-font-size-increase").click(function() {
			if (self.fontSizeIncreaseButtonClicked) {
				self.fontSizeIncreaseButtonClicked();
			}
		});

		$("#inspector-checkbox-font-bold").click(function() {
			if (self.fontBoldCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontBoldCheckboxClicked(checked);
			}
		});

		$("#inspector-checkbox-font-italic").click(function() {
			if (self.fontItalicCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontItalicCheckboxClicked(checked);
			}
		});

		$("#inspector-checkbox-font-underline").click(function() {
			if (self.fontUnderlineCheckboxClicked) {
				var checked = $(this).prop("checked");
				self.fontUnderlineCheckboxClicked(checked);
			}
		});

		$("#inspector-button-apply-all").click(function() {
			if (self.applyStylesToChildrenButtonClicked) {
				self.applyStylesToChildrenButtonClicked();
			}
		});
	};
};

mindmaps.InspectorPresenter = function(eventBus, appModel, view) {
	var self = this;
	// TODO save selected node in central place, probably appmodel
	var selectedNode = null;

	view.fontSizeDecreaseButtonClicked = function() {
		appModel.decreaseNodeFontSize(selectedNode);
	};

	view.fontSizeIncreaseButtonClicked = function() {
		appModel.increaseNodeFontSize(selectedNode);
	};

	view.fontBoldCheckboxClicked = function(checked) {
		console.log(checked);
		appModel.setNodeFontWeight(selectedNode, checked);
	};

	view.fontItalicCheckboxClicked = function(checked) {
		console.log(checked);
		appModel.setNodeFontStyle(selectedNode, checked);
	};

	view.fontUnderlineCheckboxClicked = function(checked) {
		console.log(checked);
		appModel.setNodeFontDecoration(selectedNode, checked);
	};

	eventBus.subscribe(mindmaps.Event.NODE_DELETED, function() {
	});

	eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function(node) {
		selectedNode = node;
		updateView();
	});

	function updateView() {
		// TODO set button checked states
	}

	this.go = function() {
		view.init();
	};
};