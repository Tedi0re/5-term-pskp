const http = require('http');
const fs = require('fs');

const PORT = 5000;

const server = http.createServer((req, res)=>{
    console.log('02-02 request');

    res.setHeader('Content-Type', 'image/png');

    if(req.url ==='/png' && req.method === "GET" ){
        fs.readFile('./pic.png', (error, data)=>{
            if(error){
                console.log(error);
                res.statusCode = 500;
                res.end();
            } else{
                res.statusCode = 200;
                res.write(data);
                res.end();
            }
        })
    }else{
        res.statusCode = 404;
        res.end();
    }
});

server.listen(PORT, 'localhost', (error)=>{
    error ? console.log(error) : console.log(`Listening port ${PORT}`)
})