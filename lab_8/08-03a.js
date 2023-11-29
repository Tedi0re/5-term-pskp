const WebSocket = require('ws');

let parm2 = process.argv[2];

let prfx = typeof  parm2 == 'undefined'?'A':parm2;
const ws = new WebSocket('ws://localhost:4000/broadcast');


ws.on('open', () => {
    let k = 0;
    setInterval(() => {
        ws.send(`client: ${prfx}-${++k}`);
    }, 1000);

    ws.on('message', message => {
        console.log(message.toString());
    })

    setTimeout(()=> {ws.close()}, 25000);
});