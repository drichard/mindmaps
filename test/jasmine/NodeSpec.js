describe("Node", function() {
  var node, root, n1, n2, n3, n11, n12, n21, n111;

  beforeEach(function() {
    node = new mindmaps.Node;

    // build sample tree
    root = new mindmaps.Node;
    n1 = new mindmaps.Node;
    n2 = new mindmaps.Node;
    n3 = new mindmaps.Node;
    root.addChild(n1);
    root.addChild(n2);
    root.addChild(n3);

    n11 = new mindmaps.Node;
    n12 = new mindmaps.Node;
    n1.addChild(n11);
    n1.addChild(n12);

    n111 = new mindmaps.Node;
    n11.addChild(n111);

    n21 = new mindmaps.Node;
    n2.addChild(n21);
  });

  it("should clone a simple node", function() {
    var clone = node.clone();
    // id should be different
    expect(clone.id).not.toEqual(node.id);

    // but the rest should be the same
    delete node.id;
    delete clone.id;
    expect(clone).toEqual(node);
  });

  it("should add a child", function() {
    var child = new mindmaps.Node;
    node.addChild(child);
    expect(child.getParent()).toBe(node);
    expect(node.children.size()).toBe(1);
  });

  it("should remove a child", function() {
    var child = new mindmaps.Node;
    node.addChild(child);
    node.removeChild(child);
    expect(child.getParent()).not.toBe(node);
    expect(child.isRoot()).toBeTruthy();
    expect(node.children.size()).toBe(0);
  });

  it("should know when it is leaf", function() {
    expect(node.children.size()).toBe(0);
    expect(node.isLeaf()).toBeTruthy();

    node.addChild(new mindmaps.Node);
    expect(node.isLeaf()).toBeFalsy();
  });

  it("should know when it is a root", function() {
    expect(node.children.size()).toBe(0);
    expect(node.isRoot()).toBeTruthy();

    root.addChild(node);
    expect(node.isRoot()).toBeFalsy();
  });

  it("should return the root of a tree", function() {
    expect(root.getRoot()).toBe(root);
    expect(n1.getRoot()).toBe(root);
    expect(n2.getRoot()).toBe(root);
    expect(n3.getRoot()).toBe(root);
  });

  it("should return the position relative to root", function() {
    var root = new mindmaps.Node();
    root.offset = new mindmaps.Point(100, 100);
    var n1 = new mindmaps.Node();
    n1.offset = new mindmaps.Point(100, 0);
    var n2 = new mindmaps.Node();
    n2.offset = new mindmaps.Point(50, 100);

    root.addChild(n1);
    n1.addChild(n2);

    var pos = n2.getPosition();
    expect(pos).toEqual(new mindmaps.Point(250, 200));
  });

  it("should return the depth in a tree", function() {
    expect(root.getDepth()).toBe(0);
    expect(n1.getDepth()).toBe(1);
    expect(n11.getDepth()).toBe(2);
    expect(n111.getDepth()).toBe(3);
  });

  it("should iterate over all children", function() {
    var count = 0;
    var newCaption = "CHANGED";
    root.forEachChild(function(child) {
      count++;
      child.setCaption(newCaption);
    });

    expect(count).toBe(3);
    expect(n1.getCaption()).toEqual(newCaption);
    expect(n2.getCaption()).toEqual(newCaption);
    expect(n3.getCaption()).toEqual(newCaption);
  });

  it("should iterate over all descendants", function() {
    var count = 0;
    var newCaption = "CHANGED";
    root.forEachDescendant(function(child) {
      count++;
      child.setCaption(newCaption);
    });

    expect(count).toBe(7);
    expect(n1.getCaption()).toEqual(newCaption);
    expect(n2.getCaption()).toEqual(newCaption);
    expect(n3.getCaption()).toEqual(newCaption);
    expect(n11.getCaption()).toEqual(newCaption);
    expect(n12.getCaption()).toEqual(newCaption);
    expect(n21.getCaption()).toEqual(newCaption);
  });

  it("should detect if a node is a descendant", function() {
    // n1 should be a descendant but not the other way round
    expect(root.isDescendant(n1)).toBeTruthy();
    expect(n1.isDescendant(root)).not.toBeTruthy();

    // other should be descendant only after added
    var other = new mindmaps.Node;
    expect(root.isDescendant(other)).toBeFalsy();
    n111.addChild(other);
    expect(root.isDescendant(other)).toBeTruthy();
  });

  it("should get serialized and restored correctly", function() {
    var json = root.serialize();
    var restored = mindmaps.Node.fromJSON(json);

    expect(restored).toBeANode();
    expect(restored).toEqual(root);
  });

  it("should have a different id each time", function() {
    // this is not a sufficient test for uniqueness but would point out if
    // all nodes had the same id :-)
    expect(node.id).not.toEqual(root.id);
    expect(n1.id).not.toEqual(n2.id);
  });
});
