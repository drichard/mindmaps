# mindmaps
mindmaps is a HTML5 based mind mapping application. It lets you create neat looking mind maps in the browser.

This project started in 2011 as an exploration into what's possible to do in browsers using modern APIs. Nowadays, most of this stuff is pretty common and the code base is a bit outdated. This was way before React, ES6, webpack. Heck, it doesn't even use Backbone.

However, there is no reason to change any of that and it makes the code base quite easy to grok. There is no compilation step, no babel plugins, no frameworks. Just a JavaScript application and a very simple Model-View-Presenter pattern.

## HTML5 stuff which was cool in 2011
- 100% offline capable via ApplicationCache
- Stores mind maps in LocalStorage
- FileReader API reads stored mind maps from the hard drive
- Canvas API draws the mind map

## Try it out
The latest stable build is hosted [here](https://www.mindmaps.app).

## Build
* First run `npm install` to install required dependencies
* Run `npm run start` to launch a local dev server. The app will be hosted at [http://localhost:3000](http://localhost:3000).
* Run `npm run build` to compile the production bundle. The artifacts will be located in `/dist`.


## Host yourself
All you need is a web server for static files. After building, copy all files from /dist into your web directory and launch the app with index.html.
Make sure your web server serves .appcache files with the mime type `text/cache-manifest` for the application to
be accessible offline.

In Apache add the following line to your .htaccess:

```
AddType text/cache-manifest .appcache
```

In nginx add this to conf/mime.types:

```
text/cache-manifest appcache; 
```

Alternatively, you can launch a local debug server with `npm start` which starts a server on localhost:8080.

## License
mindmaps is licensed under AGPL V3, see LICENSE for more information.
