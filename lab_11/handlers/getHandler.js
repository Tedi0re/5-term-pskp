const url = require('url');
const fs = require('fs');
const {write202, write404} = require("./../response");
const {write400} = require("./../response");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums'
];

const pulpitsByFacultyRegex = /\/api\/faculty\/[a-zA-Z0-9а-яА-Я\s]+\/pulpits/;
const auditoriumsByTypeRegex = /\/api\/auditoriumtypes\/[a-zA-Z0-9а-яА-Я\s-]+\/auditoriums/;

module.exports = async (req, res, db) => {
    const decodedUrl = decodeURI(req.url);
    let endpoint = url.parse(decodedUrl).pathname;
    endpoint = endpoint.replace(/%20/g, ' ');


    if (endpoint === '/') {
        res.end(fs.readFileSync('./views/index.html'));
        return;
    }

    if (endpoints.includes(endpoint)) {
        try {
            const result = await db.executeQueryByEndpoint(`GET: ${endpoint}`);
            if (result.recordset.length !== 0)
                write202(res, result.recordset);
            else
                write404(res, "Not found");
        } catch (e) {
            console.log(e);
            write400(res, e);
        }
        return;
    }

    if (pulpitsByFacultyRegex.test(endpoint)) {
        const facultyName = endpoint.split('/')[3];
        try {
            const response = await db.executeQueryByEndpoint("GET: /api/faculty/pulpits", facultyName);
            if (response.recordset.length !== 0)
                write202(res, response.recordset);
            else
                write404(res, "Not found");
        } catch (err) {
            write400(res, err);
        }
        return;
    }

    if (auditoriumsByTypeRegex.test(endpoint)) {
        const auditoriumTypeName = endpoint.split('/')[3];
        try {
            const response = await db.executeQueryByEndpoint("GET: /api/auditoriumtype/auditoriums", auditoriumTypeName);

            console.log(response.recordset);
            if (response.recordset.length !== 0)
                write202(res, response.recordset);
            else
                write404(res, "Not found");

        } catch (err) {
            write400(res, err);
        }
        return;
    }

    write400(res, 'Not found');

};

