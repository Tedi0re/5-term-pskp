const {send} = require('../lab_5_1')

try{
   console.log(send("simonovandrej522@gmail.com", "otycblfqlygpziud", "321"))
}catch (e){
    console.log(e.message);
}
