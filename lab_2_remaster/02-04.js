let http = require('http');
let fs = require('fs');

http.createServer((req, res) => {
    let fileName = './xmlhttprequest.html';
    if (req.url === "/xmlhttprequest") {
        fs.stat(fileName, (err, stats) => {
            if (err) {
                console.error('error:', err);
            }
            else {
                let html = fs.readFileSync(fileName);
                res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': stats.size});
                res.end(html);
            }
        })
    }
    else if (req.url === "/api/name") {
        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8;"});
        res.end("Симонов Андрей Александрович");
    } else {
        res.writeHead(404, {"Content-Type": "text/html; charset=utf-8;"});
        res.end("<h2>Not found</h2>");
    }

}).listen(5000, () => console.log("02-04 request"));