var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var registerstudentRouter = require('./routes/register_stu');
var registerteacherRouter = require('./routes/register_tea');
var allstudentsRouter = require('./routes/allstudents');
var allteachersRouter = require('./routes/allteachers');
var subjectmaker = require('./routes/make_subject');
var chaptermaker = require('./routes/make_chapter');
var allsubjects = require('./routes/allsubjects')
var allchapters = require('./routes/allchapters');
var unitmaker = require('./routes/make_unit');
var allunits = require('./routes/allunits')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/registerstudent', registerstudentRouter);
app.use('/registerteacher', registerteacherRouter);
app.use('/allstudents', allstudentsRouter);
app.use('/allteachers', allteachersRouter);
app.use('/makesubject', subjectmaker);
app.use('/makechapter', chaptermaker);
app.use('/allsubjects', allsubjects);
app.use('/allchapters', allchapters);
app.use('/makeunit', unitmaker);
app.use('/allunits', allunits);

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
