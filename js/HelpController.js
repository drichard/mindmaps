mindmaps.HelpController = function(eventBus, commandRegistry) {
	var command = commandRegistry.get(mindmaps.HelpCommand);
	command.setHandler(showHelp);

	var notifications = [];
	function showHelp() {
		// true if atleast one notifications is still on screen
		var displaying = notifications.some(function(noti) {
			return noti.isVisible();
		});

		// hide notifications if visible
		if (displaying) {
			notifications.forEach(function(noti) {
				noti.close();
			});
			notifications.length = 0;
			return;
		}

		// show notifications
		var helpRoot = new mindmaps.Notification(
				".node-caption.root",
				{
					position : "bottomLeft",
					closeButton : true,
					maxWidth : 350,
					title : "This is your main idea",
					content : "Double click an idea to edit its text. Move the mouse over "
							+ "an idea and drag the red nub to create a new idea."
				});

		var helpNavigator = new mindmaps.Notification(
				"#navigator",
				{
					position : "leftTop",
					closeButton : true,
					maxWidth : 350,
					padding : 20,
					title : "This is the navigator",
					content : "Use this panel to get an overview of your map. "
							+ "You can navigate around by dragging the red rectangle or change the zoom by clicking on the magnifier buttons."
				});

		var helpInspector = new mindmaps.Notification(
				"#inspector",
				{
					position : "leftTop",
					closeButton : true,
					maxWidth : 350,
					padding : 20,
					title : "This is the inspector",
					content : "Use these controls to change the appearance of your ideas. "
							+ "Try clicking the icon in the upper right corner to minimize this panel."
				});

		var helpToolbar = new mindmaps.Notification(
				"#toolbar .buttons-left",
				{
					position : "bottomLeft",
					closeButton : true,
					maxWidth : 350,
					title : "This is your toolbar",
					content : "Those buttons do what they say. You can use them or work with keyboard shortcuts. "
							+ "Hover over the buttons for the key combinations."
				});

		notifications.push(helpRoot, helpNavigator, helpInspector, helpToolbar);

		// var helpStatusbar = new mindmaps.Notification(
		// "#statusbar .buttons-right",
		// {
		// position : "topRight",
		// closeButton : true,
		// maxWidth : 350,
		// title : "This is your toolbar",
		// content : "Those buttons do what they say. You can use them or work
		// with keyboard shortcuts. "
		// + "Hover over the buttons for the key combinations."
		// });

	}
};