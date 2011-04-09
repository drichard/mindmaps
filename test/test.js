/**
 * <pre>
 * 		    r
 *    /     |        \
 *   0		1		  2
 * 		   / \     / | \  \
 *    	  10  11  20 21 22 23
 *        |
 *        100
 *        |
 *        1000
 * </pre>
 */
function getDefaultTestMap() {
	var mm = new MindMap();
	var root = mm.root;
	
	var n0 = mm.createNode();
	var n1 = mm.createNode();
	var n2 = mm.createNode();
	root.addChild(n0);
	root.addChild(n1);
	root.addChild(n2);
	
	var n10 = mm.createNode();
	var n11 = mm.createNode();
	n1.addChild(n10);
	n1.addChild(n11);
	
	var n20 = mm.createNode();
	var n21 = mm.createNode();
	var n22 = mm.createNode();
	var n23 = mm.createNode();
	n2.addChild(n20);
	n2.addChild(n21);
	n2.addChild(n22);
	n2.addChild(n23);
	
	var n100 = mm.createNode();
	n10.addChild(n100);
	
	var n1000 = mm.createNode();
	n100.addChild(n1000);
	
	return mm;
}

module("models");
test("node - basic operations", function() {
	var x = new Node();
	var y0 = new Node();
	var y1 = new Node();
	var z0 = new Node();
	var z1 = new Node();
	var z2 = new Node();
	
	x.addChild(y0);
	x.addChild(y1);
	y0.addChild(z0);
	y0.addChild(z1);
	y0.addChild(z2);
	
	ok(x.isRoot(), "x should be root");
	ok(z2.isLeaf(), "z2 should be leaf");
	notStrictEqual(y0.isRoot(), true, "y0 is not a root");
	notStrictEqual(y0.isLeaf(), true, "y0 is not a leaf");
	
	equal(x.getChildren(false).length, 2, "x should have two direct children");
	equal(x.getChildren(true).length, 5, "x should have 5 children");
	
	
	x.forEachChild(function(node) {
		node.edgeColor = "yellow";
	});
	equal(y0.edgeColor, "yellow");
	equal(y1.edgeColor, "yellow");
	notEqual(z0.edgeColor, "yellow");
	
	x.forEachDescendant(function(node) {
		node.edgeColor = "green";
	});
	equal(y0.edgeColor, "green");
	equal(y1.edgeColor, "green");
	equal(z0.edgeColor, "green");
	equal(z1.edgeColor, "green");
	equal(z2.edgeColor, "green");
	
	
	x.removeChild(y0);
	ok(y0.isRoot(), "y0 is root now");
	x.removeChild(y1);
	ok(x.isLeaf());
	ok(y1.isRoot());
});

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

test("serialization", function() {
	console.log('saf');
	var map = getDefaultTestMap();
	var mapStr = JSON.stringify(map.root);
	ok(mapStr);
	console.log(mapStr);
});
