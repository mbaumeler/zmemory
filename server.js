var http = require('http'),
    os = require('os'),
    port = process.env.PORT || 8000;

http.createServer(function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello Worldn');
}).listen(port);

console.log('Server is running at http://' + os.hostname() + ":" + port);