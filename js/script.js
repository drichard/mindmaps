/**
 * 
 */

$(function() {
	$("#toolbar button").button();
	$("#toolbar .buttonset").buttonset();
	
	
	// calculate canvas size on init and each resize
	resizeCanvas();
	$(window).resize(function() {
		resizeCanvas();
	});
	
	// set scroll view after canvas got its size
	$("#canvas-container").scrollview();
});

function resizeCanvas() {
	var windowHeight = $(window).height();
	var headerHeight = $("#header").outerHeight(true);
	var footerHeight = $("#footer").outerHeight(true);
	$("#canvas-container").height(windowHeight - headerHeight - footerHeight);
}