/* eslint consistent-return:0 import/order:0 */
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morganDebug = require('morgan-debug');
const Sentry = require('@sentry/node');
const { parse } = require('url');
const proxy = require('http-proxy-middleware');

const nextApp = require('./next');
const authMiddleware = require('./middlewares/auth');
const appContextMiddleware = require('./middlewares/appContext');
const appSetupMiddleware = require('./middlewares/appSetup');
const localeMiddleware = require('./middlewares/locale');

const redisClient = require('./services/redis');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const apiProxy = require('./routes/api');
const socketProxy = require('./routes/socket');

const { SERVER_SENTRY_DSN } = process.env;

const app = express();

if (SERVER_SENTRY_DSN) {
  Sentry.init({ dsn: SERVER_SENTRY_DSN });
}

const handle = nextApp.getRequestHandler();

const RedisStore = require('connect-redis')(session);

const skipRoutes = (regex, middleware) => (req, res, next) => {
  if (regex.test(req.url)) {
    next();
  } else {
    middleware(req, res, next);
  }
};

const getSessionTTL = () => {
  try {
    return parseInt(process.env.SESSION_TTL, 10) * 1000 || 172800000;
  } catch (err) {
    return 172800000; // 48h
  }
};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
if (SERVER_SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
}
app.use(morganDebug('dimzou-next:request', 'dev'));
app.use(skipRoutes(/^\/api\//, express.json()));
app.use(skipRoutes(/^\/api\//, express.urlencoded({ extended: false })));
app.use(cookieParser());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'feat_web',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: getSessionTTL(), // 24h
    },
  }),
);
app.use(skipRoutes(/^\/_next\//, authMiddleware));
app.use(skipRoutes(/^\/sockect\.io/, localeMiddleware));
app.use(appSetupMiddleware);
app.use(appContextMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use(apiProxy);

if (process.env.SOCKET_ENDPOINT) {
  app.use(socketProxy);
}

if (process.env.STORAGE_ENDPOINT) {
  app.use(
    proxy('/media', {
      target: process.env.STORAGE_ENDPOINT,
      // target: config.STORAGE_ENDPOINT,
      changeOrigin: true,
      secure: false,
    }),
  );
}

app.get('*', (req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

if (SERVER_SENTRY_DSN) {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 404 and 500 errors
        if (error.status === 404 || error.status === 500) {
          return true;
        }
        return false;
      },
    }),
  );
}

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
