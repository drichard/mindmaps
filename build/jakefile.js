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
		".project", "README.md", "canvas.html", "*psd", "*.psd" ];
var indexFile = fs.readFileSync(baseDir + indexFileName, "utf8");
var scriptNames = [];

desc("Clean old build directory");
task("clean-dir", function() {
	if (path.existsSync(publishDir)) {
		console.log("Deleting old bin directory");
		wrench.rmdirSyncRecursive(publishDir, 0755);
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

	var regexDebug = /^<!-- IF DEBUG -->[\s\S]*?<!-- END IF -->/gmi;
	indexFile = indexFile.replace(regexDebug, "");
});

desc("Copy index.html");
task("copy-index", [ "create-dir", "use-min-js", "remove-debug" ], function() {
	console.log("Copying index.html to /bin");

	fs.writeFileSync(publishDir + indexFileName, indexFile);
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