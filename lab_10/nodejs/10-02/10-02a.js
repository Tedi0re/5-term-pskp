const net = require('net');

const HOST = '127.0.0.1';
const PORT = 40000;

const portServer = process.argv[2] || PORT;
const numberClient = process.argv[3] || 5;

const client = new net.Socket();

client.connect(portServer, HOST,() => {
    const { address, port } = client.address();
    console.log(`client address: ${address + ':' + port} started`);
    console.log('successful connection');

    let buffer = new Buffer.alloc(4);
    let timer = setInterval(() => {
        const bufferNumber = buffer.writeInt32LE(numberClient,0);
        client.write((bufferNumber,buffer));
    },1000)

    client.on('error', (error) => console.error('error: ', error))
    client.on('data', data => console.log('server received: ', data.readInt32LE()))
    client.on('close', () => {
        clearInterval(timer);
        console.log('connection closed')
    })
})