// create namespace
var mindmaps = {};

beforeEach(function() {
  this.addMatchers({
    toBeANode : function() {
      return this.actual instanceof mindmaps.Node;
    }
  });
});

var noOp = function() {
};

