mindmaps.HelpController = function(e, t) {
    function n() {
        function r() {
            t.forEach(function(e) {
                e.close()
            })
        }

        function o() {
            i = new mindmaps.Notification("#toolbar", {
                position: "bottomMiddle",
                maxWidth: 550,
                title: "Welcome to mindmaps",
                content: "Hello there, it seems like you are new here! These bubbles " + "will guide you through the app. Or they won't if you want to skip this tutorial and <a class='skip-tutorial link'>click here<a/>."
            });
            t.push(i);
            i.$().find("a.skip-tutorial").click(function() {
                n = false;
                r();
                v()
            });
            setTimeout(u, 2e3)
        }

        function u() {
            if (d()) return;
            s = new mindmaps.Notification(".node-caption.root", {
                position: "bottomMiddle",
                closeButton: true,
                maxWidth: 350,
                title: "This is where you start - your main idea",
                content: "Double click (or press F2) an idea to edit its text. Move the mouse over an idea and drag the red circle to create a new idea. Use shift+enter to put a line break. <span style='color:red'>Change node text to continue tutorial.</span>"
            });
            t.push(s);
            e.once(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function() {
                s.close();
                setTimeout(a, 900)
            })
        }

        function a() {
            if (d()) return;
            var n = new mindmaps.Notification(".node-caption.root", {
                position: "bottomMiddle",
                closeButton: true,
                maxWidth: 350,
                padding: 20,
                title: "Creating new ideas",
                content: "Now it's time to build your mind map.<br/> Move your mouse over the idea, click and then drag" + " the <span style='color:red'>red circle</span> away from the root. This is how you create a new branch."
            });
            t.push(n);
            e.once(mindmaps.Event.NODE_CREATED, function() {
                i.close();
                n.close();
                setTimeout(f, 900)
            })
        }

        function f() {
            if (d()) return;
            var n = new mindmaps.Notification(".node-container.root > .node-container:first", {
                position: "bottomMiddle",
                closeButton: true,
                maxWidth: 350,
                title: "Your first branch",
                content: "Great! This is easy, right? The red circle is your most important tool. Now, you can move your idea" + " around by dragging it or double click to change the text again."
            });
            t.push(n);
            setTimeout(c, 2e3);
            e.once(mindmaps.Event.NODE_MOVED, function() {
                n.close();
                setTimeout(l, 0);
                setTimeout(h, 15e3);
                setTimeout(p, 1e4);
                setTimeout(v, 2e4)
            })
        }

        function l() {
            if (d()) return;
            var e = new mindmaps.Notification(".float-panel:has(#navigator)", {
                position: "bottomRight",
                closeButton: true,
                maxWidth: 350,
                expires: 1e4,
                title: "Navigation",
                content: "You can click and drag the background of the map to move around. Use your mousewheel or slider over there to zoom in and out."
            });
            t.push(e)
        }

        function c() {
            if (d()) return;
            var e = new mindmaps.Notification("#inspector", {
                position: "leftBottom",
                closeButton: true,
                maxWidth: 350,
                padding: 20,
                title: "Don't like the colors?",
                content: "Use these controls to change the appearance of your ideas. " + "Try clicking the icon in the upper right corner to minimize this panel."
            });
            t.push(e)
        }

        function h() {
            if (d()) return;
            var e = new mindmaps.Notification("#toolbar .buttons-left", {
                position: "bottomLeft",
                closeButton: true,
                maxWidth: 350,
                padding: 20,
                title: "The tool bar",
                content: "Those buttons do what they say. You can use them or work with keyboard shortcuts. " + "Hover over the buttons for the key combinations."
            });
            t.push(e)
        }

        function p() {
            if (d()) return;
            var e = new mindmaps.Notification("#toolbar .buttons-right", {
                position: "leftTop",
                closeButton: true,
                maxWidth: 350,
                title: "Save your work",
                content: "The button to the right opens a menu where you can save your mind map or start working " + "on another one if you like."
            });
            t.push(e)
        }

        function d() {
            return mindmaps.LocalStorage.get("mindmaps.tutorial.done") == 1
        }

        function v() {
            mindmaps.LocalStorage.put("mindmaps.tutorial.done", 1)
        }
        if (d()) {
            console.debug("skipping tutorial");
            return
        }
        var t = [];
        var n = true;
        e.once(mindmaps.Event.DOCUMENT_OPENED, function() {
            setTimeout(o, 1e3)
        });
        var i, s
    }

    function r() {
        function r() {
            var e = n.some(function(e) {
                return e.isVisible()
            });
            if (e) {
                n.forEach(function(e) {
                    e.close()
                });
                n.length = 0;
                return
            }
            var t = new mindmaps.Notification(".node-caption.root", {
                position: "bottomLeft",
                closeButton: true,
                maxWidth: 350,
                title: "This is your main idea",
                content: "Double click (or press F2) an idea to edit its text. Move the mouse over " + "an idea and drag the red circle to create a new idea. Use shift+enter to put a line break."
            });
            var r = new mindmaps.Notification("#navigator", {
                position: "leftTop",
                closeButton: true,
                maxWidth: 350,
                padding: 20,
                title: "This is the navigator",
                content: "Use this panel to get an overview of your map. " + "You can navigate around by dragging the red rectangle or change the zoom by clicking on the magnifier buttons."
            });
            var i = new mindmaps.Notification("#inspector", {
                position: "leftTop",
                closeButton: true,
                maxWidth: 350,
                padding: 20,
                title: "This is the inspector",
                content: "Use these controls to change the appearance of your ideas. " + "Try clicking the icon in the upper right corner to minimize this panel."
            });
            var s = new mindmaps.Notification("#toolbar .buttons-left", {
                position: "bottomLeft",
                closeButton: true,
                maxWidth: 350,
                title: "This is your toolbar",
                content: "Those buttons do what they say. You can use them or work with keyboard shortcuts. " + "Hover over the buttons for the key combinations."
            });
            n.push(t, r, i, s)
        }
        var e = t.get(mindmaps.HelpCommand);
        e.setHandler(r);
        var n = []
    }
    n();
    r()
}