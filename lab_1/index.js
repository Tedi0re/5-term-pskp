const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) =>{
    console.log('Server request');

    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Hello world!</h1>');
    res.end();
});

server.listen(PORT, 'localhost', (error)=>{
    error ? console.log(`error: ${error}`) : console.log(`listening port ${PORT}`);
});

