describe("Document", function() {
  var doc;
  
  beforeEach(function() {
    doc = new mindmaps.Document();
  });

  it("should get a unique id", function() {
    var doc2 = new mindmaps.Document;
    expect(doc2.id).not.toEqual(doc.id);
  });

  it("should set the created date to now", function() {
    var before = Date.now();
    var date = new mindmaps.Document().getCreatedDate().getTime();
    var after = Date.now();

    var beforeOrSame = before <= date;
    var afterOrSame = after >= date ;

    expect(beforeOrSame && afterOrSame).toBeTruthy();
  });
  
  it("should be new the first time", function() {
    expect(doc.isNew()).toBeTruthy();
  });
  
  it("should serialize and restore", function() {
    doc.mindmap = getDefaultTestMap();
    var json = doc.serialize();
    var restored = mindmaps.Document.fromJSON(json);
    
    expect(restored instanceof mindmaps.Document).toBeTruthy();
    expect(restored).toEqual(doc);
  });

  it("should set and remember autosave", function() {
    doc.setAutoSave(true);
    var json = doc.serialize();
    var restored = mindmaps.Document.fromJSON(json);
    expect(restored.isAutoSave()).toBeTruthy();
  });
});
