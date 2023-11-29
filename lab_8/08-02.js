const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:4000/start');

socket.on('open', () => {
    let n = 0;
    console.log('CONNECT');

    setInterval(() => {
        n++;
        socket.send(`08-01-client: ${n}`);
    }, 3000);

    setTimeout(() => {
        socket.close();
    }, 25000);
});

socket.on('close', () => {
    console.log('DISCONNECTED');
    return 0;
});

socket.on('message', (message) => {
    console.log(`onmessage: ${message}`);
});
