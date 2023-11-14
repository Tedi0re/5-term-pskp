const http = require('http');
const url = require('url');

const PORT = 5000;

const filterNumber = function (value) {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
        return numericValue;
    }
    return NaN;
};


const server = http.createServer(async (req, res) => {
    if(req.method === 'POST'){
        let body = '';
        req.on('data', (chunk)=>{
            body += chunk.toString();
        });

        await new Promise((resolve)=>{
            req.on('end', resolve);
        })

        body = JSON.parse(body);

        let answer = {
            __comment:body.__comment,
            x_plus_y:body.x + body.y,
            Concatination_s_o: `${body.s} ${body.o.surname}, ${body.o.name}`,
            Length_m:body.m.length
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(JSON.stringify(answer));
    } else {
        res.writeHead(405, {'Allow':'POST'});
    }
    res.end();
});

server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
})
