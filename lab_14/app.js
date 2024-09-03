const http = require('http');

const getHandler = require('./method_handlers/GET');
const postHandler = require('./method_handlers/POST');
const putHandler = require('./method_handlers/PUT');
const deleteHandler = require('./method_handlers/DELETE');

const {DatabaseModel} = require("./model");
const DataBaseHandler = new DatabaseModel();

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
}).listen(3000,async (err)=>{
    err === undefined? console.log('http://localhost:3000/') : console.log(err);
     await DataBaseHandler.transaction();
});

