const net = require('net');

const PORT = 5000;

const server = net.createServer().listen(PORT, () => {console.log(`Server started on port ${PORT}...`)});

server.on('connection', socket => {
    console.log('client connected');

    socket.on('data', data => {
        console.log(`message from client: "${data}"`);
        socket.write(`ECHO: ${data}`);
    });

    socket.on('close', () => {
        console.log('client disconnected');
    });

    socket.on("error", (error) => {
        console.log(`Error: ${error}`);
    });
});

