mindmaps.Config = function() {
    return {
        MindMapAddress: "https://yourwebsite.com/s3/process.php",
        MindMapListAddress: "https://yourwebsite.com/s3/processFilenames.php",
        BaseUrl: "https://yourwebsite.com/",
        activateDirectUrlInput: true,
        activateUrlsFromServerWithoutSearch: false,
        activateUrlsFromServerWithSearch: false,
        allowMultipleUrls: true,
        urlServerAddress: "http://localhost/s3"
    }
}();
CKEDITOR.editorConfig = function(e) {}