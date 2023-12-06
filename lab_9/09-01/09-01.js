const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({port:4000, host:'localhost', path:'/upload'});
wss.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    const fileName = `./upload/file_${Date.now()}.txt`;

    let wfile = fs.createWriteStream(fileName);
    duplex.pipe(wfile);
});