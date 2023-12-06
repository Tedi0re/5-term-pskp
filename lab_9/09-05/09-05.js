const rpcWS = require('rpc-websockets').Server;
const config = {port: 4000, host: 'localhost', path: '/'};

const server = new rpcWS(config);
server.setAuth(auth => auth.login === '1111' && auth.password === '1111');

server.register('square', square).public();
server.register('sum', sum).public();
server.register('mul', mul).public();

server.register('fib', fib).protected();
server.register('fact', fact).protected();

function square(params) {
    switch (params.length) {
        case 1:
            return Math.pow(params[0], 2) * Math.PI;
        case 2:
            return params[0] * params[1];
        default:
            return 'wrong params';
    }
}

function sum(params) {
    return params.reduce((sum, nextItem) => sum + nextItem, 0);
}

function mul(params) {
    return params.reduce((mul, nextItem) => mul * nextItem, 1);
}

function fib(n) {
    if (isNaN(n) || n <=0) {
        return 'wrong params';
    }
    else{
        if (+n === 1 ) {
            return [0];
        }
        let fibArray = [0, 1];
        for (let i = 2; i < +n; i++) {
            fibArray.push(fibArray[i - 2] + fibArray[i - 1]);
        }
        return fibArray;
    }
}


function fact(n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}
