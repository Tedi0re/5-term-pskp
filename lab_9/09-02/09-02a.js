const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000/download');
ws.on('open', ()=>{
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    const fileName = `./file_${Date.now()}.txt`;
    const wfile = fs.createWriteStream(fileName);
    duplex.pipe(wfile);
});
