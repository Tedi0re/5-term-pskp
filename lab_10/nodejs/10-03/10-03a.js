const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const PORT = 3000;

let message = process.argv[2] ? process.argv[2] : 'hello';

client.on('message', (message) => {
    console.log(message.toString());
    client.close();
});

client.send(message, PORT, 'localhost', err => {
    if (err) {
        client.close();
    }
});

