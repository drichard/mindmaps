/**
 * 
 * @constructor
 */
mindmaps.ExportMapView = function() {
	var self = this;

	// create dialog
	var $dialog = $("#template-export-map").tmpl().dialog({
		autoOpen : false,
		modal : true,
		zIndex : 5000,
		width : "auto",
		height : "auto",
		close : function() {
			$(this).dialog("destroy");
			$(this).remove();
		},
		open: function() {
			$(this).css({
				"max-width": $(window).width() - 100,
				"max-height": $(window).height() - 100
			});
		}
	});

	/**
	 * Shows the dialog.
	 * 
	 */
	this.showDialog = function() {
		$dialog.dialog("open");
	};

	/**
	 * Hides the dialog.
	 */
	this.hideDialog = function() {
		$dialog.dialog("close");
	};

	this.setImage = function($img) {
		//$("#export-map-dialog .map", $dialog).remove();
		$("#export-preview").html($img);
		//$dialog.dialog("option", "position", "center");
	};
};

/**
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.ExportMapView} view
 */
mindmaps.ExportMapPresenter = function(eventBus, mindmapModel, view) {
	var renderer = new mindmaps.StaticCanvasRenderer();

	this.go = function() {
		var $img = renderer.renderAsPNG(mindmapModel.getDocument());
		view.setImage($img);
		setTimeout(function() {
			view.showDialog();
		});
	};
};