const url = require('url');

const {write400, write202} = require("./../response");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums'
];


module.exports = (req, res, db) => {

    let endpoint = url.parse(req.url).pathname;
    let data_json = '';

    if (endpoints.includes(endpoint)) {

        req.on('data', chunk => {
            data_json += chunk;
        });
        req.on('end', async () => {
            data_json = JSON.parse(data_json);
            try {
                const result = await db.executeQueryByEndpoint(`POST: ${endpoint}`, data_json);    
                write202(res, result.recordset);
            } catch (e) {
                console.log(e);
                write400(res, e.message);
            }
        });
        return;
    }
    write400(res, 'Endpoint Not found');
};

