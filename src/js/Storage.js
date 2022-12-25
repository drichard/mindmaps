// TODO store a wrapper object with doc title, modified date and document as string in localstorage.
// in open document window show wrapper object and only parse document on demand.
// when many large documents are stored in LS, opening of window takes a rather long time
mindmaps.LocalStorage = (function () {
    return {
        put: function (key, value) {
            localStorage.setItem(key, value);
        },
        get: function (key) {
            return localStorage.getItem(key);
        },
        clear: function () {
            localStorage.clear();
        }
    };
})();

mindmaps.SessionStorage = (function () {
    return {
        put: function (key, value) {
            sessionStorage.setItem(key, value);
        },
        get: function (key) {
            return sessionStorage.getItem(key);
        },
        clear: function () {
            sessionStorage.clear();
        }
    };
})();

/**
 * @namespace
 */
mindmaps.LocalDocumentStorage = (function () {
    var prefix = "mindmaps.document.";

    var getDocumentByKey = function (key) {
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
        saveDocument: function (doc) {
            //try {
                localStorage.setItem(prefix + doc.id, doc.serialize());
                return true;
//            } catch (error) {
//                // QUOTA_EXCEEDED
//                console.error("Error while saving document to local storage",
//                    error);
//                return false;
//            }
        },

        /**
         * Loads a document from the local storage.
         *
         * @param {String} docId
         *
         * @returns {mindmaps.Document} the document or null if not found.
         */
        loadDocument: function (docId) {
            return getDocumentByKey(prefix + docId);
        },

        /**
         * Finds all documents in the local storage object.
         *
         * @returns {Array} an Array of documents
         */
        getDocuments: function () {
            var documents = [];
            // search localstorage for saved documents
            for (var i = 0, max = localStorage.length; i < max; i++) {
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
        getDocumentIds: function () {
            var ids = [];
            // search localstorage for saved documents
            for (var i = 0, max = localStorage.length; i < max; i++) {
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
        deleteDocument: function (doc) {
            localStorage.removeItem(prefix + doc.id);
        },

        /**
         * Deletes all documents from the local storage.
         */
        deleteAllDocuments: function () {
            this.getDocuments().forEach(this.deleteDocument);
        }
    };
})();

/**
 * @namespace
 */
mindmaps.ServerStorage = (function () {
var prefixServerUrls = "mindmaps.serverurl.";
    /**
     * Public API
     * @scope mindmaps.ServerStorage
     */
    return {
        /**
         * Saves a document to the storage server via POST request.
         *
         * @param {mindmaps.Document} doc
         *
         * @returns {Boolean} true if save was successful, false otherwise.
         */
        saveDocument: function (doc, callbacks) {
            var data = doc.serialize(); // TODO: Remove after testing.
            var json = doc.toJSON();
            callbacks.start();
			
            $.ajax({
                type: "POST",
                url: mindmaps.Config.MindMapAddress,
                data: { content: data, title: json.title, id: json.id}
            }).done(function (key) {
					//console.log(prefixServerUrls + json.id + ": " + key + "." + new Date().getTime());
					mindmaps.currentMapId = 'mm' + $.trim(key);
					window.location.hash = 'm:mm' + $.trim(key);
					mindmaps.isMapLoadingConfirmationRequired = false;
					mindmaps.ignoreHashChange = true;
					console.log("is false");
					mindmaps.LocalStorage.put(prefixServerUrls + json.id, $.trim(key) + "." + new Date().getTime() + "." + json.title);
					
					console.log('shortening ' + window.location);
					mindmaps.fireShortener(window.location);
/*				
					for (var i = 0, max = localStorage.length; i < max; i++) {
						var key = localStorage.key(i);
						// value is a document if key confirms to prefix
						if (key.indexOf(prefixServerUrls) == 0) {
							console.log("got it : " + localStorage.getItem(key));
						}
					}
*/					//this.hideStorageServerLoading();
                    callbacks.success();
                }).fail(function (err) {
				if (err.status == 413) 
                    callbacks.error(413);
				else
					callbacks.error(1);
                });
        },

        /**
         * Loads a document from the storage server.
         *
         * @returns {mindmaps.Document} the document or null if not found.
         */
		 //************** NOT USED
        loadDocument: function (callbacks) {
            callbacks.start();

            $.ajax({
                type: "GET",
                url: mindmaps.Config.MindMapAddress
            }).done(function (json) {
                    var doc = mindmaps.Document.fromJSON(json);
                    callbacks.success(doc);
                }).fail(function () {
                    callbacks.error();
                });
        },

        getDocuments: function (callbacks) {
            callbacks.start();
			
			var documents = [];
					for (var i = 0, max = localStorage.length; i < max; i++) {
						var key = localStorage.key(i);
						// value is a document if key confirms to prefix
						if (key.indexOf(prefixServerUrls) == 0) {
						
							var item = localStorage.getItem(key);
							
							var id = key.substring(key.indexOf(prefixServerUrls) + prefixServerUrls.length);
							var keyUrl = item.substring(0,item.indexOf('.'));
							
						
							var restitem = item.substring(item.indexOf('.')+1);
							
							var itemDate = restitem.substring(0,restitem.indexOf('.'));
							var itemTitle = restitem.substring(restitem.indexOf('.')+1);
							
							var doc = { "id":id, "url":keyUrl, "dates":itemDate, "title":itemTitle }
							
							documents.push(doc);
							
							//console.log(key.substring(key.indexOf(prefixServerUrls) + prefixServerUrls.length) + "  Key:" + keyUrl + " Date:" + itemDate + " Title:" + itemTitle);
							

						}
					}
					
					//for(i=0;i<documents.length;i++)
						//console.log("Id: " + documents[i].id + "  Key:" + documents[i].url + " Date:" + documents[i].date + " Title:" + documents[i].title);
					
					callbacks.success(documents);
			/*
			var documents = [];
            // search localstorage for saved documents
            for (var i = 0, max = localStorage.length; i < max; i++) {
                var key = localStorage.key(i);
                // value is a document if key confirms to prefix
                if (key.indexOf(prefix) == 0) {
                    var doc = getDocumentByKey(key);
                    if (doc) {
                        documents.push(doc);
                    }
                }
            }
		
			
            $.ajax({
                type: "GET",
                url: mindmaps.Config.MindMapListAddress
            }).done(function (json) {
				console.log(json);
                    
					var re = _.chain(json.docs).map(function (v) {
                        return mindmaps.Document.fromJSON(v)
                    }).value()
                    callbacks.success(re);
					
                }).fail(function () {
                    callbacks.error();
                });
				*/
        },


		//************** NOT USED - Storage documents are read only
        deleteDocument: function (doc,callbacks) {
        callbacks.start();
        $.ajax({
            type: "DELETE",
            url: mindmaps.Config.MindMapAddress+"/"+doc.id
        }).done(function (json) {
                callbacks.success();
            }).fail(function () {
                callbacks.error();
            });
    },
    };
})();
