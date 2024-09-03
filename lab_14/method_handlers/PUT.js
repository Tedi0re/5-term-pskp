const url = require('url');


const {write400, HttpCode200, write404} = require("../util/statusCodes");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums',
    '/api/teachers'
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
                const result = await db.executeDBQuery(`PUT: ${endpoint}`, data_json);
                if (result.length === 0)
                    write404(res, 'Not found');
                else
                    HttpCode200(res, result);

            } catch (e) {
                write400(res, e.message);
            }
        });
        return;
    }
    write400(res, 'Not found');
}

