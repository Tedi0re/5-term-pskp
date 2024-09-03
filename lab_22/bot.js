const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const token = '7081525819:AAEoI3BG9nHtmLuvaY7jOPTBgniW4FYV1mg';
const weatherApiKey = 'c7f6ee8d23ce6d1074e9b71bd025dbcf';
const catApiKey = 'live_Rzq4PzXNSIn3HGpZ55X8fI0m0rc7dfnEkkgUhbStn470yTJnAeOzOxmcRepWR1Kv';


const bot = new TelegramBot(token, {polling: true});
bot.setMyCommands([
        { command: '/start', description: 'Старт' },
        { command: '/weather', description: 'Получить информацию о погоде' },
        { command: '/help', description: 'Получить информацию о боте' },
        { command: '/joke', description: 'Получить шутку' },
        { command: '/cat', description: 'Получить кота' },
        { command: '/subscribe', description: 'Подписаться на рассылку фактов' },
        { command: '/unsubscribe', description: 'Отписаться от рассылки фактов' },
]);
const subscriberFile = path.join(__dirname, 'subscribers.json');
let subscribers = [];
if (fs.existsSync(subscriberFile)) {
        subscribers = JSON.parse(fs.readFileSync(subscriberFile));
}

function saveSubscribers() {
        fs.writeFileSync(subscriberFile, JSON.stringify(subscribers));
}



bot.onText(/\/subscribe/, (msg) => {
        const chatId = msg.chat.id;

        if (!subscribers.includes(chatId)) {
                subscribers.push(chatId);
                saveSubscribers();
                bot.sendMessage(chatId, 'Вы подписались на ежедневную рассылку случайных фактов.');
        } else {
                bot.sendMessage(chatId, 'Вы уже подписаны на рассылку.');
        }
});

bot.onText(/\/unsubscribe/, (msg) => {
        const chatId = msg.chat.id;

        const index = subscribers.indexOf(chatId);
        if (index > -1) {
                subscribers.splice(index, 1);
                saveSubscribers();
                bot.sendMessage(chatId, 'Вы отписались от рассылки случайных фактов.');
        } else {
                bot.sendMessage(chatId, 'Вы не подписаны на рассылку.');
        }
});

cron.schedule('* * * * *', async () => {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=ru');

        const fact = response.data.text;

        for (const chatId of subscribers) {
                bot.sendMessage(chatId, `Ежедневный факт: ${fact}`);
        }
});



bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendSticker(chatId, 'CAACAgIAAxkBAAIBpGY0b55esL4_y-jMbga89FcZWDMhAAIkFgAC2zTIS6PNJqlnz6JjNAQ');
});

bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, 'Список команд:\n' +
            '/start - Запуск бота\n' +
            '/help - Получить помощь\n' +
            '/weather - Погода\n' +
            '/cat - Котики\n' +
            '/joke -Шутка\n' +
            '/subscribe - Подписаться на ежедновое уведомление\n' +
            '/unsubscribe - отписаться от ежедневного уведомления\n');
});

bot.onText(/\/joke/, async (msg) => {
        const chatId = msg.chat.id;

        try {
                // Получаем случайную шутку из Official Joke API
                const response = await axios.get('https://official-joke-api.appspot.com/random_joke');

                const joke = response.data;
                const jokeText = `${joke.setup}\n${joke.punchline}`;

                bot.sendMessage(chatId, jokeText);
        } catch (error) {
                console.error('Ошибка при получении шутки:', error);
                bot.sendMessage(chatId, 'Не удалось получить шутку. Попробуйте позже.');
        }
});

bot.onText(/\/cat/, async (msg) => {
        const chatId = msg.chat.id;

        try {
                // Получаем случайное изображение кота из The Cat API
                const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
                        headers: {
                                'x-api-key': catApiKey, // Используем API-ключ, если требуется
                        },
                });

                const catImage = response.data[0].url; // URL изображения кота

                bot.sendPhoto(chatId, catImage); // Отправляем изображение кота
        } catch (error) {
                console.error('Ошибка при получении изображения кота:', error);
                bot.sendMessage(chatId, 'Не удалось получить изображение кота. Попробуйте позже.');
        }
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const city = match[1]; // Название города из команды

        try {
                // Получаем данные о погоде из OpenWeatherMap
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
                );

                const weatherData = response.data;
                const temperature = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const pressure = weatherData.main.pressure;
                const windSpeed = weatherData.wind.speed;
                const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
                const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
                const dayLength = ((weatherData.sys.sunset - weatherData.sys.sunrise) / 3600).toFixed(2);

                // Формируем сообщение с информацией о погоде
                const weatherInfo = `
    Погода в ${city}:
    - Температура: ${temperature}°C
    - Влажность: ${humidity}%
    - Давление: ${pressure} hPa
    - Скорость ветра: ${windSpeed} м/с
    - Восход: ${sunrise}
    - Закат: ${sunset}
    - Продолжительность дня: ${dayLength} часов
    `;

                bot.sendMessage(chatId, weatherInfo);
        } catch (error) {
                console.error('Ошибка при получении данных о погоде:', error);
                bot.sendMessage(chatId, `Не удалось получить данные о погоде для города: ${city}`);
        }
});

bot.onText(/.*/, (msg) => {
        const chatId = msg.chat.id;

        if (/А/.test(msg.text)) {
                bot.sendMessage(chatId, 'Б');

        } else if(/Привет/.test(msg.text)) {
                bot.sendMessage(chatId, 'Привет!!!!');
        }

        else if (!/^\/.*/.test(msg.text)) {
                bot.getChat(chatId).then(chatInfo => {
                        console.log(chatInfo.username + ': ' + msg.text);
                        bot.sendMessage(chatId, msg.text); // Эхо-ответ
                });
        }
});

bot.on('sticker', (msg) => {
        const chatId = msg.chat.id;
        const sticker = msg.sticker;
        bot.getChat(chatId).then(chatInfo=>{
                console.log(chatInfo.username + ': '+ sticker.file_id);
                bot.sendSticker(chatId, sticker.file_id);
        })

});



bot.on("polling_error", console.log);

