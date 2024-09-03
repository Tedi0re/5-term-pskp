let Sequelize = require("sequelize");
const sql = require("mssql");
let Model = Sequelize.Model;
class Faculty extends Model {}
class Pulpit extends Model {}
class Teacher extends Model {}
class Subject extends Model {}
class Auditorium_type extends Model {}
class Auditorium extends Model {}

const config = {
    host: 'localhost',
    dialect: 'mssql',
    define: {
        hooks: {
            beforeBulkDestroy: (instance, options) => {console.log('==================before destroy==================');},
        }
    },
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
    },
};

class DatabaseModel{
    constructor() {
        let sequelize = new Sequelize('SAA', 'Andrey','1',config);
        this.createModels(sequelize);
        this.model = {Faculty, Pulpit, Teacher, Subject, Auditorium, Auditorium_type};
        sequelize.authenticate()
            .then(() => {
                return sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED})
                    .then(t => {
                        return this.model.Auditorium.update({ auditorium_capacity: 0 },
                            {where: { auditorium_capacity: { [Sequelize.Op.gte]: 0 } },transaction: t,})
                            .then((r) => {
                                console.log('=======update=======')
                                this.model.Auditorium.findOne({transaction: t,attributes: ["auditorium_capacity"],}).then(r => console.log(r));
                                setTimeout(() => {
                                    console.log('=======rollback=======')
                                    this.model.Auditorium.findOne({attributes: ["auditorium_capacity"],}).then(r => console.log(r))
                                    return t.rollback();
                                }, 10000);
                            })
                    })
            });
    }
    async createModels(sequelize) {
        Faculty.init(
            {
                faculty: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
                faculty_name: {type: Sequelize.STRING, allowNull: false}
            },
            {
                sequelize, modelName: 'Faculty', tableName: 'Faculty', timestamps: false,
                hooks: {
                    beforeCreate(attributes, options) {console.log("===============before Create Faculty===============");},
                    afterCreate(attributes, options) {console.log("===============after Create Faculty===============");}
                }
            }
        );

        Pulpit.init(
            {
                pulpit: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
                pulpit_name: {type: Sequelize.STRING, allowNull: false},
                faculty: {
                    type: Sequelize.STRING, allowNull: false,
                    references: {model: Faculty, key: 'faculty'}
                }
            },
            {sequelize, modelName: 'Pulpit', tableName: 'Pulpit', timestamps: false,
            }
        );
        Teacher.init(
            {
                teacher: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
                teacher_name: {type: Sequelize.STRING, allowNull: false},
                pulpit: {
                    type: Sequelize.STRING, allowNull: false,
                    references: {model: Pulpit, key: 'pulpit'}
                }
            },
            {sequelize, modelName: 'Teacher', tableName: 'Teacher', timestamps: false}
        );

        Subject.init(
            {
                subject: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
                subject_name: {type: Sequelize.STRING, allowNull: false},
                pulpit: {
                    type: Sequelize.STRING, allowNull: false,
                    references: {model: Pulpit, key: 'pulpit'}
                }
            },
            {sequelize, modelName: 'Subject', tableName: 'Subject', timestamps: false}
        );

        Auditorium_type.init(
            {
                auditorium_type: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
                auditorium_typename: {type: Sequelize.STRING, allowNull: false}
            },
            {sequelize, modelName: 'Auditorium_type', tableName: 'Auditorium_type', timestamps: false}
        );

        Auditorium.init(
            {
                auditorium: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
                auditorium_name: {type: Sequelize.STRING, allowNull: false},
                auditorium_capacity: {type: Sequelize.INTEGER, allowNull: false},
                auditorium_type: {
                    type: Sequelize.STRING, allowNull: false,
                    references: {model: Auditorium_type, key: 'auditorium_type'}
                }
            },
            {
                sequelize, modelName: 'Auditorium', tableName: 'Auditorium', timestamps: false,
                scopes:{
                    scope_auditorium(){
                        return{
                            where:{auditorium_capacity: {[Sequelize.Op.between]:[10,60]}}
                        }
                    }
                }
            },
        );
        sequelize.sync({force:false});
    }

    async executeDBQuery(endpointWithMethod, data) {
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
            case "GET: /api/faculty/subjects":
                return await this.getPulpitsByFaculty(data);
            case "GET: /api/auditoriumtype/auditoriums":
                return await this.getAuditoriumsByType(data);
            case 'GET: /api/teachers':
                return await this.getTeachers(data);

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
            case 'POST: /api/teachers':
                return await this.postTeachers(data);

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
            case 'PUT: /api/teachers':
                return await this.putTeachers(data);

            case 'DELETE: /api/faculties':
                return await this.deleteFaculties(data);
            case 'DELETE: /api/pulpits':
                return await this.deletePulpits(data);
            case 'DELETE: /api/subjects':
                return await this.deleteSubjects(data);
            case 'DELETE: /api/auditoriumstypes':
                return await this.deleteAuditoriumsTypes(data);
            case 'DELETE: /api/auditoriums':
                return await this.deleteAuditoriums(data)
            case 'DELETE: /api/teachers':
                return await this.deleteTeachers(data);
            default:
                return Promise.reject('Not found');
        }
    }

    async getFaculties() {
        return await  this.model.Faculty.findAll();
    }

    async getTeachers() {
       return await this.model.Teacher.findAll();
    }

    async getPulpits() {
        return await this.model.Pulpit.findAll();
    }

    async getSubjects() {
        return await this.model.Subject.findAll();
    }

    async getAuditoriumsTypes() {
        return await this.model.Auditorium_type.findAll();
    }

    async getAuditoriums() {
        return  this.model.Auditorium.scope('scope_auditorium').findAll();
    }

    async getPulpitsByFaculty(data) {
        this.model.Faculty.hasMany(this.model.Pulpit, {foreignKey: "faculty",sourceKey: "faculty",});
        this.model.Pulpit.hasMany(this.model.Subject, {foreignKey: "pulpit",sourceKey: "pulpit",});
        return await this.model.Faculty.findAll({where: { faculty: data },
            include: [{
                model: this.model.Pulpit,
                attributes: ["pulpit_name"],
                required: true,
                include: [{model: this.model.Subject, required: true,},],
            },],});
    }

    async getAuditoriumsByType(data) {
        return await this.model.Auditorium.scope('scope_auditorium').findAll({where: {auditorium_type: data},});
    }

    async postFaculties(data) {
        return await this.model.Faculty.create({faculty: data.FACULTY, faculty_name : data.FACULTY_NAME});
    }

    async postTeachers(data) {
        return await this.model.Teacher.create({teacher: data.TEACHER, teacher_name: data.TEACHER_NAME, pulpit:data.PULPIT});
    }

    async postPulpits(data) {
        return await this.model.Pulpit.create({pulpit: data.PULPIT, pulpit_name: data.PULPIT_NAME, faculty: data.FACULTY});
    }

    async postSubjects(data) {
        return await this.model.Subject.create({subject: data.SUBJECT, subject_name: data.SUBJECT_NAME, pulpit: data.PULPIT});
    }

    async postAuditoriums(data) {
        return await this.model.Auditorium.create({auditorium: data.AUDITORIUM, auditorium_name: data.AUDITORIUM_NAME, auditorium_type: data.AUDITORIUM_TYPE, auditorium_capacity: data.AUDITORIUM_CAPACITY});
    }

    async postAuditoriumsTypes(data) {
        return await this.model.Auditorium_type.create({auditorium_type: data.AUDITORIUM_TYPE, auditorium_typename: data.AUDITORIUM_TYPENAME});
    }


    async putFaculties(data) {
        let success = await this.model.Faculty.update({faculty_name: data.FACULTY_NAME}, {where:{faculty: data.FACULTY}});
        if (success.pop() !== 0) return data;
        else return '';
    }

    async putPulpits(data) {
        let success = await this.model.Pulpit.update({pulpit_name: data.PULPIT_NAME, faculty: data.FACULTY}, {where:{pulpit: data.PULPIT}});
        if (success.pop() !== 0) return data;
        else return '';
    }

    async putTeachers(data) {
        let success = await this.model.Teacher.update({teacher_name: data.TEACHER_NAME, pulpit: data.PULPIT}, {where:{teacher: data.TEACHER}});
        if (success.pop() !== 0) return {teacher: data.TEACHER, teacher_name: data.TEACHER_NAME, pulpit: data.PULPIT};
        else return '';
    }

    async putSubjects(data) {
        let success = await this.model.Subject.update({subject_name: data.SUBJECT_NAME, pulpit: data.PULPIT}, {where:{subject: data.SUBJECT}});
        if (success.pop() !== 0) return data;
        else return '';

    }

    async putAuditoriums(data) {
        let success = await this.model.Auditorium.update({auditorium_name: data.AUDITORIUM_NAME, auditorium_type: data.AUDITORIUM_TYPE, auditorium_capacity:data.AUDITORIUM_CAPACITY}, {where:{auditorium: data.AUDITORIUM}});
        if (success.pop() !== 0) return data;
        else return '';
    }

    async putAuditoriumsTypes(data) {
        let success = await this.model.Auditorium_type.update({auditorium_typename: data.AUDITORIUM_TYPENAME}, {where:{auditorium_type: data.AUDITORIUM_TYPE}});
        if (success.pop() !== 0) return data;
        else return '';
    }


    async deleteFaculties(data) {
        let findElement = (await this.model.Faculty.findAll({where: {faculty: data}})).pop().dataValues;
        if (findElement){
            let success = await this.model.Faculty.destroy({where: {faculty: data}});
            if (success === 1) return findElement;
            else return '';
        } else return '';
    }

    async deletePulpits(data) {
        let findElement = (await this.model.Pulpit.findAll({where: {pulpit: data}})).pop().dataValues;
        if (findElement){
            let success = await this.model.Pulpit.destroy({where: {pulpit: data}});
            if (success === 1) return findElement;
            else return '';
        } else return '';
    }
    async deleteTeachers(data) {
        let findElement = (await this.model.Teacher.findAll({where: {teacher: data}})).pop().dataValues;
        if (findElement){
            let success = await this.model.Teacher.destroy({where: {teacher: data}});
            if (success === 1) return findElement;
            else return '';
        } else return '';
    }

    async deleteSubjects(data) {
        let findElement = (await this.model.Subject.findAll({where: {subject: data}})).pop().dataValues;
        if (findElement){
            let success = await this.model.Subject.destroy({where: {subject: data}});
            if (success === 1) return findElement;
            else return '';
        } else return '';
    }

    async deleteAuditoriums(data) {
        let findElement = (await this.model.Auditorium.findAll({where: {auditorium: data}})).pop().dataValues;
        if (findElement){
            let success = await this.model.Auditorium.destroy({where: {auditorium: data}});
            if (success === 1) return findElement;
            else return '';
        } else return '';
    }

    async deleteAuditoriumsTypes(data) {
        let findElement = (await this.model.Auditorium_type.findAll({where: {auditorium_type: data}})).pop().dataValues;
        if (findElement){
            let success = await this.model.Auditorium_type.destroy({where: {auditorium_type: data}});
            if (success === 1) return findElement;
            else return '';
        } else return '';
    }

}

exports.DatabaseModel = DatabaseModel;