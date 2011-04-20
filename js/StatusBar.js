var StatusBarView = function() {
	MicroEvent.mixin(StatusBarView);
	this.$statusbar = $("#statusbar");
};

var StatusBarPresenter = function(view) {
	this.view = view;
};
