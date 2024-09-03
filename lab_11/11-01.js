const http = require('http');

const getHandler = require('./handlers/getHandler');
const postHandler = require('./handlers/postHandler');
const putHandler = require('./handlers/putHandler');
const deleteHandler = require('./handlers/deleteHandler');

const Database = require("./db");
const DataBaseHandler = new Database();

http.createServer(async (req, res) => {

    switch (req.method) {
        case 'GET':
            await getHandler(req, res, DataBaseHandler);
            break;
        case 'POST':
            await postHandler(req, res,DataBaseHandler);
            break;
        case 'PUT':
            await putHandler(req, res,DataBaseHandler);
            break;
        case 'DELETE':
            await deleteHandler(req, res, DataBaseHandler);
            break;
    }
}).listen(3000, ()=>{
     console.log('http://localhost:3000');
});