describe("MindMap", function() {
  var mindmap;

  beforeEach(function() {
    mindmap = new mindmaps.MindMap;
  });

  it("should initialize with a root node", function() {
    expect(mindmap.getRoot()).toBeANode();
    expect(mindmap.getRoot().isRoot()).toBeTruthy();
  });

  it("should create a node and add to nodemap", function() {
    var node = mindmap.createNode();
    expect(node).toBeANode();
    expect(mindmap.nodes.size()).toBe(2);
    expect(mindmap.nodes.get(node.id)).toBe(node);
  });

  it("should add a node to nodemap", function() {
    var n1 = new mindmaps.Node;
    var n11 = new mindmaps.Node;
    n1.addChild(n11);
    mindmap.getRoot().addChild(n1);
    mindmap.addNode(n1);

    expect(mindmap.nodes.get(n1.id)).not.toBeUndefined();
    expect(mindmap.nodes.get(n11.id)).not.toBeUndefined();
  });

  it("should remove a node", function() {
    var root = mindmap.getRoot();
    var node = mindmap.createNode();
    root.addChild(node);

    mindmap.removeNode(node);
    expect(root.isLeaf()).toBeTruthy();
    expect(node.getParent()).toBeNull();
    expect(mindmap.nodes.size()).toBe(1);
  });

  it("should serialize and restore", function() {
    var root = mindmap.getRoot();
    root.setCaption("HOWDY");
    var n1 = mindmap.createNode();
    var n11 = mindmap.createNode();

    root.addChild(n1);
    n1.addChild(n11);

    var json = mindmap.serialize();
    var restored = mindmaps.MindMap.fromJSON(json);

    expect(restored instanceof mindmaps.MindMap).toBeTruthy();
    expect(mindmap.nodes.size()).toEqual(restored.nodes.size());
    expect(restored.getRoot()).toEqual(mindmap.getRoot());
  });
});
