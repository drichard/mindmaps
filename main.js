/**
 * 
 */

var x = function() {
	return {
		down : function() {
			this.direction = "DOWN";
		}
	};
};

x.left = function() {
	this.direction = "LEFT";
};

x.right = function() {
	this.direction = "RIGHT";
};

x.prototype.top = function() {
	this.direction = "TOP";
};
