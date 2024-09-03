var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const redis = require('./redisClient');
const tokenVerify = require('./jwtVer');
const prismaClient = require('./prismaClient');
const jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get(
    "/resource",
    tokenVerify,
    async (req, res) => {
      res.send('resource')
    }
)

app.get(
    "/login",
    async (req,res)=>{
      res.render('login')
    }
)

app.get(
    "/register",
    async (req, res) => {
        res.render("register");
    }
)

app.post(
    "/register",
    async (req, res, next) => {
        try {
            const {username, password} = req.body;
            console.log(req);

            const isFullDataProvided = password && username;
            if (!isFullDataProvided) {
                throw new createError(400,"Full data is not provided");
            }

            const user = await prismaClient.User.findUnique({where: {username}});
            if (user) {
                throw new createError(400,"Username is already taken");
            }

            await prismaClient.User.create({
                data: {
                    username,
                    password
                },
            });

            res.end();

        } catch (error) {
            next(error);
        }
    }
);

app.post(
    "/login",
    async (req, res, next) => {

        try {

            const {username, password} = req.body;

            if (!username || !password)
                throw new createError(400,"username or password is not provided");

            const user = await prismaClient.User.findUnique({
                where: {
                    username,
                },
            });
            if (!user)
                throw new createError(400,`User with username ${username} does not exist`);

            if (password !== user.password)
                throw new createError(400,"Password is not correct");

            const accessTokenSecret = 'secret';
            const accessToken = jwt.sign({id: user.id}, accessTokenSecret, {
                expiresIn: "10m",
            });
            const refreshTokenSecret = 'secret';
            const refreshToken = jwt.sign({id: user.id}, refreshTokenSecret, {
                expiresIn: "24h",
            });

            const DAY_IN_SECONDS = 24 * 3600 * 1000;
            await redis.set(refreshToken, 1, {PX: DAY_IN_SECONDS});

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "strict",
            });

            res.cookie("refreshToken", refreshToken);

            res.end();

        } catch (error) {
            next(error);
        }
    }
)

app.get(
    "/refresh",
    async (req, res, next) => {
        try {

            const {refreshToken} = req.cookies;
            if (!refreshToken)
                throw new createError(401,"Refresh token is not provided");

            const token = await redis.get(refreshToken);
            if (!token)
                throw new createError(401,"Refresh token is not valid");

            const refreshTokenSecret = 'secret';
            const accessTokenSecret = 'secret';

            const {id} = jwt.verify(
                refreshToken,
                refreshTokenSecret
            );

            const newAccessToken = jwt.sign({id}, accessTokenSecret, {
                expiresIn: "10m",
            });

            const newRefreshToken = jwt.sign({id}, refreshTokenSecret, {
                expiresIn: "24h",
            });

            const DAY_IN_SECONDS = 24 * 3600 * 1000;
            await redis
                .multi()
                .del(refreshToken)
                .set(newRefreshToken, 1, {PX: DAY_IN_SECONDS})
                .exec();

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "strict",
            });

            res.cookie("refreshToken", newRefreshToken);

            res.end();

        } catch (error) {
            next(error);
        }
    }
)

app.get(
    "/logout",
    async (req, res, next) => {

        const {refreshToken} = req.cookies;

        await redis.del(refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.end();
    }
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.send(err);
});

module.exports = app;
