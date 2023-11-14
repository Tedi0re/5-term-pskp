const http = require('http');

const PORT = 5000;

const server = http.createServer((req, res) => {
   if(req.method === 'GET'){
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.write('Привет, это ответ сервера на GET-запрос!');
   } else {
       res.writeHead(405, {'Allow':'GET'});
   }
   res.end();

});

server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
})
