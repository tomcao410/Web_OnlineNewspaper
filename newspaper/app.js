var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');
var fs = require('fs')
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy
var passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// passportjs
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "websecret",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => res.render('index'));
app.route('login')
.get((req, res) => res.render('login'))
.post(passport.authenticate('local', {failureRedirect: 'login',
                                      successRedirect: '/loginOK'}));

app.get('/loginOK', (req, res) => res.send('alo alo'));
passport.use(new LocalStrategy(
  (uname, psw, done) => {
    fs.readFile('./user.json', (error, data) => {
      const db = JSON.parse(data)
      const userRecord = db.find(user => user.usr == uname)
      if (userRecord && userRecord.pass == psw)
      {
        return done(null, userRecord)
      }
      else{
        return done(null, false)
      }
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.usr)
})

//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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




app.locals.dataTopic = [];
app.locals.datathoisu = require('./model/data.json');
app.locals.dataTopten = require('./model/topten.json');
app.locals.datathreepost = require('./model/threepost.json');
module.exports = app;