const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//import routes
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const bannerRouter = require('./routes/banner');
const homeRouter = require('./routes/home');
const footerRouter = require('./routes/footer');
const socialMediaRouter = require('./routes/socialMedia');
const menuRouter = require('./routes/menu');
const workRouter = require('./routes/work');
const blogRouter = require('./routes/blog');
const contactRouter = require('./routes/contact');

// import models
const menuDb = require('./models/menuDisplayModel');
const userDb = require('./models/userModel');
const footerDb  = require('./models/footerModel');
const socialMediaDb = require('./models/socialMediaModel');
//const userDb = require('./models/userModel');
const blogdb = require('./models/blogModel');

const app = express();

// Add initial values to database
 menuDb.addMenu();
 userDb.addAdmin();
 footerDb.addFooters();
 socialMediaDb.addSocialMediaIcons()



//Delete database values
// userDb.deleteMany({}, async (err) =>{
//   console.log("deleted")
// })
// socialMediaDb.deleteMany({}, async (err) =>{
//   console.log("deleted")
// })



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/banner',bannerRouter);
app.use('/home',homeRouter);
app.use('/footer',footerRouter);
app.use('/socialMedia',socialMediaRouter);
app.use('/menu',menuRouter);
app.use('/work',workRouter);
app.use('/blog',blogRouter);
app.use('/contact',contactRouter);

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
