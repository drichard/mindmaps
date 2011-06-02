// Use ECMA5 strict mode. see: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// first file to load
var mindmaps = mindmaps || {};

// start up
$(function() {
	var appController = new mindmaps.ApplicationController();
	appController.init();
	appController.go();
});