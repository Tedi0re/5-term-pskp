const {createClient} = require("redis");
const repl = require("repl");
const client = createClient();

client.on("error", err => console.log('Redis  Client Error', err));

const TOTAL_OPERATIONS = 10000;

function runSetOperations() {
    console.time('Set Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.set(`${i}`, `set${i}`);}
    console.timeEnd('Set Operations');
}

function runGetOperations() {
    console.time('Get Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.get(`${i}`);
        // client.get(`${i}`).then((reply)=>{
        //     console.log(reply);
        // });
    }
    console.timeEnd('Get Operations');
}

function runDelOperations() {
    console.time('Del Operations');
    for (let i = 0; i < TOTAL_OPERATIONS; i++) {
        client.del(`${i}`);}
    console.timeEnd('Del Operations');
}

client.connect().then(r =>{

 console.log("Connected");
 runSetOperations();
 runGetOperations();
 runDelOperations();
}).then(()=>{
    console.log("Disconnected");
    client.quit();
});
