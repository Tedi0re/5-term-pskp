const url = require('url');
const Database = require('./../db')
const {write400, write202: write200, write404} = require("./../response");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums'
]


module.exports = async (req, res, db) => {

    let endpoint = decodeURI(url.parse(req.url).pathname);

    let endpointParams = endpoint.split('/');

    if (endpointParams.length !== 4)
        return write400(res, "Wrong endpoint");

    const code = endpointParams[3];

    const endpointWithoutCode = `/${endpointParams[1]}/${endpointParams[2]}`;

    if (endpoints.includes(endpointWithoutCode)) {
        try {
            const result = await db.executeQueryByEndpoint(`DELETE: ${endpointWithoutCode}`, code);

            console.log(result);
            if (result.recordset.length > 0)
                write200(res, result.recordset);
            else
                write404(res, "Not found");
        } catch (e) {
            write400(res, e.message);
        }
        return;
    }
    write400(res, 'Not found');
};

