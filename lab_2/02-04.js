const http = require('http');
const fs = require('fs');

const PORT = 5001;

http.createServer((req, res)=>{
    console.log("02-04 request");
     if(req.url === "/xmlhttprequest"){
         res.setHeader("Content-Type", "text/html");

         fs.readFile("./xmlhttprequest.html", (err, data)=>{
             if(err) {
                 console.log(err);
                 res.statusCode = 500;
                 res.end();
             } else {
                 res.statusCode = 200;
                 res.write(data)
                 res.end();
             }
         });
     } else {
         res.statusCode = 404;
         res.end();
     }
}).listen(PORT,'localhost', (err)=>{
    err ? console.log(err) : console.log(`Listening port ${PORT}`);
})