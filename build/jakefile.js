var fs = require("fs");
var path = require("path");
var wrench = require("wrench");

var indexFileName = "index.html";
var baseDir = "../";
var publishDir = baseDir + "bin/";
var scriptFilename = "script.js";
var scriptDir = "js/";
var regexScriptSection = /<!-- JS:LIB:BEGIN -->([\s\S]*?)<!-- JS:LIB:END -->/;
var excludeFiles = [ ".gitignore", ".git", "bin", "test", ".settings", "build",
		".project", "README.md", "canvas.html", "*psd", "*.psd", "*libs" ];
var indexFile = fs.readFileSync(baseDir + indexFileName, "utf8");
var scriptNames = [];

desc("Clean old build directory");
task("clean-dir", function() {
	if (path.existsSync(publishDir)) {
		console.log("Deleting old bin directory");

		wrench.rmdirSyncRecursive(publishDir);
	}
});

desc("Create new directory");
task("create-dir", [ "clean-dir" ], function() {
	console.log("Creating new directory structure");
	fs.mkdirSync(publishDir, 0755);
	fs.mkdirSync(publishDir + scriptDir, 0755);
});

desc("Minify scripts");
task("minify-js", [ "create-dir" ], function() {
	extractScriptNames();
	minifyScripts();

	// find the scripts in index.html
	function extractScriptNames() {
		console.log("Extracting script file names from index.html");
		var regexScriptName = /<script src="(.*?)"><\/script>/g;

		var scriptSection = regexScriptSection.exec(indexFile)[1];

		// extract script names
		var match;
		while ((match = regexScriptName.exec(scriptSection)) != null) {
			var script = match[1];
			scriptNames.push(script);
		}
	}

	function minifyScripts() {
		console.log("Minifying and concatting scripts.");

		var jsp = require("uglify-js").parser;
		var pro = require("uglify-js").uglify;

		var regexMinifed = /min.js$/;
		var regexCopyright = /^\/\*![\s\S]*?\*\//m;
		var buffer = [];
		scriptNames.forEach(function(script) {
			var scriptFile = fs.readFileSync(baseDir + script, "utf8");
			var copyright = regexCopyright.exec(scriptFile);
			if (copyright) {
				buffer.push(copyright);
			}

			// check if file is already minified
			if (!regexMinifed.test(script)) {
				var ast = jsp.parse(scriptFile);
				ast = pro.ast_mangle(ast);
				ast = pro.ast_squeeze(ast);
				scriptFile = pro.gen_code(ast);
			} else {
				console.log("> Skipping: " + script + " is already minified.");
			}

			buffer.push(scriptFile + ";");
		});

		var combined = buffer.join("\n");
		fs.writeFileSync(publishDir + scriptDir + scriptFilename, combined);
		fs.chmodSync(publishDir + scriptDir + scriptFilename, 0755);
		console.log("Combined all scripts into " + scriptFilename);
	}
});

desc("Use minified scripts in HTML");
task("use-min-js", [ "create-dir", "minify-js" ], function() {
	console.log("Replacing script files with minified version in index.html");
	indexFile = indexFile.replace(regexScriptSection, "<script src=\"js/"
			+ scriptFilename + "\"></script>");

});

desc("Remove debug statements from HTML");
task("remove-debug", function() {
	console.log("Removing IF DEBUG statements in index.html");

	// remove debug code
	var regexDebug = /<!-- DEBUG -->[\s\S]*?<!-- \/DEBUG -->/gmi;
	indexFile = indexFile.replace(regexDebug, "");

	// insert production code
	var regexProduction = /<!-- PRODUCTION([\s\S]*?)\/PRODUCTION -->/gmi;
	indexFile = indexFile.replace(regexProduction, "$1");

	
	// remove all comments
	// var regexComments = /<!--[\s\S]*?-->/gmi;
	// indexFile = indexFile.replace(regexComments, "");

});

desc("Copy index.html");
task("copy-index", [ "create-dir", "use-min-js", "remove-debug" ], function() {
	console.log("Copying index.html to /bin");

	fs.writeFileSync(publishDir + indexFileName, indexFile);
	fs.chmodSync(publishDir + indexFileName, 0755);
});

desc("Copy all other files");
task("copy-files", [ "create-dir", "minify-js" ], function() {
	console.log("Copying all other files into /bin");

	function createExludeRegex() {
		// exclude files that get optimization treatment
		excludeFiles.push(indexFileName);
		excludeFiles.push.apply(excludeFiles, scriptNames);

		// convert wildcard notation to proper regex
		// *foo.jpg becomes ^.*foo\.jpg$
		excludeFiles = excludeFiles.map(function(file) {
			file = file.replace(/\./g, "\\.").replace("*", ".*", "g");
			file = "^" + file + "$";
			return file;
		});

		return new RegExp(excludeFiles.join("|"));
	}

	var regexExcludeFiles = createExludeRegex();
	copyFiles("");

	/**
	 * Recursively copies all files that dont match the exclude filter from the
	 * base directory to the publish directory.
	 */
	function copyFiles(dir) {
		var files = fs.readdirSync(baseDir + dir);
		files.forEach(function(file) {
			var currentDir = dir + file;
			if (!regexExcludeFiles.test(currentDir)) {
				var stats = fs.statSync(baseDir + currentDir);
				if (stats.isDirectory()) {
					if (!path.existsSync(publishDir + currentDir)) {
						fs.mkdirSync(publishDir + currentDir, 0755);
					}
					copyFiles(currentDir + "/");
				} else if (stats.isFile()) {
					var contents = fs.readFileSync(baseDir + currentDir);
					fs.writeFileSync(publishDir + currentDir, contents);
					fs.chmodSync(publishDir + currentDir, 0755);
				}
			}
		});
	}
});

desc("Build project");
task("build", [ "copy-index", "copy-files" ], function() {
	console.log("Project built.");
});

desc("default");
task("default", [ "build" ], function() {
	// build on default
});

desc("Deploy project to server");
task(
		"deploy",
		[ "build" ],
		function() {
			console.log("Deploying project to remote server");
			var exec = require('child_process').exec;
			console.log("Cleaning remote directory");
			exec("ssh s0522592@remserv.rz.htw-berlin.de 'rm -rf ~/public_html/mindmaps/*'");

			console.log("Copying all files to remote");
			exec(
					"scp -r . s0522592@remserv.rz.htw-berlin.de:~/public_html/mindmaps/",
					{
						cwd : "../bin"
					},
					function(error, stdout, stderr) {
						if (error !== null) {
							console.log('exec error: ' + error);
						} else {
							console.log("Copied all files successfully");
							console.log("Setting file permissions to 0755");
							exec("ssh s0522592@remserv.rz.htw-berlin.de 'chmod -R 0755 ~/public_html/mindmaps/*'");
						}
					});
		});

desc("Build cache manifest");
task("manifest", function() {
	/*
	 * TODO after building add all copied files to the cache.manifest
	 * automatically and set timestamp could use a manifest template which has
	 * filesections and timestamp replaced.
	 * 
	 * <pre> CACHE MANIFEST # {timeStamp}
	 * 
	 * CACHE: {files}
	 * http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js </pre>
	 */
});