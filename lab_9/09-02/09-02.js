const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({port:4000, host:'localhost', path:'/download'});
wss.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    const fileName = `./download/file.txt`;

    let rfile = fs.createReadStream(fileName);
    rfile.pipe(duplex);
});