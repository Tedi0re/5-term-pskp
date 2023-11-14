const http = require('http');

const serverUrl = 'http://localhost:5000/';

const postData = JSON.stringify({
    "__comment":"Запрос.Лабораторная работа 8/10",
    "x":1,
    "y":2,
    "s":"Сообщение",
    "m":["a","b","c","d"],
    "o":{"surname":"Иванов","name":"Иван"}
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
    },
};

// Отправка POST-запроса
const req = http.request(serverUrl, options, (res) => {
    console.log('Статус ответа:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Тело ответа: \n${JSON.stringify(JSON.parse(postData), null, 2)}`);
        console.log(`Данные ответа: \n${JSON.stringify(JSON.parse(data), null, 2)}`);

    });
});

req.on('error', (error) => {
    console.error('Ошибка запроса:', error.message);
});

req.write(postData);

req.end();
