var http = require('http');
http.createServer(function (request, response) {
 
var options = {
  host: '127.0.0.1',
  port: 5984,
  path: '/tasks/_design/board/_view/query_board?group_level=1',
  method: 'GET'
};

var req = http.request(options, function(res) {
  res.on('data', function (chunk) {
    //console.log('BODY: ' + chunk);
    response.write(chunk);
  });
  res.on('end',function(chunk){
    response.end();
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

response.end();
}).listen(8125);