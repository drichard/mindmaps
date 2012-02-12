/**
 * Unused for now.
 * 
 * @constructor
 */
mindmaps.NewDocumentView = function() {

};

/**
 * Creates a new NewDocumentPresenter. This presenter has no view associated
 * with it for now. It simply creates a new document. It could in the future
 * display a dialog where the user could chose options like document title and
 * such.
 * 
 * @constructor
 */
mindmaps.NewDocumentPresenter = function(eventBus, mindmapModel, view) {

  this.go = function() {
    var doc = new mindmaps.Document();
    mindmapModel.setDocument(doc);
  };
};
