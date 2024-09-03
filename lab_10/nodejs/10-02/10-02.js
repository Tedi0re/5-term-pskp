const net = require('net');

const PORT_SERVER_ONE = 40000;
const PORT_SERVER_TWO = 50000;

const create_svr = (n) => {
    return (socket) => {
        let sum = 0;
        let buffer = Buffer.alloc(4);

        socket.on('data', data => {
            console.log(`server ${n} received from ${socket.remoteAddress + ':' + socket.remotePort}: ${data.readInt32LE()}`);
            sum += data.readInt32LE();
        })

        let timer = setInterval(() => {
            const bufferedNumber =buffer.writeInt32LE(sum, 0);
            console.log(`sum ${socket.remoteAddress + socket.remotePort} = : ${sum}`);
            socket.write((bufferedNumber,buffer));
        },5000)

        socket.on('error', (error) => console.error(`socket ${socket.remoteAddress + ':' + socket.remotePort} error:`, error.message));

        socket.on('close', () => {
            clearInterval(timer);
            console.log(`client closed connection with server ${n}: `, socket.remoteAddress + ':' + socket.remotePort);
        })
    }
}

net.createServer(create_svr(PORT_SERVER_ONE)).listen(PORT_SERVER_ONE).on('listening', () => console.log('TCP-server: 127.0.0.1:',PORT_SERVER_ONE))
net.createServer(create_svr(PORT_SERVER_TWO)).listen(PORT_SERVER_TWO).on('listening', () => console.log('TCP-server: 127.0.0.1:',PORT_SERVER_TWO))

