const {createClient} = require("redis");
const client = createClient();

client.on("error", err => console.log('Redis  Client Error', err));

const TOTAL_OPERATIONS = 10000;
function runHSetOperations() {
    client.set('incr', 0);
    console.time('HSet Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.hSet(`${i}`, {
            id:i,
            val:`val-${i}`
        });
    }
    console.timeEnd('HSet Operations');
}

function runHGetOperations() {
    console.time('HGet Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.hGet(`${i}`, 'id');
        // client.hGet(`${i}`, 'id').then((reply) => {
        //     console.log(reply);
        // });
    }
    console.timeEnd('HGet Operations');
}

client.connect().then(r =>{
    console.log("Connected");
    runHSetOperations();
    runHGetOperations();
}).then(()=>{
    console.log("Disconnected");
    client.quit();
});