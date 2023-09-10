const http = require('http');

const PORT = 5000;
let text = "Симонов Андрей Александрович"

const server = http.createServer((req, res)=>{
    console.log('02-03 request');

    if(req.url === '/api/name'){
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5001");
        res.write(text);
        res.statusCode = 200;
        res.end();
    } else{
        res.statusCode = 404;
        res.end();
    }
});

server.listen(PORT, 'localhost', (error)=>{
    error? console.log(error) : console.log(`Listening port ${PORT}`);
})