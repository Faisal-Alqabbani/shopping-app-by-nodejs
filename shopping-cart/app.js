var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressBar = require('express-handlebars');
const mongoose = require('mongoose');
const hbs = require('hbs');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
mongoose.connect('mongodb://127.0.0.1:27017/Shopping_cart',{useNewUrlParser:true}, err =>{
  if(err){
    return console.log(err);
  }
  console.log('Database Connected!');
})

require('./config/passport');
// view engine setup
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "views"));
hbs.registerHelper('add', function(value){
  return value + 1;
});
hbs.registerHelper('checkQunatity', function(value){
  if(value <= 1){
    return true;
  }else{
    return false;
  }
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'shopping-cart_?@',
  saveUninitialized:false,
  resave:true
}));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
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

module.exports = app;
