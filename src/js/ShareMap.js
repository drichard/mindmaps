mindmaps.ShareMapView = function () {
    var self = this;

    // create dialog
    var $dialog = $("#template-share").tmpl().dialog({
        autoOpen: false,
        modal: true,
        zIndex: 5000,
        width: 550,
        close: function () {
            $(this).dialog("destroy");
            $(this).remove();
        }
    });
	
	
	/**
     * Shows the dialog.
     *
     * @param {mindmaps.Document[]} docs
     */
    this.showShareMapDialog = function (title) {
	
	//var doc = mindmaps.getDocument();
		var docTitle = encodeURIComponent(title);
		var url = encodeURIComponent(mindmaps.Config.BaseUrl + '#m:' + mindmaps.currentMapId);

			$("#share-button-facebook").attr("href", 'https://www.facebook.com/dialog/feed?app_id=11111111&' + //Change app_id with your app id
					'link=' + url + '&' +
					'name=' + docTitle + '&' +
					'caption=' + encodeURIComponent('Mind map from mindmapmaker.org') + '&' +
					'picture=' + encodeURIComponent('http://mindmapmaker.org/mind-map-maker.png') + '&' + //change mindmapmaker.org with your website
					'description=' + docTitle + '&' +
					'redirect_uri=' + encodeURIComponent('https://app.mindmapmaker.org')); ////change app.mindmapmaker.org with your website
			
			$("#share-button-twitter").attr('href', 'https://twitter.com/intent/tweet?text=' + docTitle +
					'&url=' + url +
					'&source=mindmapmaker.org&related=mindmapsapp&via=mindmapsapp');
					
			
			$("#share-button-google").attr('href', 'https://plus.google.com/share?url=' + url);
			
			$("#share-map-permanent-url").val(mindmaps.Config.BaseUrl + '#m:' + mindmaps.currentMapId);
			
			$("#share-map-short-url").val(mindmaps.currentShortUrl);
			if(mindmaps.currentShortUrl == 'Network Error')
				$("#share-map-short-url").css("color","red");
			else
				$("#share-map-short-url").css("color","black");
			
			$('#share-map-permanent-url').click(function() {
				$(this).select(); 
			});
			
			$('#share-map-short-url').click(function() {
				$(this).select(); 
			});

		
        $dialog.dialog("open");
    };

    /**
     * Hides the dialog.
     */
    this.hideShareMapDialog = function () {
        $dialog.dialog("close");
    };
};

/**
 * Creates a new ShareDocumentPresenter. 
 *
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.OpenDocumentView} view
 * @param {mindmaps.FilePicker} filePicker
 */
mindmaps.ShareMapPresenter = function (view, mindmapModel) {

 /**
     * Initialize.
     */
    this.go = function () {
	/*
		 var $openStorageServerButton = $("#button-open-storageserver").button().click(function () {
			if (self.openStorageServerButtonClicked) {
				self.openStorageServerButtonClicked();
			}
		});
		
		$("a.mylink").attr("href", "http://cupcream.com"); */
		
		view.showShareMapDialog(mindmapModel.getDocument().title);
     };
};