const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 4000, host: 'localhost', path: '/broadcast'});

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN) {
                console.log(data.toString());
                client.send('server: ' +data.toString());
            }

        });
    });
});