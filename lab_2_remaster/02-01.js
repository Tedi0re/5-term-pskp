const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

const server = http.createServer((req, res)=>{
    console.log('02-01 request');

    res.setHeader('Content-Type', 'text/html');

    if(req.url === '/html'){
        fs.readFile('./index.html', (error, data)=>{
            if(error){
                console.log(error);
                res.statusCode = 500;
                res.end();
            }else{
                res.statusCode = 200;
                res.write(data);
                res.end();
            }
        })
    }else{
        res.statusCode = 404;
        res.end()
    }


});

server.listen(PORT, "localhost", (error)=>{
    error ? console.log(`Error: ${error}`) : console.log(`Listening port ${PORT}`);
});