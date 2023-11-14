const http = require('http');
const fs = require('fs');

const serverUrl = 'http://localhost:5000/?fileName=MyFile.png';

let options = {
    host: 'localhost',
    method: 'GET'
}
const req = http.request(serverUrl, options, (res) => {
    res.pipe(fs.createWriteStream('./uploads/MyFile.png'));
});

req.end();