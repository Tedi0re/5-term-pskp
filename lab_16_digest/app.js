var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy
const {getCredential, varPassword, verPassword}= require('./public/javascripts/verification');
const session = require('express-session')(
    {
      resave:false,
      saveUninitialized: false,
      secret: '12345678'
    }
)

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
app.use(session);
app.use(passport.initialize());

passport.use(new DigestStrategy({qop: 'auth'},(user, done)=>{
  //console.log('passport.use', user, password);
  let rc = null;
  let cr = getCredential(user);
  if(!cr) rc = done(null, false, {message:"incorrect username"});
  else  rc = done(null, cr.user, cr.password);
  return rc;
}));


//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/login', (req,res,next)=>{
  if (req.session.logout && req.headers.authorization) {
    req.session.logout = false;
    delete req.headers.authorization;
  }
  next();
}, passport.authenticate('digest',
    {session: false})).
get('/login', (req,res)=>{
  res.redirect('/resource')
});


app.get('/logout', (req, res,next) => {
  req.session.logout = true;
  delete req.headers.authorization;
  res.redirect('/login')
});

app.get('/resource',passport.authenticate('digest', {session: false, failureRedirect: "/login"}),   (req, res,next) => {
  res.send('RESOURCE');

});

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
  res.render('error');
});

module.exports = app;
