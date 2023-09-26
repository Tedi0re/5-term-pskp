const http = require('http');
const url = require('url');
const fs = require('fs');
let data = require('./DB.js');

const PORT = 5000;

let db = new data.DB();

db.on('GET', (req, res)=>{
    console.log('DB.GET');
    res.end(JSON.stringify(db.get()));
});

db.on('POST', (req, res)=>{
    console.log('DB.POST');
    req.on('data', data=>{
        let r = JSON.parse(data);
        db.post(r);
        res.end(JSON.stringify(r));
    })
});

db.on('PUT', (req, res)=>{
    console.log('DB.PUT');
    req.on('data', data=>{
        let r = JSON.parse(data);
        db.put(r);
        res.end(JSON.stringify(r));
    })
});

db.on('DELETE', (req, res)=>{
    console.log('DB.DELETE');
    let id = url.parse(req.url,true).query.id;
    if (id) {
        res.end(JSON.stringify(db.delete({id})));
    } else {
        res.statusCode = 400; // Bad Request
        res.end('Missing or invalid "id" parameter in the URL.');
    }
});

http.createServer((req, res)=>{
    if(url.parse(req.url).pathname === '/api/db'){
        db.emit(req.method, req, res);
    }
}).listen(PORT, 'localhost', (err)=>{
    err ? console.log(err) : console.log('http://localhost:5000/')
});