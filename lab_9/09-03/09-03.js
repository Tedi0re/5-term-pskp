const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({port:4000, host:'localhost'});
wss.on('connection', (ws)=>{
    ws.on('pong', data => {
        console.log(`Message{${data.toString()}}`, )
    });
});

let count = 0;


setInterval(() => {
    wss.clients.forEach(client => {
        client.send(`09-03-server: ${++count}\n`);
    });
}, 15000);

setInterval(()=>{
    wss.clients.forEach(client=>{
        client.ping('server: ping');
    })
    console.log(`server: ping, ${wss.clients.size} connected clients`)
}, 5000)