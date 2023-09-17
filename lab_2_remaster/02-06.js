const http = require("http");
const fs = require("fs");

const PORT = 5000;

http.createServer((req, res)=>{
    if(req.url === "/jquery"){
        fs.readFile("./jquery.html",(err, data)=>{
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.end();
            } else {
                res.write(data);
                res.statusCode = 200;
                res.end();
            }
        });
    } else if(req.url === '/api/name'){
        res.setHeader('Content-type', 'text/plain; charset=utf-8');
        res.write('Симонов Андрей Александрович');
        res.statusCode = 200;
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
}).listen(PORT, 'localhost', (err)=>{
    err ? console.log(err) : console.log('02-06 require');
});