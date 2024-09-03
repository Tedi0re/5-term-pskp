const https = require('https')
const fs = require('fs')

let options = {
    key: fs.readFileSync('LAB.KEY'),
    cert: fs.readFileSync('LAB.crt')
}

https.createServer(options, (req, res) => {
    console.log('hello from https')
    res.end('URA HTTPS')
}).listen(3001, '127.0.0.1', ()=> console.log('https://SAA:3001'))