const {createClient} = require("redis");
const clientSubscriber = createClient();
const clientPublisher = createClient();

clientPublisher.connect().then(r=>{
    let counter = 1;
    setInterval(()=>{
        clientPublisher.publish('messages', `Message ${counter}`);
        counter++;
    },1000);
    // setInterval(()=>{
    //     clientPublisher.publish('messages1', `Message ${counter}`);
    //     counter++;
    // },3000);
});


clientSubscriber.connect();

clientSubscriber.pSubscribe('messages*',(message, channel)=>{
    console.log(`${channel}: ${message}` );
},true);




