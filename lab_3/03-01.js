const http = require('http');
const readline = require('readline');

const PORT = 5000;
let STATE = 'norm';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Current State: ${STATE}</h1>`);
    res.end();
});

server.listen(PORT, 'localhost', (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Server is running on port', PORT);
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter new state (norm, stop, test, idle, exit): ',
});

rl.prompt();

rl.on('line', (input) => {
    input = input.trim().toLowerCase();

    switch (input) {
        case 'norm':
            console.log(`${STATE} --> norm`);
            STATE = 'norm';
            break;
        case 'stop':
            console.log(`${STATE} --> stop`);
            STATE = 'stop';
            break;
        case 'test':
            console.log(`${STATE} --> test`);
            STATE = 'test';
            break;
        case 'idle':
            console.log(`${STATE} --> idle`);
            STATE = 'idle';
            break;
        case 'exit':
            console.log('Exiting the application.');
            process.exit(0);
        default:
            break;
    }

    rl.prompt();
}).on('close', () => {
    console.log('Exiting the application.');
    process.exit(0);
});
