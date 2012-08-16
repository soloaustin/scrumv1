var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var sys = require('sys');

var prefix = '/db/';
var target = 'http://127.0.0.1:5984';

http.createServer(function(request, response) {

    console.log('request starting...');

    var uri = url.parse(request.url);
    if (uri.pathname.substring(0, prefix.length) != prefix) {
        httpServer(request, response);
    } else {
        uri = url.parse(target + uri.pathname.substring(prefix.length - 1) + (uri.search || ''));
        httpProxy(request, response, uri);
    }

}).listen(8125);



function httpServer(request, response) {
    var filePath = '../web' + request.url;
    if (filePath == '../web/') filePath = '../web/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    }

    path.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}

function httpProxy(request, response, uri) {

    var path = uri.pathname + (uri.search || '');
    var headers = request.headers;
    console.log(headers);
    headers['host'] = uri.hostname + ':' + uri.port;
    headers['x-forwarded-for'] = request.connection.remoteAddress;
    headers['referer'] = 'http://' + uri.hostname + ':' + uri.port + '/';

    var options = {
        host: uri.hostname,
        port: uri.port,
        path: path,
        method: request.method,
        headers:headers
    };
    console.log(options);
    console.log(path);
    var clientRequest = http.request(options, function(clientResponse) {
        console.log('STATUS: ' + clientResponse.statusCode);
        console.log('HEADERS: ' + JSON.stringify(clientResponse.headers));
        delete clientResponse.headers['transfer-encoding'];
        if (clientResponse.statusCode == 503) {
            return error(inResponse, 'db_unavailable', 'Database server not available.', 502);
        }
        response.writeHead(clientResponse.statusCode, clientResponse.headers);
        clientResponse.on('data', function(chunk) {
            console.log(chunk);
            response.write(chunk);
        });
        clientResponse.on('end', function() {
            response.end();
        });
    });
    clientRequest.on('error', function(e) {
        unknownError(response, e)
    });
    request.on('data',function(chunk){clientRequest.write(chunk);});
    
    clientRequest.end();

}

function error(response, error, reason, code) {
    sys.log('Error ' + code + ': ' + error + ' (' + reason + ').');
    response.writeHead(code, {
        'Content-Type': 'application/json'
    });
    response.write(JSON.stringify({
        error: error,
        reason: reason
    }));
    response.end();
}

function unknownError(response, e) {
    sys.log(e.stack);
    error(response, 'unknown', 'Unexpected error.', 500);
}
console.log('Server running at http://127.0.0.1:8125/');
