const rpcWS = require('rpc-websockets').Client;

const ws = new rpcWS('ws://localhost:4000/');

ws.on('open', () => {
    ws.login({ login: '1111', password: '1111' })
        .then(calculateExpression());
});


async function calculateExpression() {
    console.log('\nresult = ' +
        +await ws.call('sum',
            [
                +await ws.call('square', [3]),
                +await ws.call('square', [5, 4]),
                +await ws.call('mul', [3, 5, 7, 9, 11, 13])
            ])
        + +(await ws.call('fib', [7]))[0]
        * +await ws.call('mul', [2, 4, 6])
    );
}

