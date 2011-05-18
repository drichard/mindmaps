// TODO save to hdd

mindmaps.LocalStorage = (function() {
	return {
		clear : function() {
			localStorage.clear();
		}
	};
})();

mindmaps.LocalDocumentStorage = (function() {
	var prefix = "mindmaps.document.";

	var getDocumentByKey = function(key) {
		var json = localStorage.getItem(key);
		return json ? mindmaps.Document.fromJSON(json) : null;
	};

	// public API
	return {
		/**
		 * Saves a document to the localstorage. Overwrites the old document if
		 * one with the same id exists.
		 * 
		 * TODO catch errors (quota exceeded..)
		 */
		saveDocument : function(doc) {
			// update modified date
			doc.dates.modified = new Date();
			localStorage.setItem(prefix + doc.id, doc.serialize());
			return doc;
		},

		/**
		 * Loads a documents from the localstorage.
		 * 
		 * @returns the document or null if not found.
		 */
		loadDocument : function(docId) {
			return getDocumentByKey(prefix + docId);
		},

		/**
		 * Gets all documents found in the local storage object.
		 * 
		 * @returns an Array of documents
		 */
		getDocuments : function() {
			var documents = [];
			// search localstorage for saved documents
			for ( var i = 0, max = localStorage.length; i < max; i++) {
				var key = localStorage.key(i);
				// value is a document if key confirms to prefix
				if (key.indexOf(prefix) == 0) {
					documents.push(getDocumentByKey(key));
				}
			}
			return documents;
		},

		/**
		 * Deletes a document from the local storage.
		 */
		deleteDocument : function(doc) {
			localStorage.removeItem(prefix + doc.id);
		},

		/**
		 * Deletes all documents from the local storage.
		 */
		deleteAllDocuments : function() {
			_.each(this.getDocuments(), this.deleteDocument);
		}
	};
})();
