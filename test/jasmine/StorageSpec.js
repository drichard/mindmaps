describe("LocalStorage", function() {
  var lds;
  beforeEach(function() {
    // clear storage
    mindmaps.LocalStorage.clear();
    lds = mindmaps.LocalDocumentStorage;
  });
  
  it("should save a document", function() {
    var saved = lds.saveDocument(new mindmaps.Document());
    expect(saved).toBeTruthy();
    expect(window.localStorage.length).toBeGreaterThan(0);
  });
  
  it("should return null if document was not found", function() {
    var loaded = lds.loadDocument(new mindmaps.Document);
    expect(loaded).toBeNull();
  });

  describe("when a document was saved", function() {
    var doc;
    beforeEach(function() {
      doc = new mindmaps.Document;
      lds.saveDocument(doc);
    });

    it("should be possible to load it via its ID", function() {
      var loaded = lds.loadDocument(doc.id);
      expect(loaded).toEqual(doc);
    });
    
    it("should appear in the list of documents", function() {
      var docs = lds.getDocuments();
      expect(docs).toContain(doc);
    });
    
    it("its ID should appear in the list document ids", function() {
      var ids = lds.getDocumentIds();
      expect(ids).toContain(doc.id);
    });
    
    it("should be possible to delete the document", function() {
      lds.deleteDocument(doc);
      expect(lds.loadDocument(doc.id)).toBeNull();
    });
    
    it("should be deleted when all documents are deleted", function() {
      lds.deleteAllDocuments();
      expect(lds.loadDocument(doc.id)).toBeNull();
    });
    
    
    it("should be possible to override the old document", function() {
      doc.title = "overridden title";
      lds.saveDocument(doc);
      var loaded = lds.loadDocument(doc.id);
      expect(loaded.title).toEqual("overridden title");
    });
  });

});
