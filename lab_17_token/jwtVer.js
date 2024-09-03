const jwt = require('jsonwebtoken');
const prismaClient = require('./prismaClient');
const createError = require('http-errors');
const redis = require('./redisClient');

async function JWTTokenVerify(req, res, next){
    const accessTokenSecret = 'secret';

    try {
        const {accessToken} = req.cookies;
        const {refreshToken} = req.cookies;
        if (!accessToken){
            let value = await redis.get(refreshToken)
            if(value !== null || typeof value !== 'undefined'){
                const {id} =  jwt.verify(refreshToken, accessTokenSecret)
                req.user = await prismaClient.User.findUnique({where: {id}});
                if (!req.user)
                    throw new createError(500,`User not found`);
                next();

            }
            else{
                throw new createError(401,`Token not found`);
            }

        }else{
            const {id} = jwt.verify(accessToken, accessTokenSecret);
            req.user = await prismaClient.User.findUnique({where: {id}});
            if (!req.user)
                throw new createError(500,`User not found`);
            next();
        }
    } catch (error) {
        next(error);
    }
}

module.exports = JWTTokenVerify;