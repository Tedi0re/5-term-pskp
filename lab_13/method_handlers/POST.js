const url = require('url');

const {write400, HttpCode200} = require("../util/statusCodes");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums',
    '/api/teachers',
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
                const result = await db.executeDBQuery(`POST: ${endpoint}`, data_json);
                HttpCode200(res, [result.dataValues]);
            } catch (e) {
                console.log(e);
                write400(res, e.message);
            }
        });
        return;
    }
    write400(res, 'Endpoint Not found');
};
