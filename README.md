# mindmaps
mindmaps is a web application written in JavaScript that lets you easily create good looking mind maps.

## HTML5 goodness
- 100% offline capable thanks to ApplicationCache
- Stores mind maps in LocalStorage
- Canvas API draws the mind map
- FileReader API reads stored mind maps from the hard drive


## Try it out
The latest stable build is hosted [here] (http://drichard.org/mindmaps).


## Build
In order to build the application yourself you need to have node.js and jake installed.
Then run the jakefile:
```
	cd /build
	jake
```
The finished build will appear in /bin.


## Host yourself
All you need is a web server for static files. Copy all files from /bin into your web directory and 
launch the app with index.html.
Make sure your web server serves .manifest files with the mime type `text/cache-manifest` for the application to
be accessible offline.

In Apache add the following line to your .htaccess:
```
AddType text/cache-manifest .manifest
```

In nginx add this to conf/mime.types:
```
text/cache-manifest manifest; 
```

## License
mindmaps is licensed under AGPL V3, see LICENSE for more information.
