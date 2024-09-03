const createClient = require('redis').createClient

const redis = createClient({
    host: 'localhost',
    port: 6379
});

 redis.connect();

module.exports = redis;