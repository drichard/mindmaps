# mindmaps
mindmaps is a prototype of an HTML5 based mind mapping application. It lets you create neat looking mind maps in the browser.

## HTML5 goodness
- Written entirely in JavaScript
- 100% offline capable thanks to ApplicationCache
- Stores mind maps in LocalStorage
- FileReader API reads stored mind maps from the hard drive
- Canvas API draws the mind map


## Try it out
The latest stable build is hosted [here](http://drichard.org/mindmaps).

## Build
* Run `npm run start` to launch a local dev server. The app will be hosted at [http://localhost:3000](http://localhost:3000).
* Run `npm run build` to compile the production bundle. The artifacts will be located in `./bin`.


## Host yourself
All you need is a web server for static files. Copy all files from /bin into your web directory and 
launch the app with index.html.
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
