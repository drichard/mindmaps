/**
 * <pre>
 * Listens to HELP_COMMAND and displays notifications.
 * Provides interactive tutorial for first time users.
 * </pre>
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.commandRegistry} commandRegistry
 */
mindmaps.HelpController = function(eventBus, commandRegistry) {

  /**
   * Prepare tutorial guiders.
   */
  function setupInteractiveMode() {
    if (isTutorialDone()) {
      console.debug("skipping tutorial");
      return;
    }

    var notifications = [];
    var interactiveMode = true;

    // start tutorial after a short delay
    eventBus.once(mindmaps.Event.DOCUMENT_OPENED, function() {
      setTimeout(start, 1000);
    });

    function closeAllNotifications() {
      notifications.forEach(function(n) {
        n.close();
      });
    }

    var helpMain, helpRoot;
    function start() {
      helpMain = new mindmaps.Notification(
          "#toolbar",
          {
            position : "bottomMiddle",
            maxWidth : 550,
            title : "Welcome to mindmaps",
            content : "Hello there, it seems like you are new here! These bubbles "
                + "will guide you through the app. Or they won't if you want to skip this tutorial and <a class='skip-tutorial link'>click here<a/>."
          });
      notifications.push(helpMain);
      helpMain.$().find("a.skip-tutorial").click(function() {
        interactiveMode = false;
        closeAllNotifications();
        tutorialDone();
      });
      setTimeout(theRoot, 2000);
    }

    function theRoot() {
      if (isTutorialDone())
        return;

      helpRoot = new mindmaps.Notification(
          ".node-caption.root",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            title : "This is where you start - your main idea",
            content : "Double click the idea to change what it says. This will be the main topic of your mind map."
          });
      notifications.push(helpRoot);

      eventBus.once(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function() {
        helpRoot.close();
        setTimeout(theNub, 900);
      });
    }

    function theNub() {
      if (isTutorialDone())
        return;

      var helpNub = new mindmaps.Notification(
          ".node-caption.root",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "Creating new ideas",
            content : "Now it's time to build your mind map.<br/> Move your mouse over the idea, click and then drag"
                + " the <span style='color:red'>red circle</span> away from the root. This is how you create a new branch."
          });
      notifications.push(helpNub);
      eventBus.once(mindmaps.Event.NODE_CREATED, function() {
        helpMain.close();
        helpNub.close();
        setTimeout(newNode, 900);
      });
    }

    function newNode() {
      if (isTutorialDone())
        return;

      var helpNewNode = new mindmaps.Notification(
          ".node-container.root > .node-container:first",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            title : "Your first branch",
            content : "Great! This is easy, right? The red circle is your most important tool. Now, you can move your idea"
                + " around by dragging it or double click to change the text again."
          });
      notifications.push(helpNewNode);
      setTimeout(inspector, 2000);

      eventBus.once(mindmaps.Event.NODE_MOVED, function() {
        helpNewNode.close();
        setTimeout(navigate, 0);
        setTimeout(toolbar, 15000);
        setTimeout(menu, 10000);
        setTimeout(tutorialDone, 20000);
      });
    }

    function navigate() {
      if (isTutorialDone())
        return;

      var helpNavigate = new mindmaps.Notification(
          ".float-panel:has(#navigator)",
          {
            position : "bottomRight",
            closeButton : true,
            maxWidth : 350,
            expires : 10000,
            title : "Navigation",
            content : "You can click and drag the background of the map to move around. Use your mousewheel or slider over there to zoom in and out."
          });
      notifications.push(helpNavigate);
    }

    function inspector() {
      if (isTutorialDone())
        return;

      var helpInspector = new mindmaps.Notification(
          "#inspector",
          {
            position : "leftBottom",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "Don't like the colors?",
            content : "Use these controls to change the appearance of your ideas. "
                + "Try clicking the icon in the upper right corner to minimize this panel."
          });
      notifications.push(helpInspector);
    }

    function toolbar() {
      if (isTutorialDone())
        return;

      var helpToolbar = new mindmaps.Notification(
          "#toolbar .buttons-left",
          {
            position : "bottomLeft",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "The tool bar",
            content : "Those buttons do what they say. You can use them or work with keyboard shortcuts. "
                + "Hover over the buttons for the key combinations."
          });
      notifications.push(helpToolbar);
    }

    function menu() {
      if (isTutorialDone())
        return;

      var helpMenu = new mindmaps.Notification(
          "#toolbar .buttons-right",
          {
            position : "leftTop",
            closeButton : true,
            maxWidth : 350,
            title : "Save your work",
            content : "The button to the right opens a menu where you can save your mind map or start working "
                + "on another one if you like."
          });
      notifications.push(helpMenu);
    }

    function isTutorialDone() {
      return mindmaps.LocalStorage.get("mindmaps.tutorial.done") == 1;
    }

    function tutorialDone() {
      mindmaps.LocalStorage.put("mindmaps.tutorial.done", 1);
    }

  }

  /**
   * Prepares notfications to show for help command.
   */
  function setupHelpButton() {
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
                + "an idea and drag the red circle to create a new idea."
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

      notifications.push(helpRoot, helpNavigator, helpInspector,
          helpToolbar);
    }
  }

  setupInteractiveMode();
  setupHelpButton();
};
