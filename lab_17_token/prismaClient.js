const prismaClient = require('@prisma/client').PrismaClient
const client = new prismaClient();
module.exports = client;