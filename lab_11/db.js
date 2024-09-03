const sql = require('mssql');

const config = {
    pool: {
        max: 10,
        min: 0,
    },
    user: 'Andrey',
    password: '12345',
    port: 1433,
    server: 'localhost',
    database: 'SAA',
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
        caseSensitive: true,
    }
};

class Database {
    constructor() {
        this.connectionPool = new sql.ConnectionPool(config);
    }

    async getConnection(){
        return await this.connectionPool.connect();
    }

    async executeQueryByEndpoint(endpointWithMethod, data) {
        switch (endpointWithMethod) {
            case 'GET: /api/faculties':
                return await this.getFaculties();
            case 'GET: /api/pulpits':
                return await this.getPulpits();
            case 'GET: /api/subjects':
                return await this.getSubjects();
            case 'GET: /api/auditoriumstypes':
                return await this.getAuditoriumsTypes();
            case 'GET: /api/auditoriums':
                return await this.getAuditoriums();
            case "GET: /api/faculty/pulpits":
                return await this.getPulpitsByFaculty(data);
            case "GET: /api/auditoriumtype/auditoriums":
                return await this.getAuditoriumsByType(data);

            case 'POST: /api/faculties':
                return await this.postFaculties(data);
            case 'POST: /api/pulpits':
                return await this.postPulpits(data);
            case 'POST: /api/subjects':
                return await this.postSubjects(data);
            case 'POST: /api/auditoriumstypes':
                return await this.postAuditoriumsTypes(data);
            case 'POST: /api/auditoriums':
                return await this.postAuditoriums(data);

            case 'PUT: /api/faculties':
                return await this.putFaculties(data);
            case 'PUT: /api/pulpits':
                return await this.putPulpits(data);
            case 'PUT: /api/subjects':
                return await this.putSubjects(data);
            case 'PUT: /api/auditoriumstypes':
                return await this.putAuditoriumsTypes(data);
            case 'PUT: /api/auditoriums':
                return await this.putAuditoriums(data);

            case 'DELETE: /api/faculties':
                return await this.deleteFaculties(data);
            case 'DELETE: /api/pulpits':
                return await this.deletePulpits(data);
            case 'DELETE: /api/subjects':
                return await this.deleteSubjects(data);
            case 'DELETE: /api/auditoriumstypes':
                return await this.deleteAuditoriumsTypes(data);
            case 'DELETE: /api/auditoriums':
                return await this.deleteAuditoriums(data);


            default:
                return Promise.reject('Not found');
        }
    }


    async getFaculties() {
        const connection = await this.getConnection();
        return await connection.request().query('SELECT * FROM FACULTY');
    }

    async getPulpits() {
        const connection = await this.getConnection();
        return await connection.request().query('SELECT * FROM PULPIT');
    }

    async getSubjects() {
        const connection = await this.getConnection();
        return await connection.request().query('SELECT * FROM SUBJECT');
    }

    async getAuditoriumsTypes() {
        const connection = await this.getConnection();
        return await connection.request().query('SELECT * FROM AUDITORIUM_TYPE');
    }

    async getAuditoriums() {
        const connection = await this.getConnection();
        return await connection.request().query('SELECT * FROM AUDITORIUM');
    }

    async getPulpitsByFaculty(data) {
        const connection = await this.getConnection();
        const faculty = data;
        return await connection.request().query`SELECT *
                                                         FROM PULPIT
                                                         WHERE FACULTY = ${faculty}`;
    }

    async getAuditoriumsByType(data) {
        const connection = await this.getConnection();
        const auditoriumType = data;
        console.log(auditoriumType);
        return await connection.request().query`SELECT *
                                                         FROM AUDITORIUM
                                                         WHERE AUDITORIUM_TYPE = ${auditoriumType}`;
    }


    async postFaculties(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        // Обращаемся к первому элементу массива, если он существует
        const faculty = data.FACULTY;
        const faculty_name = data.FACULTY_NAME;

        console.log('Faculty:', faculty);
        console.log('Faculty Name:', faculty_name);

        return await connection
            .request()
            .input('FACULTY', sql.NVarChar, faculty)
            .input('FACULTY_NAME', sql.NVarChar, faculty_name)
            .query('INSERT FACULTY(FACULTY, FACULTY_NAME) OUTPUT INSERTED.* VALUES(@faculty, @faculty_name)');
    }

    async postPulpits(data) {  //dddddddddddddddddddddddddddddddddddddddddddddddd//
        const connection = await this.getConnection();
        console.log('===========================================');
        console.log(data);
        console.log('===========================================');
        const pulpit = data.PULPIT;
        const pulpit_name = data.PULPIT_NAME;
        const faculty = data.FACULTY;

        console.log(pulpit);
        console.log('===========================================');

        return await connection.request()
            .input('PULPIT', sql.NVarChar, pulpit)
            .input('PULPIT_NAME', sql.NVarChar, pulpit_name)
            .input('FACULTY', sql.NVarChar, faculty)
            .query('INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) OUTPUT INSERTED.* VALUES(@pulpit, @pulpit_name, @faculty)')
    }

    async postSubjects(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const subject = data.SUBJECT;
        const subject_name = data.SUBJECT_NAME;
        const pulpit = data.PULPIT;

        console.log('Subject:', subject);
        console.log('Subject Name:', subject_name);
        console.log('Pulpit:', pulpit);

        return await connection.request()
            .input('SUBJECT', sql.NVarChar, subject)
            .input('SUBJECT_NAME', sql.NVarChar, subject_name)
            .input('PULPIT', sql.NVarChar, pulpit)
            .query('INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) OUTPUT INSERTED.*  VALUES(@subject, @subject_name, @pulpit) ');
    }

    async postAuditoriums(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const auditorium = data.AUDITORIUM;
        const auditorium_name = data.AUDITORIUM_NAME;
        const auditorium_type = data.AUDITORIUM_TYPE;
        const auditorium_capacity = data.AUDITORIUM_CAPACITY;

        console.log('Auditorium:', auditorium);
        console.log('Auditorium Name:', auditorium_name);
        console.log('Auditorium Type:', auditorium_type);
        console.log('Auditorium Capacity:', auditorium_capacity);

        return await connection.request()
            .input('AUDITORIUM', sql.NVarChar, auditorium)
            .input('AUDITORIUM_NAME', sql.NVarChar, auditorium_name)
            .input('AUDITORIUM_TYPE', sql.NVarChar, auditorium_type)
            .input('AUDITORIUM_CAPACITY', sql.Int, auditorium_capacity)
            .query('INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY) OUTPUT INSERTED.* VALUES(@auditorium, @auditorium_name, @auditorium_type, @auditorium_capacity)');
    }

    async postAuditoriumsTypes(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const auditorium_type = data.AUDITORIUM_TYPE;
        const auditorium_typename = data.AUDITORIUM_TYPENAME;

        console.log('Auditorium Type:', auditorium_type);
        console.log('Auditorium Type Name:', auditorium_typename);

        return await connection.request()
            .input('AUDITORIUM_TYPE', sql.NVarChar, auditorium_type)
            .input('AUDITORIUM_TYPENAME', sql.NVarChar, auditorium_typename)
            .query('INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) OUTPUT INSERTED.* VALUES(@auditorium_type, @auditorium_typename)');
    }


    async putFaculties(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const faculty = data.FACULTY;
        const faculty_name = data.FACULTY_NAME;

        console.log('Faculty:', faculty);
        console.log('Faculty Name:', faculty_name);

        return await connection.request()
            .input('FACULTY', sql.NVarChar, faculty)
            .input('FACULTY_NAME', sql.NVarChar, faculty_name)
            .query('UPDATE FACULTY SET FACULTY_NAME = @faculty_name OUTPUT INSERTED.*  WHERE FACULTY = @faculty');
    }

    async putPulpits(data) { //dddddddddddddddddddddddddddddddddddddddddddddddd//
        const connection = await this.getConnection();
        const pulpit = data.PULPIT;
        const pulpit_name = data.PULPIT_NAME;
        const faculty = data.FACULTY;

        return await connection.request()
            .input('PULPIT', sql.NVarChar, pulpit)
            .input('PULPIT_NAME', sql.NVarChar, pulpit_name)
            .input('FACULTY', sql.NVarChar, faculty)
            .query('UPDATE PULPIT SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty OUTPUT INSERTED.* WHERE PULPIT = @pulpit');
    }

    async putSubjects(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const subject = data.SUBJECT;
        const subject_name = data.SUBJECT_NAME;
        const pulpit = data.PULPIT;

        console.log('Subject:', subject);
        console.log('Subject Name:', subject_name);
        console.log('Pulpit:', pulpit);

        return await connection.request()
            .input('SUBJECT', sql.NVarChar, subject)
            .input('SUBJECT_NAME', sql.NVarChar, subject_name)
            .input('PULPIT', sql.NVarChar, pulpit)
            .query('UPDATE SUBJECT SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit OUTPUT INSERTED.* WHERE SUBJECT = @subject');
    }

    async putAuditoriums(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const auditorium = data.AUDITORIUM;
        const auditorium_name = data.AUDITORIUM_NAME;
        const auditorium_type = data.AUDITORIUM_TYPE;
        const auditorium_capacity = data.AUDITORIUM_CAPACITY;

        console.log('Auditorium:', auditorium);
        console.log('Auditorium Name:', auditorium_name);
        console.log('Auditorium Type:', auditorium_type);
        console.log('Auditorium Capacity:', auditorium_capacity);

        return await connection.request()
            .input('AUDITORIUM', sql.NVarChar, auditorium)
            .input('AUDITORIUM_NAME', sql.NVarChar, auditorium_name)
            .input('AUDITORIUM_TYPE', sql.NVarChar, auditorium_type)
            .input('AUDITORIUM_CAPACITY', sql.Int, auditorium_capacity)
            .query('UPDATE AUDITORIUM SET AUDITORIUM_NAME = @auditorium_name, AUDITORIUM_TYPE = @auditorium_type, AUDITORIUM_CAPACITY = @auditorium_capacity OUTPUT INSERTED.* WHERE AUDITORIUM = @auditorium');
    }

    async putAuditoriumsTypes(data) {
        console.log('Received data:', data);

        const connection = await this.getConnection();

        const auditorium_type = data.AUDITORIUM_TYPE;
        const auditorium_typename = data.AUDITORIUM_TYPENAME;

        console.log('Auditorium Type:', auditorium_type);
        console.log('Auditorium Type Name:', auditorium_typename);

        return await connection.request()
            .input('AUDITORIUM_TYPE', sql.NVarChar, auditorium_type)
            .input('AUDITORIUM_TYPENAME', sql.NVarChar, auditorium_typename)
            .query('UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditorium_typename OUTPUT INSERTED.* WHERE AUDITORIUM_TYPE = @auditorium_type');
    }



    async deleteFaculties(code) {
        const connection = await this.getConnection();
        const faculty = code;

        return await connection.request()
            .input('FACULTY', sql.NVarChar, faculty)
            .query('DELETE FROM FACULTY  OUTPUT DELETED.* WHERE FACULTY = @faculty ');
    }

    async deletePulpits(code) {  //dddddddddddddddddddddddddddddddddddddddddddddddd//
        const connection = await this.getConnection();
        const pulpit = code;

        return await connection.request()
            .input('PULPIT', sql.NVarChar, pulpit)
            .query('DELETE FROM PULPIT OUTPUT DELETED.* WHERE PULPIT = @pulpit ');

    }

    async deleteSubjects(code) {
        const connection = await this.getConnection();
        const subject = code;

        return await connection.request()
            .input('SUBJECT', sql.NVarChar, subject)
            .query('DELETE FROM SUBJECT OUTPUT DELETED.*  WHERE SUBJECT = @subject ');

    }

    async deleteAuditoriums(code) {
        const connection = await this.getConnection();
        const auditorium = code;
        console.log(auditorium);
        return await connection.request()
            .input('AUDITORIUM', sql.NVarChar, auditorium)
            .query('DELETE FROM AUDITORIUM  OUTPUT DELETED.* WHERE AUDITORIUM = @auditorium ');

    }

    async deleteAuditoriumsTypes(code) {
        const connection = await this.getConnection();
        const auditorium_type = code;
        return await connection.request()
            .input('AUDITORIUM_TYPE', sql.NVarChar, auditorium_type)
            .query('DELETE FROM AUDITORIUM_TYPE  OUTPUT DELETED.*  WHERE AUDITORIUM_TYPE = @auditorium_type');

    }


}

module.exports = Database;


