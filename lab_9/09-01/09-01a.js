const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000/upload');
ws.on('open', ()=>{
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

    const rfile = fs.createReadStream('./file.txt');
    rfile.pipe(duplex);
});
