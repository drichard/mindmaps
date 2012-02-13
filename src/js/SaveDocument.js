/**
 * Creates a new SaveDocumentView. This view renders a dialog where the user can
 * save the mind map.
 * 
 * @constructor
 */
mindmaps.SaveDocumentView = function() {
  var self = this;

  var $dialog = $("#template-save").tmpl().dialog({
    autoOpen : false,
    modal : true,
    zIndex : 5000,
    width : 550,
    close : function() {
      // remove dialog from DOM
      $(this).dialog("destroy");
      $(this).remove();
    }
  });

  var $localSorageButton = $("#button-save-localstorage").button().click(
      function() {
        if (self.localStorageButtonClicked) {
          self.localStorageButtonClicked();
        }
      });

  var $autoSaveCheckbox = $("#checkbox-autosave-localstorage").click(
      function() {
        if (self.autoSaveCheckboxClicked) {
          self.autoSaveCheckboxClicked($(this).prop("checked"));
        }
      });

  var $hddSaveButton = $("#button-save-hdd").button().downloadify({
    filename : function() {
      if (self.fileNameRequested) {
        return self.fileNameRequested();
      }
    },
    data : function() {
      if (self.fileContentsRequested) {
        return self.fileContentsRequested();
      }
    },
    onComplete : function() {
      if (self.saveToHddComplete) {
        self.saveToHddComplete();
      }
    },
    onError : function() {
      console.log("error while saving to hdd");
    },
    swf : 'media/downloadify.swf',
    downloadImage : 'img/transparent.png',
    width : 65,
    height : 29,
    append : true
  });

  this.setAutoSaveCheckboxState = function(checked) {
    $autoSaveCheckbox.prop("checked", checked);
  }

  this.showSaveDialog = function() {
    $dialog.dialog("open");
  };

  this.hideSaveDialog = function() {
    $dialog.dialog("close");
  };
};

/**
 * Creates a new SaveDocumentPresenter. The presenter can store documents in the
 * local storage or to a hard disk.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.SaveDocumentView} view
 * @param {mindmaps.AutoSaveController} autosaveController
 */
mindmaps.SaveDocumentPresenter = function(eventBus, mindmapModel, view, autosaveController) {
  /**
   * View callback when local storage button was clicked. Saves the document
   * in the local storage.
   * 
   * @ignore
   */
  view.localStorageButtonClicked = function() {
    var success = mindmapModel.saveToLocalStorage();
    if (success) {
      view.hideSaveDialog();
    } else {
      // TODO display error hint
    }
  };


  /**
   * View callback: Enables or disables the autosave function for localstorage.
   *
   * @ignore
   */
  view.autoSaveCheckboxClicked = function(checked) {
    if (checked) {
      autosaveController.enable();
    } else {
      autosaveController.disable();
    }
  }

  /**
   * View callback: Returns the filename for the document for saving on hard
   * drive.
   * 
   * @ignore
   * @returns {String}
   */
  view.fileNameRequested = function() {
    return mindmapModel.getMindMap().getRoot().getCaption() + ".json";
  };

  /**
   * View callback: Returns the serialized document.
   * 
   * @ignore
   * @returns {String}
   */
  view.fileContentsRequested = function() {
    var doc = mindmapModel.getDocument();
    doc.dates.modified = new Date();
    return doc.serialize();
  };

  /**
   * View callback: Saving to the hard drive was sucessful.
   * 
   * @ignore
   */
  view.saveToHddComplete = function() {
    var doc = mindmapModel.getDocument();
    eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);
    view.hideSaveDialog();
  };

  this.go = function() {
    view.setAutoSaveCheckboxState(autosaveController.isEnabled());
    view.showSaveDialog();
  };
};
