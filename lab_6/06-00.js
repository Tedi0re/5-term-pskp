const http = require('http');
const url = require('url');
const fs = require('fs');
const xmldoc = require('xmldoc');
const buffer = require("buffer");
const multiParty = require('multiparty');

const PORT = 5000;

const filterNumber = function (value) {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
        return numericValue;
    }
    return NaN;
};


const server = http.createServer(async (req,res)=>{
    console.log(url.parse(req.url).pathname);

    switch (url.parse(req.url).pathname) {
        case '/connection':{
            if(req.method === "GET"){
                let keepAliveTimeout = url.parse(req.url,true).query.set;

                if(typeof keepAliveTimeout === "undefined"){
                    if(Object.keys(url.parse(req.url,true).query).length === 0){
                        res.writeHead(200,{'Content-Type' : 'text/plain' });
                        res.write(JSON.stringify(server.keepAliveTimeout));
                        setTimeout(()=>{res.end()}, 5000);
                    } else{
                        res.statusCode = 400;
                    }
                }
                else{
                    keepAliveTimeout = Math.floor(filterNumber(keepAliveTimeout));
                    console.log(keepAliveTimeout);
                    if(!isNaN(keepAliveTimeout)){
                        server.keepAliveTimeout = keepAliveTimeout;
                        res.writeHead(200,{'Content-Type' : 'text/plain' });
                        res.write('new keepAliveTimeout:' + JSON.stringify(server.keepAliveTimeout));
                    }
                    else{
                        res.statusCode = 400;
                    }
                }
            } else{
                res.writeHead(405,{'Allow' : 'GET' });
            }
            res.end();
            break;
        }
        case '/headers':{
            if(req.method === "GET"){
                if(Object.keys(url.parse(req.url,true).query).length === 0){
                const reqHeaders = req.headers;
                res.setHeader('Custom-Header', 'SomeValue');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write('Request Headers:\n');
                res.write(JSON.stringify(reqHeaders, null, 1));
                res.write('\n\nResponse Headers:\n');
                res.write(JSON.stringify(res.getHeaders(), null,1));
                }
                else{
                    res.statusCode = 400;
                }

            }else{
                res.writeHead(405,{'Allow' : 'GET' });
            }
            res.end();
            break;
        }
        case '/parameter':{
            if(req.method === "GET"){
                if(Object.keys(url.parse(req.url,true).query).length === 2){
                    let x = filterNumber(url.parse(req.url,true).query.x);
                    let y = filterNumber(url.parse(req.url,true).query.y);
                    if(!isNaN(x) && !isNaN(y)){
                        res.writeHead(200, {"Content-Type":"text/plain"});
                        res.write(`x + y = ${x + y}\nx - y = ${x - y}\nx * y = ${x*y}\nx / y = ${x / y}`);
                    }
                    else{
                        res.writeHead(400, {"Content-Type":"text/plain"});
                        res.write("Error!");
                    }
                }
                else{
                    res.writeHead(400, {"Content-Type":"text/plain"});
                    res.write("Error!");
                }
            } else{
                res.writeHead(405,{'Allow' : 'GET' });
            }
            res.end();
            break;
        }

        case '/socket':{
            if(req.method === "GET"){
                if(Object.keys(url.parse(req.url,true).query).length === 0) {
                    const clientIp = req.connection.remoteAddress;
                    const clientPort = req.connection.remotePort;
                    const serverIp = req.connection.localAddress;
                    const serverPort = req.connection.localPort;

                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(`<h1>Client IP: ${clientIp}</h1>`);
                    res.write(`<h1>Client Port: ${clientPort}</h1>`);
                    res.write(`<h1>Server IP: ${serverIp}</h1>`);
                    res.write(`<h1>Server Port: ${serverPort}</h1>`);
                }
                else{
                    res.statusCode = 400;
                }
            } else{
                res.writeHead(405,{'Allow' : 'GET' });
            }

            res.end();
            break;
        }
        case '/resp-status':{
            if(req.method === "GET"){
                let statusCode = Math.floor(filterNumber(url.parse(req.url, true).query.code));
                let message = url.parse(req.url,true).query.mess;
                if(!isNaN(statusCode) && typeof message !== "undefined"){

                    res.writeHead(statusCode, {"Content-Type":"text/plain"});
                    res.write(statusCode +": " + message);
                } else{
                    res.statusCode = 400;
                }
            } else{
                res.writeHead(405,{'Allow' : 'GET' });
            }

            res.end();
            break;
        }
        case '/formparameter':{
            if(req.method === "GET"){
                res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"})
                res.write(fs.readFileSync('./06-07.html'));
            } else if(req.method === "POST"){
                let body = '';
                req.on('data', (chunk)=>{
                    body += chunk.toString();
                });

                let formData = "";
                let text = "";
                let number = "";
                let date = "";
                let checkbox = "";
                let gender = "";
                let textarea = "";

                await new Promise((resolve)=>{
                    req.on('end', resolve);
                })

                formData = new URLSearchParams(body);

                text = formData.get('text');
                number = formData.get('number');
                date = formData.get('date');
                checkbox = formData.get('checkbox');
                gender = formData.get('gender');
                textarea = formData.get('textarea');

                if(checkbox === null){
                    checkbox = "off";
                }

                if( (typeof text     !== "undefined" && text.trim()     !== "") &&
                    (typeof number   !== "undefined" && number.trim()   !== "") &&
                    (typeof date     !== "undefined" && date.trim()     !== "") &&
                    (typeof checkbox !== "undefined" && checkbox.trim() !== "") &&
                    (typeof gender   !== "undefined" && gender.trim()   !== "")
                    &&
                    (typeof textarea !== "undefined" && textarea.trim() !==""))
                {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.write(`<p>Текст: ${text}</p>
                               <p>Число: ${number}</p>
                               <p>Дата: ${date}</p>
                               <p>Флажок: ${checkbox}</p>
                               <p>Пол: ${gender}</p>
                               <p>Комментарий: ${textarea}</p>`);
                    res.end();
                }else{
                    res.writeHead(449, { 'Ms-Echo-Request': '' });
                    res.end();
                }
            } else {
                res.writeHead(405,{'Allow' : 'GET,POST' });
            }
            res.end();
            break;
        }
        case '/json':{
            if(req.method === "POST"){
                let body = '';
                req.on('data', (chunk)=>{
                    body += chunk.toString();
                });

                await new Promise((resolve)=>{
                    req.on('end', resolve);
                })
                body = JSON.parse(body);

                let answer ={
                    __comment:body.__comment,
                    x_plus_y:body.x + body.y,
                    Concatination_s_o: `${body.s} ${body.o.surname}, ${body.o.name}`,
                    Length_m:body.m.length
                }

                res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
                res.write(JSON.stringify(answer));
            } else{
                res.writeHead(405,{'Allow' : 'POST' });
            }
            res.end();
            break;
        }
        case '/xml':{
            if(req.method === "POST"){
                let body = '';
                req.on('data', (chunk)=>{
                    body += chunk.toString();
                });

                await new Promise((resolve)=>{
                    req.on('end', resolve);
                });
                console.log(body);
                body = new xmldoc.XmlDocument(body);
                 let m_arr = body.childrenNamed("m");
                 let x_arr = body.childrenNamed("x");
                 let m_concat = "";
                 let x_sum = 0;

                 for (const mArrElement of m_arr) {
                    m_concat += mArrElement.attr.value;
                 }
                 for (const xArrElement of x_arr) {
                    x_sum +=parseInt(xArrElement.attr.value);
                 }

                 let answer = `` +
                     `<response id=\"${Math.floor(Math.random()*100)}\" request = \"${body.attr.id}\">\n`+
                     `\t<sum element = \"x\" result = \"${x_sum}\"/>\n`+
                     `\t<concat element = \"m\" result = \"${m_concat}\"/>\n`+
                     `</response>`;
                res.writeHead(200, {"Content-Type":"application/xml; charset=utf-8"});
                res.write(answer);
            }else{
                res.writeHead(405,{'Allow' : 'POST' });
            }
            res.end();
            break;
        }
        case '/files':{
            if(req.method === "GET"){
                const directoryPath = './static';
                const files =  fs.readdirSync(directoryPath);
                let fileCount = 0;
                for (const file of files) {
                    fileCount++;
                }
                res.setHeader("static-files-count",`${fileCount}`);
                res.statusCode = 200;
            } else{
                res.writeHead(405,{'Allow' : 'GET' });
            }
            res.end();
            break;
        }
        case '/upload':{
            if(req.method === "GET"){
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
                res.write(fs.readFileSync("./06-12.html"))
            } else if(req.method === "POST"){
                let form = new multiParty.Form({ uploadDir: './static' });
                form.on('file', (name, file) => {
                    console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
                });
                form.on('error', err => { res.end(`<h1>form returned error: ${err}</h1>`) });
                form.on('close', () => {
                    res.end('<h1>File successfully uploaded.</h1>');
                });
                form.parse(req);
            }
            else{
                res.writeHead(405,{'Allow' : 'GET,POST' });
            }
            res.end();
            break;
        }
        default: {
            if(req.method === "GET"){
                if((url.parse(req.url).pathname).includes("/parameter/")){
                    let params = (url.parse(req.url).pathname).split("/");
                    if(params.length === 4){
                        let x = filterNumber(params[2]);
                        let y = filterNumber(params[3]);
                        if( !isNaN(x) && !isNaN(y)){
                            res.writeHead(200, {"Content-Type":"text/plain"});
                            res.write(`x + y = ${x + y}\nx - y = ${x - y}\nx * y = ${x*y}\nx / y = ${x / y}`);

                        }else{
                            res.writeHead(200, {"Content-Type":"text/plain"});
                            res.write(`http://localhost:${PORT}${req.url}`);
                        }
                    }
                    else{
                        res.statusCode = 404;
                    }
                }else if((url.parse(req.url).pathname).includes("/files/")){
                    const directoryPath = './static';
                    const filename = url.parse(req.url).pathname.split('/')[2].trim();
                    const files =  fs.readdirSync(directoryPath);
                    for (const file of files) {
                        if(file === filename){
                            res.writeHead(200, {"Content-Type":"application/octet-stream"})
                            res.write(fs.readFileSync(directoryPath + '/' + file));
                        }
                    }
                    res.statusCode = 404;
                }
                else{
                    res.statusCode = 404;
                }
            }
            else{
                res.writeHead(405,{'Allow' : 'GET' });
            }

            res.end();
        }
    }
});

server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log('http://localhost:5000/');
})

