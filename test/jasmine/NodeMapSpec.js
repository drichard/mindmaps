describe("NodeMap", function() {
  var map, node;

  beforeEach(function() {
    map = new mindmaps.NodeMap;
    node = new mindmaps.Node;
  });

  it("should add a node", function() {
    var added = map.add(node);

    expect(added).toBeTruthy();
    expect(map.size()).toBe(1);
  });

  it("should not add the same node twice", function() {
    map.add(node);
    var added = map.add(node);

    expect(added).toBeFalsy();
  });

  it("should add 100 nodes and contain 100 nodes", function() {
    // sanity check to make sure adding works
    for ( var i = 0; i < 100; i++) {
      // force unique id
      var n = new mindmaps.Node;
      n.id = i;
      map.add(n);
    }

    expect(map.size()).toBe(100);
  });

  it("should remove a node", function() {
    map.add(node);
    var removed = map.remove(node);

    expect(removed).toBeTruthy();
    expect(map.size()).toBe(0);
  });

  it("should do nothing if a node is to be removed that doesn't belong",
      function() {
        var other = new mindmaps.Node;
        map.remove(other);
        expect(map.size()).toBe(0);
      });

  it("should get nodes by id", function() {
    map.add(node);
    var got = map.get(node.id);
    expect(got).toBe(node);

    // try to get node not in the map
    var other = new mindmaps.Node;
    var got2 = map.get(other);
    expect(got2).toBeUndefined();
  });

  it("should return the values", function() {
    var node2 = new mindmaps.Node;
    map.add(node);
    map.add(node2);

    var values = map.values();

    // is array?
    expect(Array.isArray(values)).toBeTruthy();
    expect(values.length).toEqual(2);

    // values should be nodes
    values.forEach(function(value) {
      expect(value).toBeANode();
    });

    // try to find nodes in the array
    var foundNode = values[0] === node || values[1] === node;
    var foundNode2 = values[0] === node2 || values[1] === node2;
    expect(foundNode).toBeTruthy();
    expect(foundNode2).toBeTruthy();
  });

  it("should iterate over all nodes", function() {
    var node2 = new mindmaps.Node;
    map.add(node);
    map.add(node2);

    var newCaption = "CHANGED";
    map.each(function(node) {
      node.setCaption(newCaption);
    });

    expect(node.getCaption()).toEqual(newCaption);
    expect(node2.getCaption()).toEqual(newCaption);
  });
});
