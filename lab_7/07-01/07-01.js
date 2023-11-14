const http = require('http');

// URL сервера для отправки GET-запроса
const serverUrl = 'http://localhost:5000/';

// Опции запроса
const options = {
    method: 'GET',
};

// Отправка GET-запроса
const req = http.request(serverUrl, options, (res) => {
    // Вывод информации о статусе ответа
    console.log('Статус ответа:', res.statusCode);
    console.log('Сообщение к статусу ответа:', res.statusMessage);

    // Вывод IP-адреса и порта удаленного сервера
    console.log('IP-адрес удаленного сервера:', res.socket.remoteAddress);
    console.log('Порт удаленного сервера:', res.socket.remotePort);

    // Чтение данных из ответа, если необходимо
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Обработка завершения запроса
    res.on('end', () => {
        console.log('Данные ответа:', data);
    });
});

// Обработка ошибок запроса
req.on('error', (error) => {
    console.error('Ошибка запроса:', error.message);
});

// Завершение запроса
req.end();
