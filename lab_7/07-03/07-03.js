const http = require('http');

const serverUrl = 'http://localhost:5000/';

const postData = "x=1&y=2&s=Hello";

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(postData),
    },
};

const req = http.request(serverUrl, options, (res) => {
    console.log('Статус ответа:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Тело ответа:', postData);
        console.log('Данные ответа:', data);

    });
});

req.on('error', (error) => {
    console.error('Ошибка запроса:', error.message);
});

req.write(postData);

req.end();
