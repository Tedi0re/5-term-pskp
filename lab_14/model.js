const { PrismaClient } = require('@prisma/client')
class DatabaseModel{
    constructor(props) {
        this.db = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });

    }

     async executeDBQuery(endpointWithMethod, data) {
        switch (endpointWithMethod) {
            case 'GET: /api/faculties':
                return await this.getFaculties();
            case 'GET: /api/pulpitsHTML':
                return await this.getPulpitsHTML();
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
            // case "GET: /api/auditoriumtype/auditoriums":
            //     return await this.fluentAPIExample(data);
            case 'GET: /api/teachers':
                return await this.getTeachers(data);
            case 'GET: /api/auditoriumsWithComp1':
                return await this.getAuditoriumsWithComp1();
            case 'GET: /api/puplitsWithoutTeachers':
                return await this.getPuplitsWithoutTeachers();
            case 'GET: /api/pulpitsWithVladimir':
                return await this.getPulpitsWithVladimir();
            case 'GET: /api/auditoriumsSameCount':
                return await this.getAuditoriumsSameCount();

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
        return this.db.fACULTY.findMany();
    }

    async getTeachers() {
        return this.db.tEACHER.findMany();
    }

    async getPulpitsHTML(){
        return this.db.pULPIT.findMany({
            include:{
                _count:{
                    select:{TEACHER_TEACHER_PULPITToPULPIT:true}
                }
            }
        });
    }
    async getPulpits() {
        return this.db.pULPIT.findMany();
    }

    async getSubjects() {
        return this.db.sUBJECT.findMany();
    }

    async getAuditoriumsTypes() {
        return this.db.aUDITORIUM_TYPE.findMany();
    }

    async getAuditoriums() {
        return this.db.aUDITORIUM.findMany();
    }

    async getPulpitsByFaculty(data) {
        return this.db.fACULTY.findMany({
            where: { FACULTY: data },
            include: {
                PULPIT_PULPIT_FACULTYToFACULTY:{
                    where: {FACULTY:data},
                    select:{
                        PULPIT: true,
                        SUBJECT_SUBJECT_PULPITToPULPIT:{
                            select:{
                                SUBJECT_NAME:true,
                            }
                        }
                    },

                }
            }
        });
    }

    async getAuditoriumsByType(data) {
        return this.db.aUDITORIUM_TYPE.findMany({
            where: {AUDITORIUM_TYPE:data},
            select:{
                AUDITORIUM_TYPE: true,
                AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE:{
                    select:{
                        AUDITORIUM: true
                    }
                }
            }

        })
    }

    async getAuditoriumsWithComp1(data){
        return this.db.aUDITORIUM.findMany({
            where:{
                AUDITORIUM_TYPE:"ЛБ-К",
                AUDITORIUM_NAME: { endsWith: '-1' }
            }
        })
    }

    async getPuplitsWithoutTeachers(){
        return this.db.pULPIT.findMany({
            where:{TEACHER_TEACHER_PULPITToPULPIT:{
                none:{}
                }},
        })
    }

    async getPulpitsWithVladimir(){
        return this.db.pULPIT.findMany({
            where:{
                TEACHER_TEACHER_PULPITToPULPIT:{
                    some: {
                        TEACHER_NAME: { contains: 'Владимир' }
                    }
                }},
            select:{
                PULPIT: true,
                PULPIT_NAME: true,
                TEACHER_TEACHER_PULPITToPULPIT:{
                    select:{
                        TEACHER_NAME:true
                    }
                }
            }
        })
    }

    async getAuditoriumsSameCount(){
        return this.db.aUDITORIUM.groupBy({
            by:['AUDITORIUM_CAPACITY','AUDITORIUM_TYPE'],
            _count: {AUDITORIUM: true},
            having:{
                AUDITORIUM:{
                    _count:{gt:1}
                }
            }
        })
    }
    async postFaculties(data) {
        if(!data.PULPITS){
            return this.db.fACULTY.create({
                data:{
                    FACULTY: data.FACULTY,
                    FACULTY_NAME: data.FACULTY_NAME,
                },
                select:{
                    FACULTY: true,
                    FACULTY_NAME: true,
                }
            });
        }
        else{
            return this.db.fACULTY.create({
                data:{
                    FACULTY: data.FACULTY,
                    FACULTY_NAME: data.FACULTY_NAME,
                    PULPIT_PULPIT_FACULTYToFACULTY:{
                        createMany:{data:data.PULPITS},
                    }
                },
                select:{
                    FACULTY: true,
                    FACULTY_NAME: true,
                    PULPIT_PULPIT_FACULTYToFACULTY: true
                }
            });
        }
    }

    async postTeachers(data) {
        return this.db.tEACHER.create({
            data:{
                TEACHER: data.TEACHER,
                TEACHER_NAME: data.TEACHER_NAME,
                PULPIT: data.PULPIT
            },
            select:{
                TEACHER: true,
                TEACHER_NAME: true,
                PULPIT: true
            }
        });
    }

    async postPulpits(data) {
        return this.db.pULPIT.create({
            data:{
                PULPIT: data.PULPIT,
                PULPIT_NAME: data.PULPIT_NAME,
                FACULTY_PULPIT_FACULTYToFACULTY: {
                    connectOrCreate:{
                        where:{FACULTY:data.FACULTY},
                        create:{
                            FACULTY: data.FACULTY,
                            FACULTY_NAME: data.FACULTY
                        }
                    }
                }
            },
            select:{
                PULPIT: true,
                PULPIT_NAME: true,
                FACULTY: true
            }
        });
    }

    async postSubjects(data) {
        return this.db.sUBJECT.create({
            data:{
                SUBJECT: data.SUBJECT,
                SUBJECT_NAME: data.SUBJECT_NAME,
                PULPIT: data.PULPIT
            },
            select:{
                SUBJECT: true,
                SUBJECT_NAME: true,
                PULPIT: true
            }
        });
    }

    async postAuditoriums(data) {
        return this.db.aUDITORIUM.create({
            data:{
                AUDITORIUM: data.AUDITORIUM,
                AUDITORIUM_NAME: data.AUDITORIUM_NAME,
                AUDITORIUM_CAPACITY: data.AUDITORIUM_CAPACITY,
                AUDITORIUM_TYPE: data.AUDITORIUM_TYPE
            },
            select:{
                AUDITORIUM: true,
                AUDITORIUM_NAME: true,
                AUDITORIUM_CAPACITY: true,
                AUDITORIUM_TYPE: true
            }
        });
    }

    async postAuditoriumsTypes(data) {
        return this.db.aUDITORIUM_TYPE.create({
            data:{
                AUDITORIUM_TYPE: data.AUDITORIUM_TYPE,
                AUDITORIUM_TYPENAME: data.AUDITORIUM_TYPENAME

            },
            select:{
                AUDITORIUM_TYPE: true,
                AUDITORIUM_TYPENAME: true,
            }
        });
    }


    async putFaculties(data) {
        return this.db.fACULTY.update({
            where:{FACULTY:data.FACULTY},
            data:{
                FACULTY_NAME: data.FACULTY_NAME,
            },
            select:{
                FACULTY: true,
                FACULTY_NAME: true,
            }
        });
    }

    async putPulpits(data) {
        return this.db.pULPIT.update({
            where:{  PULPIT: data.PULPIT,},
            data:{
                PULPIT_NAME: data.PULPIT_NAME,
                FACULTY: data.FACULTY
            },
            select:{
                PULPIT: true,
                PULPIT_NAME: true,
                FACULTY: true
            }
        });
    }

    async putTeachers(data) {
        return this.db.tEACHER.update({
            where:{TEACHER:data.TEACHER},
            data:{
                TEACHER_NAME: data.TEACHER_NAME,
                PULPIT: data.PULPIT
            },
            select:{
                TEACHER: true,
                TEACHER_NAME: true,
                PULPIT: true
            }
        });
    }

    async putSubjects(data) {
        return this.db.sUBJECT.update({
            where:{SUBJECT: data.SUBJECT,},
            data:{
                SUBJECT_NAME: data.SUBJECT_NAME,
                PULPIT: data.PULPIT
            },
            select:{
                SUBJECT: true,
                SUBJECT_NAME: true,
                PULPIT: true
            }
        });

    }

    async putAuditoriums(data) {
        return this.db.aUDITORIUM.update({
            where:{ AUDITORIUM: data.AUDITORIUM,},
            data:{
                AUDITORIUM_NAME: data.AUDITORIUM_NAME,
                AUDITORIUM_CAPACITY: data.AUDITORIUM_CAPACITY,
                AUDITORIUM_TYPE: data.AUDITORIUM_TYPE
            },
            select:{
                AUDITORIUM: true,
                AUDITORIUM_NAME: true,
                AUDITORIUM_CAPACITY: true,
                AUDITORIUM_TYPE: true
            }
        });
    }

    async putAuditoriumsTypes(data) {
        return this.db.aUDITORIUM_TYPE.update({
            where:{AUDITORIUM_TYPE: data.AUDITORIUM_TYPE},
            data:{
                AUDITORIUM_TYPENAME: data.AUDITORIUM_TYPENAME
            },
            select:{
                AUDITORIUM_TYPE: true,
                AUDITORIUM_TYPENAME: true,
            }
        });
    }


    async deleteFaculties(data) {
       return this.db.fACULTY.delete({
           where: {FACULTY:data},
           select:{
               FACULTY: true,
               FACULTY_NAME: true,
           }
       })
    }

    async deletePulpits(data) {
        return this.db.pULPIT.delete({
            where:{  PULPIT:data},
            select:{
                PULPIT: true,
                PULPIT_NAME: true,
                FACULTY: true
            }
        });
    }
    async deleteTeachers(data) {
        return this.db.tEACHER.delete({
            where:{TEACHER:data},
            select:{
                TEACHER: true,
                TEACHER_NAME: true,
                PULPIT: true
            }
        });
    }

    async deleteSubjects(data) {
        return this.db.sUBJECT.delete({
            where:{SUBJECT: data},
            select:{
                SUBJECT: true,
                SUBJECT_NAME: true,
                PULPIT: true
            }
        });
    }

    async deleteAuditoriums(data) {
        return this.db.aUDITORIUM.delete({
            where:{ AUDITORIUM: data},
            select:{
                AUDITORIUM: true,
                AUDITORIUM_NAME: true,
                AUDITORIUM_CAPACITY: true,
                AUDITORIUM_TYPE: true
            }
        });
    }

    async deleteAuditoriumsTypes(data) {
        return this.db.aUDITORIUM_TYPE.delete({
            where:{AUDITORIUM_TYPE: data},
            select:{
                AUDITORIUM_TYPE: true,
                AUDITORIUM_TYPENAME: true,
            }
        });
    }
    async fluentAPIExample(data){
        return this.db.aUDITORIUM_TYPE.findUnique({where:{AUDITORIUM_TYPE: data}})
            .AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE();
    }
    async transaction()  {
        try {
            await this.db.$transaction(async prisma => {
                await prisma.aUDITORIUM.updateMany({
                    data: {
                        AUDITORIUM_CAPACITY: {
                            increment: 100
                        }
                    }
                });
                console.log(await prisma.aUDITORIUM.findMany());
                throw new Error('Transaction rollback');
            });
        } catch (err) {
            console.log(`Transaction rolled back.`);
            console.log(await this.db.aUDITORIUM.findMany());
            return;
        }
    };


}

exports.DatabaseModel = DatabaseModel;