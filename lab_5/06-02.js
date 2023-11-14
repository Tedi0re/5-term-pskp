const http = require('http');
const fs = require('fs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const PORT = 3000;
const PASSWORD = 'otycblfqlygpziud';

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Отправляем HTML-страницу для ввода данных
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8;' });
                res.end('Internal Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8;' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/sendmail') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const parsedData = new URLSearchParams(data);

            const senderEmail = parsedData.get('senderEmail');
            const recipientEmail = parsedData.get('recipientEmail');
            const message = parsedData.get('message');

            const transporter = nodemailer.createTransport(smtpTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: senderEmail,
                    pass: PASSWORD,
                },
            }));

            const mailOptions = {
                from: senderEmail,
                to: recipientEmail,
                subject: 'lab_6',
                text: message,
                html: `<i>${message}</i>`,
            };
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8;' });
            res.end("Письмо успешно отправлено");

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         console.error(error);
            //         res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8;' });
            //         res.end('Ошибка при отправке письма');
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //         res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8;' });
            //         res.end('Письмо успешно отправлено');
            //     }
            // });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8;' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});
