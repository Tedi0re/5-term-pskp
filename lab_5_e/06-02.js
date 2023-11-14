const http = require('http');
const url = require('url');
const fs = require('fs');
const { parse } = require('querystring');
const nodemailer = require('nodemailer');
const sendmail = require('sendmail')



http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    if (url.parse(request.url).pathname === '/' && request.method === 'GET') 
    {
        response.end(fs.readFileSync('./index.html'));
    }
    else if (url.parse(request.url).pathname === '/' && request.method === 'POST') 
    {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });

        request.on('end', () => {
            let parm = parse(body);

            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 587,
                secure: false,
                auth: {
                    user: parm.sender,
                    pass: parm.password
                }
            });

            const mailOptions = {
                from: parm.sender,
                to: parm.receiver,
                text: parm.message
            }

            transporter.sendMail(mailOptions, (err, info) => {
                err ? console.log(err) : console.log('Sent: ' + info.response);
            })

            response.end(`<h2>Отправитель: ${parm.sender}</br>Получатель: ${parm.receiver}
                    </br>Сообщение: ${parm.message}</h2>`);
        })
    }

    else
        response.end('<html><body><h1>Error! Visit localhost:5000/</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000/\n'));

///rtKrVy1nMbsgALmeXQv6