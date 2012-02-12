// TODO store a wrapper object with doc title, modified date and document as string in localstorage.
// in open document window show wrapper object and only parse document on demand.
// when many large documents are stored in LS, opening of window takes a rather long time
mindmaps.LocalStorage = (function() {
  return {
    put : function(key, value) {
      localStorage.setItem(key, value);
    },
    get : function(key) {
      return localStorage.getItem(key);
    },
    clear : function() {
      localStorage.clear();
    }
  };
})();

mindmaps.SessionStorage = (function() {
  return {
    put : function(key, value) {
      sessionStorage.setItem(key, value);
    },
    get : function(key) {
      return sessionStorage.getItem(key);
    },
    clear : function() {
      sessionStorage.clear();
    }
  };
})();

/**
 * @namespace
 */
mindmaps.LocalDocumentStorage = (function() {
  var prefix = "mindmaps.document.";

  var getDocumentByKey = function(key) {
    var json = localStorage.getItem(key);
    if (json === null) {
      return null;
    }

    /**
     * Catch any SytaxErrors when document can't be parsed.
     */
    try {
      return mindmaps.Document.fromJSON(json);
    } catch (error) {
      console.error("Error while loading document from local storage",
          error);
      return null;
    }
  };

  /**
   * Public API
   * @scope mindmaps.LocalDocumentStorage
   */
  return {
    /**
     * Saves a document to the localstorage. Overwrites the old document if
     * one with the same id exists.
     * 
     * @param {mindmaps.Document} doc
     * 
     * @returns {Boolean} true if save was successful, false otherwise.
     */
    saveDocument : function(doc) {
      try {
        localStorage.setItem(prefix + doc.id, doc.serialize());
        return true;
      } catch (error) {
        // QUOTA_EXCEEDED
        console.error("Error while saving document to local storage",
            error);
        return false;
      }
    },

    /**
     * Loads a document from the local storage.
     * 
     * @param {String} docId
     * 
     * @returns {mindmaps.Document} the document or null if not found.
     */
    loadDocument : function(docId) {
      return getDocumentByKey(prefix + docId);
    },

    /**
     * Finds all documents in the local storage object.
     * 
     * @returns {Array} an Array of documents
     */
    getDocuments : function() {
      var documents = [];
      // search localstorage for saved documents
      for ( var i = 0, max = localStorage.length; i < max; i++) {
        var key = localStorage.key(i);
        // value is a document if key confirms to prefix
        if (key.indexOf(prefix) == 0) {
          var doc = getDocumentByKey(key);
          if (doc) {
            documents.push(doc);
          }
        }
      }
      return documents;
    },

    /**
     * Gets all document ids found in the local storage object.
     * 
     * @returns {Array} an Array of document ids
     */
    getDocumentIds : function() {
      var ids = [];
      // search localstorage for saved documents
      for ( var i = 0, max = localStorage.length; i < max; i++) {
        var key = localStorage.key(i);
        // value is a document if key confirms to prefix
        if (key.indexOf(prefix) == 0) {
          ids.push(key.substring(prefix.length));
        }
      }
      return ids;
    },

    /**
     * Deletes a document from the local storage.
     * 
     * @param {mindmaps.Document} doc
     */
    deleteDocument : function(doc) {
      localStorage.removeItem(prefix + doc.id);
    },

    /**
     * Deletes all documents from the local storage.
     */
    deleteAllDocuments : function() {
      this.getDocuments().forEach(this.deleteDocument);
    }
  };
})();
