const url = require('url');
const fs = require('fs');
const {HttpCode200, write404} = require("../util/statusCodes");
const {write400} = require("../util/statusCodes");

const endpoints =
[
    '/api/faculties',
    '/api/pulpits',
    '/api/subjects',
    '/api/auditoriumstypes',
    '/api/auditoriums',
    '/api/teachers',
];

const subjectsByFacultyRegex = /\/api\/faculty\/[a-zA-Z0-9а-яА-Я\s]+\/subjects/;
const auditoriumsByTypeRegex = /\/api\/auditoriumtypes\/[a-zA-Z0-9а-яА-Я\s-]+\/auditoriums/;

module.exports = async (req, res, db) => {
    const decodedUrl = decodeURI(req.url);
    let endpoint = url.parse(decodedUrl).pathname;
    let result;
    endpoint = endpoint.replace(/%20/g, ' ');


    if (endpoint === '/') {
        res.end(fs.readFileSync('./views/api_teachers.html'));
        return;
    }

    if (endpoints.includes(endpoint)) {
        try {
            result = await db.executeDBQuery(`GET: ${endpoint}`);
            if (result.length !== 0)
                HttpCode200(res, result);
            else
                write404(res, "Not found");
        } catch (e) {
            console.log(e);
            write400(res, e);
        }
        return;
    }

    if (subjectsByFacultyRegex.test(endpoint)) {
        const facultyName = endpoint.split('/')[3];
        try {
            result = await db.executeDBQuery("GET: /api/faculty/subjects", facultyName);
            if (result.length !== 0)
                HttpCode200(res, result);
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
            result = await db.executeDBQuery("GET: /api/auditoriumtype/auditoriums", auditoriumTypeName);

            if (result.length !== 0)
                HttpCode200(res, result);
            else
                write404(res, "Not found");

        } catch (err) {
            write400(res, err);
        }
        return;
    }

    write400(res, 'Not found');

};

