const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res)=>{
    console.log('Server 2 request');

    let text = '';

    for(key in req){
        if(typeof(req[key]) != "object")
            text += `<p>${key}: ${req[key]}</p>`;
    }

    if (req.method === "POST") {
        let data = "";

        req.on("data", chunk => {
            data += chunk;
        });

        req.on("end", () => {
            text += `<h1>${data}</h1>`;

            res.setHeader('Content-Type', 'text/html');
            res.write(text);
            res.end();
        });
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.write(text);
        res.end();
    }

});

server.listen(PORT, 'localhost', (error)=>{
    error ? console.log(`error: ${error}`) : console.log(`listening port ${PORT}`);
})