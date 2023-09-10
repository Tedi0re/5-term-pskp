const http = require('http');
const fs  = require('fs');

const PORT = 5001;

http.createServer((req,res)=>{
    if(req.url === '/fetch'){
        fs.readFile('./fetch.html', (err, data)=>{
            if(err){
                console.log(err);
                res.statusCode = 500
                res.end();
            } else {
                res.write(data);
                res.statusCode = 200;
                res.end();
            }
        })
    } else {
        res.statusCode = 404;
        res.end();
    }
}).listen(PORT, 'localhost', (err)=>{
    err ? console.log(err) : console.log('02-05 request');
})