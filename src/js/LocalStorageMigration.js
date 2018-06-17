var sourceOrigin = 'http://drichard.org';
var targetOrigin = 'https://www.mindmaps.app';

// var sourceOrigin = 'http://localhost:3000';
// var targetOrigin = 'http://localhost:4000';


function sendSavedDocuments() {
  // check if iframed
  if (window.self == window.top) {
    return;
  }

  // send documents
  Object.keys(localStorage).forEach(function (key) {
    if (key.indexOf('mindmaps.document') === 0) {
      var item = localStorage.getItem(key);

      window.parent.postMessage({ key: key, value: item }, targetOrigin);
    }
  });

  // finished
  window.parent.postMessage('migration.done', targetOrigin);
}

function receiveSavedDocuments() {
  // only get documents once
  var migrationDone = window.localStorage.getItem("mindmaps.storage.migrationDone");
  if (migrationDone === "true") {
    return;
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== sourceOrigin) {
      return;
    }

    // received done message
    if (event.data === 'migration.done') {
      window.localStorage.setItem('mindmaps.storage.migrationDone', 'true');
      mindmaps.Util.trackEvent("LocalStorageMigration", "done");
      return;
    }

    var data = event.data;
    window.localStorage.setItem(data.key, data.value);
  }, false);

  // add hidden iframe
  var iframe = document.createElement('iframe');
  iframe.style.display = "none";
  iframe.src = sourceOrigin + "/mindmaps";
  document.body.appendChild(iframe);
}

window.addEventListener('load', function () {
  // send save files from sourceOrigin
  if (window.location.origin === sourceOrigin) {
    sendSavedDocuments();
  }

  // receive save files on targetOrigin
  if (window.location.origin === targetOrigin) {
    receiveSavedDocuments();
  }
}, false);


