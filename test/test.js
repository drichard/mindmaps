module("nodemap");
test("nodeset operations", function() {
	var ns = new NodeMap();
	var x = new Node();
	var y = new Node();
	
	var add = ns.add(x);
	ok(add, "node added");
	equal(ns.count, 1, "count 1");
	
	var add = ns.add(y);
	ok(add, "node added");
	equal(ns.count, 2, "count 2");
	
	var remove = ns.remove(y);
	ok(remove, "node removed");
	equal(ns.count, 1, "count 1");
	
	var add = ns.add(y);
	ok(add, "node added");
	equal(ns.count, 2, "count 2");
	
	equal(ns.get(x.id), x, "get x by id");
	
	var values = ns.values();
	equal(values.length, ns.count, "values should equal the amount of nodes");
	
	_.each(values, function(value) {
		ok(value instanceof Node, "values should be nodes");
	});
	
	ns.each(function(node) {
		node.text.caption = "changed";
	});
	equal(x.text.caption, "changed", "text must have changed");
	equal(y.text.caption, "changed", "text must have changed");
});

module("mindmap");

test("create a simple map", function() {
	var mm = new MindMap();
	var root = mm.root;
	ok(root instanceof Node, "root is a node");
	ok(root.isRoot(), "root is root");
	ok(root.isLeaf(), "root is also a leaf");
	equal(mm.nodes.size(), 1, "1 node in node set");
	
	var x = mm.createNode();
	ok (x, "node x created");
	equal(mm.nodes.size(), 2, "2 node in node set");
	
	var y = mm.createNode();
	ok (y, "node y created");
	equal(mm.nodes.size(), 3, "3 nodes in node set");
	
	root.addChild(x);
	equal(x.parentId, root.id, "child's parentId is right");
	
	x.addChild(y);
	ok(y.isLeaf(), "y should be leaf");
	ok(!(x.isLeaf()), "x should not be a leaf");
	
	var y1 = mm.createNode();
	x.addChild(y1);
	equals(x.getChildren(false).length, 2, "x should have two children");

	mm.removeNode(x);
	equal(mm.nodes.size(), 1, "1 nodes in set");
	
});

