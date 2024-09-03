const url = require('url');
const {write400, HttpCode200: write200, write404} = require("../util/statusCodes");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums',
    '/api/teachers'
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
            const result = await db.executeDBQuery(`DELETE: ${endpointWithoutCode}`, code);

            console.log(result);
            if (result.length === 0) {
                write404(res, "Not found");
            } else {
                write200(res, result);
            }
        } catch (e) {
            write400(res, e.message);
        }
        return;
    }
    write400(res, 'Not found');
};

