var fs = require("fs");
var path = require("path");
var wrench = require("wrench");

var indexFileName = "index.html";
var baseDir = "../";
var publishDir = baseDir + "bin/";
var scriptFilename = "script.js";
var scriptDir = "js";
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
	console.log("Creating new bin directory");
	fs.mkdirSync(publishDir, 0755);
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

			buffer.push(scriptFile);
		});

		var combined = buffer.join("\n");
		fs.writeFileSync(publishDir + scriptDir + scriptFilename, combined);
		console.log("Combined all scripts into " + scriptFilename);
	}
});

desc("Use minified scripts");
task("use-min-js", [ "minify-js" ], function() {
	console.log("Replacing script files with minified version in index.html");
	indexFile = indexFile.replace(regexScriptSection, "<script src=\"js/"
			+ scriptFilename + "\"></script>");
	fs.writeFileSync(publishDir + indexFileName, indexFile);
});

desc("Copy all other files");
task("copy-files", function() {
	console.log("Copying all other files into /bin");
	excludeFiles.push(indexFileName);
	excludeFiles.push.apply(excludeFiles, scriptNames);
	excludeFiles = excludeFiles.map(function(file) {
		file = file.replace(/\./g, "\\.").replace("*", ".*", "g");
		file = "^" + file + "$";
		console.log(file);
		return file;
	});
	var regexIgnore = new RegExp(excludeFiles.join("|"));

	copyFiles("");

	/**
	 * Recursively copies all files from the base directory to the publish
	 * directory
	 */
	function copyFiles(dir) {
		var files = fs.readdirSync(baseDir + dir);
		files.forEach(function(file) {
			var path = dir + file;
			if (!regexIgnore.test(path)) {
				var stats = fs.statSync(baseDir + path);
				if (stats.isDirectory()) {
					fs.mkdirSync(publishDir + path, 0755);
					copyFiles(path + "/");
				} else if (stats.isFile()) {
					var contents = fs.readFileSync(baseDir + path);
					fs.writeFileSync(publishDir + path, contents);
				}
			}
		});
	}
});

desc("Build project");
task("build", [ "use-min-js", "copy-files" ], function() {
	console.log("Project built.");
});

desc("default");
task("default", [ "build" ], function() {
	// build on default
});