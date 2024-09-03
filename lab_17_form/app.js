var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('./auth.json')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'12345'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done)=>done(null, user));
passport.deserializeUser((user, done)=>done(null,user));

passport.use(
    new LocalStrategy((username, password, done)=>{
      for(let user of users){
        if(username === user.login && password === user.password)
          return done(null, user);
      }
      return done(null, false, {message: 'auth error'});
    })
)

app.get('/login', (req, res)=>{
  res.render('index', { title: 'Express' });
});

app.post('/login', passport.authenticate('local', {successRedirect:'/resource', failureRedirect:'/login'}));

app.get('/resource', (req,res,next)=>{
  if(req.user) next()
  else res.sendStatus(401).send('Unauthorized');
}, (req,res)=>{
  res.send('resource')
})

app.get('/logout', (req, res, next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})


//app.use('/', indexRouter);
//app.use('/users', usersRouter);

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
