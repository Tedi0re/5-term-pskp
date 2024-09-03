const {createClient} = require("redis");
const client = createClient();

client.on("error", err => console.log('Redis  Client Error', err));

const TOTAL_OPERATIONS = 10000;
function runIncrOperations() {
    client.set('incr', 0);
    console.time('Incr Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.incr('incr');}
    console.timeEnd('Incr Operations');
}

function runDecrOperations() {
    console.time('Decr Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.decr('incr');}
    console.timeEnd('Decr Operations');
}

client.connect().then(r =>{

    console.log("Connected");
    runIncrOperations();
    runDecrOperations();
}).then(()=>{
    console.log("Disconnected");
    client.quit();
});