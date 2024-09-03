const url = require('url');
const {write400, write202, write404} = require("./../response");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums'
]


module.exports = (req, res, db) => {

    let endpoint = url.parse(req.url).pathname;
    let data_json = '';

    if (endpoints.includes(endpoint)) {

        req.on('data', chunk => {
            data_json += chunk;
        });
        req.on('end', async () => {

            console.log(data_json);
            data_json = JSON.parse(data_json);
            try {
                const result = await db.executeQueryByEndpoint(`PUT: ${endpoint}`, data_json);


                if (result.recordset.length === 0)
                    write404(res, 'Not found');
                else
                    write202(res, result.recordset);
            } catch (e) {
                write400(res, e.message);
            }
        });
        return;
    }
    write400(res, 'Not found');
}

