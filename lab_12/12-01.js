const {createClient} = require("redis");
const client = createClient();

client.on("error", err => console.log('Redis  Client Error', err));

client.connect().then(r => console.log("Connected"));


