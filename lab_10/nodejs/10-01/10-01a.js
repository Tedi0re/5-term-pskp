const net = require('net');

const HOST = '127.0.0.1';
const PORT = 3000;

const client = new net.Socket();

let message = process.argv[2] ? process.argv[2] : 'hello';

client.on('data', data => {
    console.log(`message from server: "${data}"`);
    client.destroy();
});

client.on('close', () => {
    console.log('disconnection');
});

client.connect(PORT, HOST, () => {
    console.log('successful connection');
    client.write(message);
});