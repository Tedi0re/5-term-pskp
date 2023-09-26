const http = require('http');
const url = require('url');
const fs = require('fs');

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


const ParseParameter = (i) =>{
    if(typeof i === 'undefined') return 0;
    else if(i === 'x') return 'x';
    else return parseInt(i);
}

http.createServer((req, res)=>{

    if(url.parse(req.url).pathname ==='/fact' && req.method.toUpperCase() === 'GET'){
        let n  = ParseParameter(url.parse(req.url,true).query.k);
        let cycle = ParseParameter(url.parse(req.url,true).query.cycle);
        if(typeof n === 'number') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            if(!cycle){
                process.nextTick(()=>res.end(`<p>Результат:${n}/${fact(n)}</p>`))
            } else {
                process.nextTick(()=>res.end(JSON.stringify({k:Number.parseInt(n),fact:Number.parseInt(fact(n))})))
            }
            res.statusCode = 200;
        } else if(n === 'x') {
            fs.readFile('./fact.html',(err, data) =>{
                if(err){
                    console.log(err);
                    res.statusCode = 500;
                    res.end();
                } else {
                    res.statusCode = 200;
                    res.end(data);
                }
            });
        } else {
            console.log('error');
            res.statusCode = 500;
            res.end()
        }

    }
    else {
        res.statusCode = 500;
        res.end()
    }
}).listen(PORT, 'localhost', (err)=>{
    err ? console.log(err) : console.log('http://localhost:5000/fact?k=x');
});

