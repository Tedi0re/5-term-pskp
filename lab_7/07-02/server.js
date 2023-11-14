const http = require('http');
const url = require('url');

const PORT = 5000;

const filterNumber = function (value) {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
        return numericValue;
    }
    return NaN;
};


const server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        let x = filterNumber(url.parse(req.url,true).query.x);
        let y = filterNumber(url.parse(req.url,true).query.y);
        if(isNaN(x) || isNaN(y)){
            res.statusCode = 400;
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(`x=${x} y=${y}`);
        }
    } else {
        res.writeHead(405, {'Allow':'GET'});
    }
    res.end();
});

server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
})
