/**
 * Created with JetBrains WebStorm.
 * User: chuang
 * Date: 13-5-21
 * Time: 下午2:02
 * To change this template use File | Settings | File Templates.
 */
var http  = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = 'C:/test' + pathname;
    path.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            console.log(realPath);
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    response.end(err);
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    response.write(file, "binary");

                    response.end();
                }
            });
        }
    });
});

server.listen(3000);