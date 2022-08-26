const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');
const redis = require('redis')

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/user');
const passwordRouter = require('./routes/password');

const app = express();

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient({
  host: 'redis',
  port: 6379,
  prefix: 'sid:',
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'fnvareopbnrae0a2384gh',
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }),
  cookie: { httpOnly: true, secure: false, maxage: 1000 * 60 * 30 }
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/users', userRouter);
app.use('/password', passwordRouter);

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
