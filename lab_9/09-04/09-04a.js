const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000');

const name = process.argv[2] || Date.now();
const messageToServer = {name: name, timestamp: new Date().toISOString()};

const socket = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

ws.onopen = () => {
    ws.send(JSON.stringify(messageToServer));

    ws.on('message', message => {
        const parsedMessage = JSON.parse(message);

        console.log(`{n:${parsedMessage.n} client:${parsedMessage.name}, timestamp:${parsedMessage.timestamp}}`);
    });
};