const http = require('http');
const url = require('url');

const PORT = 5000;

const server = http.createServer(async (req, res) => {
    if(req.method === 'POST'){
        let body = '';
        req.on('data', (chunk)=>{
            body += chunk.toString();
        });
        let data = '';
        let x = '';
        let y = '';
        let s = '';
        await new Promise((resolve)=>{
            req.on('end', resolve);
        })

        data = new URLSearchParams(body);

        x = data.get('x');
        y = data.get('y');
        s = data.get('s');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(`x=${x} y=${y} s=${s}`);
    } else {
        res.writeHead(405, {'Allow':'POST'});
    }
    res.end();
});

server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
})
