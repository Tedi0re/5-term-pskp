const http = require('http');


const serverUrl = 'http://localhost:5000/';

const postData = "" +
    "<request id = \"28\">\n" +
    "    <x value = \"1\"/>\n" +
    "    <m value = \"a\"/>\n" +
    "    <x value = \"2\"/>\n" +
    "    <m value = \"b\"/>\n" +
    "    <x value = \"3\"/>\n" +
    "    <m value = \"c\"/>\n" +
    "</request>"

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/xml',
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
        console.log(`Тело ответа: \n${postData}`);
        console.log(`Данные ответа: \n${data}`);

    });
});

req.on('error', (error) => {
    console.error('Ошибка запроса:', error.message);
});

req.write(postData);

req.end();
