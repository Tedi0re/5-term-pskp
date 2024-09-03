var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session')({resave: false, saveUninitialized: false, secret:'12345678'});
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

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
passport.use(new GoogleStrategy({
  clientID:'332144744630-j25op359hbekcbm5us931gcgoup5m6bi.apps.googleusercontent.com',
  clientSecret:'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',
  callbackURL:'http://localhost:3000/ok'
}, (token, refreshToken, profile, done)=>{done(null, {profile: profile, token: token})}))
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
passport.serializeUser((user, done)=>{
    console.log('serialize: displayName', user.profile.displayName);
    done(null, user);
})

passport.deserializeUser((user, done)=>{
  console.log('deserialize: displayName', user.profile.displayName);
  done(null, user);
})
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
  res.send(`
    <html>
      <body>
        <a href="/auth/google"><button>Continue with Google</button></a>
      </body>
    </html>
  `);
});

app.get('/auth/google', passport.authenticate('google', {scope:['profile']}));

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) next();
    res.redirect('/login');
  });
});

app.get('/ok', passport.authenticate('google', {failureRedirect:'/login'}),
    (req, res) => {res.redirect('/resource')})

app.get('/resource', (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {

    const id = req.user.profile.id;
    const username = req.user.profile.name.familyName + ' ' + req.user.profile.name.givenName;
    const profileUrl = req.user.profile.id;

    res.send(`
      <html lang="en">
        <body>
          <p>RESOURCE</p>
            <p>id: ${id}</p>
            <p>login: ${username}</p>
            </p>
          
      </html>
    `);
  }
  else {
    res.redirect('/login');
  }
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
