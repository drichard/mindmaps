/**
 * Class for interaction with the filepicker API. Provides open and save
 * from/to cloud storages.
 *
 * @constructor
 */
mindmaps.FilePicker = function(eventBus, mindmapModel) {
  var filepicker = window.filepicker;
  filepicker.setKey('P9tQ4bicRwyIe8ZUsny5');

  var mimetype = "text/plain";

  var openOptions = {
    modal: true,
    services: ["Dropbox", "Box", "URL" ]
  };

  var saveOptions = {
    modal: true,
    services: ["Dropbox", "Box" ]
  };

  var currentFileHandle = null;


  /**
   * Shows the open dialog and tries to open a mindmap.
   */
  this.open = function(options) {
    options = options || {};

    filepicker.getFile(mimetype, openOptions, function(url, data) {
      var filename = data.filename

      // load mindmap
      $.ajax({
        url: url, 
        success: function(data) {
          currentFileHandle = url;

          // TODO error handling
          // try/catch
          var doc = mindmaps.Document.fromJSON(data);
          mindmapModel.setDocument(doc);

          // execute callback
          if (options.success) {
            options.success(doc);
          }
        },
        error: function() {
          if (options.error) {
            options.error();
          }
        }
      });
    });
  };

  /**
   * Shows the save dialog where the user can save the current mindmap. Skips
   * the dialog and saves directly when options.saveAs = true is passed and
   * a cloud storage file is currently open.
   */
  this.save = function(options) {
    options = options || {};

    var doc = mindmapModel.getDocument();
    var data = doc.prepareSave().serialize()

    var success = function(url) {
      currentFileHandle = url

      console.log('saved to', url);
      eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);

      if (options.success) {
        options.success();
      }
    };

    var error = function() {
    };

    if (!options.saveAs && currentFileHandle) {
      $.ajax({
        type: 'POST',
        url: currentFileHandle,
        data: data, 
        contentType: mimetype,
        success: success,
        error: error
      });
    } else {
      filepicker.getUrlFromData(data, function(dataUrl) {
        filepicker.saveAs(dataUrl, mimetype, saveOptions, success);
      });
    }
  };
}
