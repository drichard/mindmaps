// create namespace
var mindmaps = {};

beforeEach(function() {
	this.addMatchers({
		toBeANode : function() {
			return this.actual instanceof mindmaps.Node;
		}
	});
});


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
	var mm = new mindmaps.MindMap();
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
