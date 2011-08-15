# mindmaps
mindmapsis a prototype of an HTML5 based mind mapping application. It lets you create neat looking mind maps in the browser. 

## HTML5 goodness
- Written entirely in JavaScript
- 100% offline capable thanks to ApplicationCache
- Stores mind maps in LocalStorage
- Canvas API draws the mind map
- FileReader API reads stored mind maps from the hard drive


## Try it out
The latest stable build is hosted [here] (http://drichard.org/mindmaps).

## Build
Although the application runs fine if you launch `/src/index.html`, be aware that this is just the DEBUG mode for development. In debug mode quite a lot of output is sent to the console, ApplicationCache is deactivated and all script files are served individually and uncompressed.

If you plan to host the application please build it properly by running the build script.
In order to build the application yourself you need to have node.js and a couple of modules installed.

- [jake] (https://github.com/mde/jake): `npm install jake`
- [wrench-js] (https://github.com/ryanmcgrath/wrench-js): `npm install wrench`
- [uglify-js] (https://github.com/mishoo/UglifyJS): `npm install uglify-js`


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
