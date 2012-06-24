var sys = require('sys');
var static = require('node-static');

//
// Create a node-static server to serve the current directory
//
var file = new(static.Server)('bin', { cache: false, headers: {'X-Hello':'World!'} });

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response, function (err, res) {
      if (err) {
        sys.error("> Error serving " + request.url + " - " + err.message);
        response.writeHead(err.status, err.headers);
        response.end();
      } else {
        sys.puts("> " + request.url + " - " + res.message);
      }
    });
  });
}).listen(8080);

sys.puts("> node-static is listening on http://127.0.0.1:8080");
