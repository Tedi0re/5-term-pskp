const rpcWS = require('rpc-websockets').Client;
const ws = new rpcWS('ws://localhost:4000/');

ws.on('open', () => {
    ws.call('square', [3]).then(result => {
        console.log(`square(3) = ${result}`);
    });
    ws.call('square', [5, 4]).then(result => {
        console.log(`square(5, 4) = ${result}`);
    });
    ws.call('sum', [2]).then(result => {
        console.log(`sum(2) = ${result}`);
    });
    ws.call('sum', [2, 4, 6, 8, 10]).then(result => {
        console.log(`sum(2, 4, 6, 8, 10) = ${result}`);
    });
    ws.call('mul', [3]).then(result => {
        console.log(`mul(3) = ${result}`);
    });
    ws.call('mul', [3, 5, 7, 9, 11, 13]).then(result => {
        console.log(`mul(3, 5, 7, 9, 11, 13) = ${result}`);
    });

    ws.login({login: '1111', password: '1111'})
        .then(() => {
            ws.call('fib', [1]).then((result) => {
                console.log('fib(1) = ', result);
            });
            ws.call('fib', [2]).then((result) => {
                console.log('fib(2) = ', result);
            });
            ws.call('fib', [7]).then((result) => {
                console.log('fib(7) = ', result);
            });
            ws.call('fact', [0]).then((result) => {
                console.log('fact(0) = ', result);
            });
            ws.call('fact', [5]).then((result) => {
                console.log('fact(5) = ', result);
            });
            ws.call('fact', [10]).then((result) => {
                console.log('fact(10) = ', result);
            });
        });
});
