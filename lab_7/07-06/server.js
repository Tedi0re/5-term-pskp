const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
multiParty = require('multiparty');

const PORT = 5000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let form = new multiParty.Form({ uploadDir: './uploads' });
        form.on('file', (name, file) => {
            console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
        });
        form.on('error', err => { res.end(`<h1>form returned error: ${err}</h1>`) });
        form.on('close', () => {
            res.end('<h1>File successfully uploaded.</h1>');
        });
        form.parse(req);
    } else {
        res.writeHead(405, {'Allow':'POST'});
    }
});


server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
})
