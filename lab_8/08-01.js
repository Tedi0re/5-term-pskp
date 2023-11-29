const ws = require('ws');
const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT_HTTP = 3000;
const PORT_WS = 4000;

const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true);
    if (req.method === 'GET' && path.pathname === '/start') {
        res.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
        res.end(fs.readFileSync('./index.html'));
    }
    else {
        res.writeHead(400, {'Content-type': 'text/html; charset=utf-8'});
        res.end();
    }
})

const webSocket = new ws.Server({port: PORT_WS}); // Используйте серверное подключение WebSocket
let k = 0;

webSocket.on('connection', webClient => {


    let n = 0;
    webClient.on('message', message => {
        const regex = /08-01-client: (\d+)/;
        const match = message.toString().match(regex);
        if (match) {
            n = match[1];
            console.log(message.toString());
        }
    });

    let interval =  setInterval(() => {
        k++;
        webClient.send(`08-01-server: ${n}->${k}`);
    }, 5000);

    webClient.on('close', () => {
        clearInterval(interval);
        console.log(`Client disconnected`);
    });

});


server.listen(PORT_HTTP);
console.log('http://localhost:3000/start');