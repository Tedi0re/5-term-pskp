const http = require('http');
const send = require('./module/m06_KES.js');
const fs = require('fs');
const { parse } = require('querystring');
const url = require('url');

http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    if (url.parse(request.url).pathname === '/' && request.method === 'GET') 
    {
        response.end(fs.readFileSync('./06-03.html'));
    }
    else if (url.parse(request.url).pathname === '/' && request.method === 'POST') 
    {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });

        request.on('end', () => {
            let parm = parse(body);

            var message1 = "";
            var rec = parm.receiver
            var sen = parm.sender;
            var pass = parm.password;
            message1 = parm.message;
            console.log(message1);
            send(sen, pass, message1, rec);


            response.end(`<h2>Отправитель: ${parm.sender}</br>Получатель: ${parm.receiver}
                    </br>Сообщение: ${parm.message}</h2>`);
        })
    }
    else
    response.end('<html><body><h1>Error! Visit localhost:5000/</h1></body></html>');



}).listen(5000, () => console.log('http://localhost:5000/'));