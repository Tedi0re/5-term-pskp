const rpcServer = require('rpc-websockets').Server;
const server = new rpcServer({ port: 4000, host: 'localhost' });

server.register('A', params => { console.log('A notify', params); }).public();
server.register('B', params => { console.log('B notify', params); }).public();
server.register('C', params => { console.log('C notify', params); }).public();