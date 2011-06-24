describe("Point", function() {
	var point;
	beforeEach(function() {
		point = new mindmaps.Point(4, 2);
	});

	it("should set the x and y coordinates", function() {
		expect(point.x).toBe(4);
		expect(point.y).toBe(2);
	});

	it("should initialize to zero by default", function() {
		var p = new mindmaps.Point();
		expect(p.x).toBe(0);
		expect(p.y).toBe(0);
	});

	it("should create a new point instance from object", function() {
		var o = {
			x : 16,
			y : 0
		};
		var fromObj = mindmaps.Point.fromObject(o);
		expect(fromObj instanceof mindmaps.Point).toBeTruthy();
		expect(fromObj.x).toBe(16);
		expect(fromObj.y).toBe(0);
	});

	it("should clone a point object correctly", function() {
		var clone = point.clone();
		expect(point).toEqual(clone);
	});

	it("should add points correctly", function() {
		var point2 = new mindmaps.Point(-4, -2);
		point.add(point2);
		expect(point.x).toBe(0);
		expect(point.y).toBe(0);
	});
});

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

	it("is should return the values", function() {
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
});
