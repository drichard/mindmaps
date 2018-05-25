/**
 * Class for interaction with the filepicker API. Provides open and save
 * from/to cloud storages.
 *
 * @constructor
 */
mindmaps.FilePicker = function(eventBus, mindmapModel) {

  // filepicker is not defined when we are offline
  if (window.filepicker) {
    var filepicker = window.filepicker;
    filepicker.setKey('P9tQ4bicRwyIe8ZUsny5');
  }

  var mimetype = "application/json";

  /**
   * Shows the open dialog and tries to open a mindmap.
   */
  this.open = function(options) {
    options = options || {};

    if (!filepicker || !navigator.onLine) {
      options.error && options.error("Cannot access cloud, it appears you are offline.");
      return;
    }

    // load callback
    options.load && options.load();

    function onSuccess(blob) {
      // load mindmap
      $.ajax({
        url: blob.url, 
        success: function(data) {

          try {
            // convert to object first if response is a string
            if (Object.prototype.toString.call(data) == '[object String]') {
              data = JSON.parse(data);
            }

            var doc = mindmaps.Document.fromObject(data);
          } catch (e) {
            eventBus.publish(mindmaps.Event.NOTIFICATION_ERROR, 'File is not a valid mind map!');
            throw new Error('Error while parsing map from cloud', e);
          }

          mindmapModel.setDocument(doc);

          // execute callback
          if (options.success) {
            options.success(doc);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (options.error) {
            options.error("Error: Could not open mind map!");
          }
          throw new Error('Error while loading map from filepicker. ' + textStatus + ' ' + errorThrown);
        }
      });
    }

    function onError(e) {
      if (e.code === 101) {
        // 101 - The user closed the dialog without picking a file.
        options.cancel && options.cancel();
      } else {
        throw new Error(e);
      }
    }

    filepicker.pick({
      mimetype: mimetype,
      container: 'modal',
      openTo: 'DROPBOX',
      services: ['COMPUTER', 'GOOGLE_DRIVE', 'DROPBOX', 'BOX', 'SKYDRIVE']
    }, onSuccess, onError);
  };

  /**
   * Shows the save dialog where the user can save the current mindmap.
   */
  this.save = function(options) {
    options = options || {};

    if (!filepicker || !navigator.onLine) {
      options.error && options.error("Cannot access cloud, it appears you are offline.");
      return;
    }

    // load callback
    options.load && options.load();

    var doc = mindmapModel.getDocument().prepareSave();
    var data = doc.serialize();

    function onSuccess(blob) {
      eventBus.publish(mindmaps.Event.DOCUMENT_SAVED, doc);

      if (options.success) {
        options.success();
      }
    }

    function onError(e) {
      if (e.code === 131) {
        // 131 - The user closed the save dialog without picking a file.
        options.cancel && options.cancel();
      } else {
        throw new Error(e);
      }
    }

    var blob = new Blob([data], {type: 'application/json'});

    filepicker.store(blob, function (storedBlob) {
      filepicker.exportFile(storedBlob.url, {
        mimetype: mimetype,
        suggestedFilename: doc.title,
        container: 'modal',
        openTo: 'DROPBOX',
        services: ['DROPBOX', 'BOX', 'SKYDRIVE', 'GOOGLE_DRIVE']
      }, onSuccess, onError);
    });
  }
}
