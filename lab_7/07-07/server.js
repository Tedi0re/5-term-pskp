const http = require('http');
const fs = require('fs');
const url = require("url");

const PORT = 5000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        let file = fs.readFileSync(`./${url.parse(req.url,true).query.fileName}`);
        res.write(file);
    } else {
        res.writeHead(405, {'Allow':'GET'});
    }
    res.end();
});

server.listen(PORT, "localhost", (err) => {
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
});
