const http = require('http');
const url = require('url');
const stream = require("stream");
const string_decoder = require("string_decoder");

const PORT = 5000;
const REQUEST_URL = `/fact?k=`;
const fact = (n)=>{
    if(n === 0){
        return 1;
    } else if(n < 0){
        return undefined;
    } else {
        return n*fact(n-1);
    }
}

const ParseUndefToNull = (i) =>{
    if(typeof i === 'undefined')
        return 0;
    else return parseInt(i);
}

http.createServer((req, res)=>{

    if(url.parse(req.url).pathname ==='/fact' && req.method.toUpperCase() === 'GET'){
        let n  = ParseUndefToNull(url.parse(req.url,true).query.k);
        let obj  = {
            k:n,
            fact:fact(n),
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(obj));
        res.statusCode = 200;
        res.end();
    }
    else {
        res.statusCode = 500;
        res.end()
    }
}).listen(PORT, 'localhost', (err)=>{
    err ? console.log(err) : console.log('http://localhost:5000/fact?k=3');
});

