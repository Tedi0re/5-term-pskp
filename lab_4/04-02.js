const http = require('http');
const url = require('url');
const fs = require('fs');
let data = require('./DB.js');

const PORT = 5000;

let db = new data.DB();

db.on('GET', (req, res)=>{
    console.log('DB.GET');
    res.end(JSON.stringify(db.get()));
});


    db.on('POST', (req, res)=>{
        console.log('DB.POST');
        req.on('data', data=>{
            try{
                let r = JSON.parse(data);
                db.post(r);
                res.end(JSON.stringify(r));
            }catch (error){
                console.log(error);
                if (error.message === "POST: Duplicate id!") {
                    res.statusCode = 400;
                } else if (error.message === "POST: void id!") {
                    res.statusCode = 400;
                } else {
                    res.statusCode = 500;
                }
                res.end()
            }
        })

    });



    db.on('PUT', (req, res)=>{
        console.log('DB.PUT');
        req.on('data', data=>{
            try{
                let r = JSON.parse(data);
                db.put(r);
                res.end(JSON.stringify(r));
            } catch (error){
                console.log(error);
                res.statusCode = 400;
                res.end()
            }
        })

    });




    db.on('DELETE', (req, res)=>{
        console.log('DB.DELETE');
        req.on('data', data=>{
            try{
            let r = JSON.parse(data);
            res.end(JSON.stringify(db.delete(r)));
            }catch (error){
                console.log(error);
                res.statusCode = 400;
                res.end()
            }
        })

    });

db.on('error', error=>{
    console.log(error.message);
});





http.createServer((req, res)=>{
    if(url.parse(req.url).pathname === '/'){
        let html = fs.readFileSync('./04-02.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(html);
    }
    else if(url.parse(req.url).pathname === '/api/db'){
        try{
            db.emit(req.method, req, res);
        }
        catch (error){
            console.log(error.message);
        }
    }
}).listen(PORT, 'localhost', (err)=>{
   err ? console.log(err) : console.log('http://localhost:5000/')
});