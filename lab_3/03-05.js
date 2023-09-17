const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 5000;
const REQUEST_URL = `/fact?k=`;
const factAsync = (n) => {
    return new Promise((resolve, reject) => {
        if (n === 0) {
            setImmediate(() => {
                resolve(1);
            });
        } else if (n < 0) {
            setImmediate(() => {
                reject(new Error("Negative input is not supported"));
            });
        } else {
            setImmediate(() => {
                factAsync(n - 1)
                    .then((result) => {
                        resolve(n * result);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    });
};

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
            let obj= {
                k:n,
                fact:0,
            }
            factAsync(n).then((result)=>{
                obj.fact = result;

                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                if(!cycle){
                    res.write(`<p>Результат:${obj.k}/${obj.fact}</p>`);
                } else {
                    res.write(JSON.stringify(obj));
                }
                res.statusCode = 200;
                res.end();
            }).catch((err)=>{
                console.error(err.message);
            })

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

