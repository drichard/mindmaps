var fs = require("fs");
var path = require("path");
var wrench = require("wrench");

var indexFileName = "index.html";
var baseDir = "../";
var publishDir = path.resolve(baseDir);
var scriptFilename = "script.js";


var indexFile = fs.readFileSync(baseDir + indexFileName, "utf8");

// find the scripts in index.html
var regexScriptSection = /<!-- JS:LIB:BEGIN -->([\s\S]*?)<!-- JS:LIB:END -->/;
var regexScriptName = /<script src="(.*?)"><\/script>/g;
//
// var scriptSection = regexScriptSection.exec(indexFile)[1];
//
// // extract script names
// var scripts = [];
// var match;
// while ((match = regexScriptName.exec(scriptSection)) != null) {
// var script = match[1];
// scripts.push(script);
// }
//
// console.log("Minifying and concatting scripts.");
//
// var jsp = require("uglify-js").parser;
// var pro = require("uglify-js").uglify;
//
// var regexMinifed = /min.js$/;
// var regexCopyright = /^\/\*![\s\S]*?\*\//m;
// var buffer = [];
// scripts.forEach(function(script) {
// var scriptFile = fs.readFileSync(baseDir + script, "utf8");
// var copyright = regexCopyright.exec(scriptFile);
// if (copyright) {
// buffer.push(copyright);
// }
//
// // check if file is already minified
// if (!regexMinifed.test(script)) {
// var ast = jsp.parse(scriptFile);
// ast = pro.ast_mangle(ast);
// ast = pro.ast_squeeze(ast);
// scriptFile = pro.gen_code(ast);
// } else {
// console.log("Skipping: " + script + " is already minified.");
// }
//
// buffer.push(scriptFile);
// });
//
// var combined = buffer.join("\n");
// fs.writeFileSync(publishDir + scriptFilename, combined);
// console.log("Combined all scripts into " + scriptFilename);

// clean dir
if (path.existsSync(publishDir)) {
	wrench.rmdirSyncRecursive(publishDir, 0755);
}
fs.mkdirSync(publishDir, 0755);

indexFile = indexFile.replace(regexScriptSection, "<script src=\"js/"
		+ scriptFilename + "\"></script>");
fs.writeFileSync(publishDir + indexFileName, indexFile);

var excludeFiles = [ ".gitignore", ".git", "bin", "test", ".settings", "build",
		".project", "README.md", "canvas.html", ".psd" ];
var regexIgnore = new RegExp(excludeFiles.join("|"));

copyFiles(path.resolve(baseDir));


function copyFiles(dir) {
	var files = fs.readdirSync(dir);
	files.forEach(function(file) {
		if (!regexIgnore.test(file)) {
			var stats = fs.statSync(dir + file);
			if (stats.isDirectory()) {
				fs.mkdirSync(publishDir + dir + file, 0755);
				copyFiles(dir + file + "/");
			} else if (stats.isFile()) {
				var contents = fs.readFileSync(dir + file);
				fs.writeFileSync(publishDir + dir + file, contents);
			}
		}
	});

}