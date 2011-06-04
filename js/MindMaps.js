// Use ECMA5 strict mode. see: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// first file to load
var mindmaps = mindmaps || {};

// start up
$(function() {
	setupConsole();

	var appController = new mindmaps.ApplicationController();
	appController.go();
});

function setupConsole() {
	var noOp = function() {
	};

	// provide console object and dummy functions if not built-in
	var console = window.console || {};
	console.log = console.log || noOp;
	console.info = console.info || noOp;
	console.debug = console.debug || noOp;
	console.warn = console.warn || noOp;
	console.error = console.error || noOp;

	// turn all console.xx calls into no-ops when in production mode except
	// for errors, do an alert.
	if (!mindmaps.DEBUG) {
		console.debug = noOp;
		console.info = noOp;
		console.log = noOp;
		console.warn = noOp;
		console.error = function(s) {
			window.alert("Error: " + s);
		};
	}
}