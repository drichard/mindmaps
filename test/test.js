var mindmaps = {};

module("models");
test("node - basic operations", function() {
	var x = new mindmaps.Node();
	var y0 = new mindmaps.Node();
	var y1 = new mindmaps.Node();
	var z0 = new mindmaps.Node();
	var z1 = new mindmaps.Node();
	var z2 = new mindmaps.Node();

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
		node.branchColor = "yellow";
	});
	equal(y0.branchColor, "yellow");
	equal(y1.branchColor, "yellow");
	notEqual(z0.branchColor, "yellow");

	x.forEachDescendant(function(node) {
		node.branchColor = "green";
	});
	equal(y0.branchColor, "green");
	equal(y1.branchColor, "green");
	equal(z0.branchColor, "green");
	equal(z1.branchColor, "green");
	equal(z2.branchColor, "green");

	// test root
	equal(z2.getRoot().id, x.id);
	equal(x.getRoot().id, x.id);

	x.removeChild(y0);
	ok(y0.isRoot(), "y0 is root now");
	x.removeChild(y1);
	ok(x.isLeaf());
	ok(y1.isRoot());
});

test("node getPosition", function() {
	var root = new mindmaps.Node();
	root.offset = new mindmaps.Point(100, 100);
	var n1 = new mindmaps.Node();
	n1.offset = new mindmaps.Point(100, 0);
	var n2 = new mindmaps.Node();
	n2.offset = new mindmaps.Point(50, 100);

	root.addChild(n1);
	n1.addChild(n2);

	var pos = n2.getPosition();
	deepEqual(pos, new mindmaps.Point(250, 200));
});

test("nodeset operations", function() {
	var ns = new mindmaps.NodeMap();
	var x = new mindmaps.Node();
	var y = new mindmaps.Node();

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

	values.forEach(function(value) {
		ok(value instanceof mindmaps.Node, "values should be nodes");
	});

	ns.each(function(node) {
		node.text.caption = "changed";
	});
	equal(x.text.caption, "changed", "text must have changed");
	equal(y.text.caption, "changed", "text must have changed");
});

test("create a simple map", function() {
	var mm = new mindmaps.MindMap();
	var root = mm.root;
	ok(root instanceof mindmaps.Node, "root is a node");
	ok(root.isRoot(), "root is root");
	ok(root.isLeaf(), "root is also a leaf");
	equal(mm.nodes.size(), 1, "1 node in node set");

	var x = mm.createNode();
	ok(x, "node x created");
	equal(mm.nodes.size(), 2, "2 node in node set");

	var y = mm.createNode();
	ok(y, "node y created");
	equal(mm.nodes.size(), 3, "3 nodes in node set");

	root.addChild(x);
	equal(x.parent.id, root.id, "child's parentId is right");

	x.addChild(y);
	ok(y.isLeaf(), "y should be leaf");
	ok(!(x.isLeaf()), "x should not be a leaf");

	var y1 = mm.createNode();
	x.addChild(y1);
	equals(x.getChildren(false).length, 2, "x should have two children");

	mm.removeNode(x);
	equal(mm.nodes.size(), 1, "1 nodes in set");

});

test("node serialization", function() {
	var root = getDefaultTestMap().root;
	var json = root.serialize();
	var restored = mindmaps.Node.fromJSON(json);

	// test equality
	equal(root.id, restored.id);
	equal(root.parent, restored.parent);
	equal(root.branchColor, restored.branchColor);
	equal(root.children.count, restored.children.count);
	deepEqual(root.offset, restored.offset);
	equal(root.collapseChildren, restored.collapseChildren);

	// test functions
	raises(restored.addChild(new mindmaps.Node()));
});

test("map serialization", function() {
	var mm = getDefaultTestMap();
	var json = mm.serialize();
	var restored = mindmaps.MindMap.fromJSON(json);

	// test equality
	equal(mm.nodes.count, restored.nodes.count,
			"all nodes should be registered");
	equal(mm.root.id, restored.root.id);

	// test functions
	raises(restored.createNode());
});

test("document serialization", function() {
	var doc = new mindmaps.Document();
	doc.mindmap = getDefaultTestMap();

	var json = doc.serialize();
	var restored = mindmaps.Document.fromJSON(json);

	equal(doc.id, restored.id);
	equal(doc.title, restored.title);
	deepEqual(doc.dates, restored.dates);

	// test functions
	ok(restored.mindmap.createNode());
});

test("documents in local storage", function() {
	// clear storage
	mindmaps.LocalDocumentStorage.deleteAllDocuments();

	// store and retrieve document
	var doc = getDefaultTestDocument();
	mindmaps.LocalDocumentStorage.saveDocument(doc);
	var documents = mindmaps.LocalDocumentStorage.getDocuments();
	equal(documents.length, 1, "one document must be in storage");

	var restored = documents[0];
	equal(doc.serialize(), restored.serialize());

	// load document by key
	var restored2 = mindmaps.LocalDocumentStorage.loadDocument(doc.id);
	equal(restored.serialize(), restored2.serialize());

	// restored should overwrite previous copy
	mindmaps.LocalDocumentStorage.saveDocument(restored);
	equal(mindmaps.LocalDocumentStorage.getDocuments().length, 1,
			"one document must be in storage");

	// storage should be empty
	mindmaps.LocalDocumentStorage.deleteDocument(restored);
	equal(mindmaps.LocalDocumentStorage.getDocuments().length, 0,
			"storage must be empty");

	// save three documents
	mindmaps.LocalDocumentStorage.saveDocument(new mindmaps.Document());
	mindmaps.LocalDocumentStorage.saveDocument(new mindmaps.Document());
	mindmaps.LocalDocumentStorage.saveDocument(new mindmaps.Document());
	equal(mindmaps.LocalDocumentStorage.getDocuments().length, 3);

	// remove all documents
	mindmaps.LocalDocumentStorage.deleteAllDocuments();
	equal(mindmaps.LocalDocumentStorage.getDocuments().length, 0);

	var shouldNotExist = mindmaps.LocalDocumentStorage.loadDocument(doc.id);
	ok(shouldNotExist === null);

	// check if modified date gets updated
	var oldModified = new Date(doc.dates.modified);
	mindmaps.LocalDocumentStorage.saveDocument(doc);
	var newModified = doc.dates.modified;
	ok(newModified > oldModified);

	// var hugeDoc = new Document();
	// hugeDoc.mindmap = getBinaryMapWithDepth(10);
	// raises(mindmaps.LocalDocumentStorage.saveDocument(hugeDoc));
	//	
	// var extremDoc = new mindmaps.Document();
	// extremDoc.mindmap = getBinaryMapWithDepth(16);
	// raises(mindmaps.LocalDocumentStorage.saveDocument(extremDoc));
});

function saveToExternalFile() {
	var doc = getDefaultTestDocument();
	var uriContent = "data:application/octet-stream,"
			+ encodeURIComponent(doc.serialize());
	var newWindow = window.open(uriContent, 'new document');

}
