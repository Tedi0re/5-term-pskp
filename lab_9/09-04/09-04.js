const WebSocket = require("ws");
const fs = require("fs");

const duplex = new WebSocket.Server({port: 4000, host: 'localhost'});

let count = 0;

duplex.on('connection', ws => {
    ws.on('message', message => {
        const messageClient = JSON.parse(message);
        console.log(`{client:${messageClient.name}, timestamp:${messageClient.timestamp}}`);

        const messageFromServer = {n: count++, name: messageClient.name, timestamp: new Date().toISOString()};
        ws.send(`${JSON.stringify(messageFromServer)}\n`);
    })
})