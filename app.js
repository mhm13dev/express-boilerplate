const path = require('path');
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const expressMongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');
const GetFiles = require('./GetFiles.json');

// Routes
const viewRouter = require('./routes/view.routes/view');
const apiRouter = require('./routes/api.routes/api');

// Initialize express app
const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

// Disable x-powered-by header
app.disable('x-powered-by');

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(expressMongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// Set View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// For Static Files that are public and used by client side views
if (process.env.NODE_ENV !== 'production') {
  app.use('/public', express.static(path.join(__dirname, 'public')));
} else {
  app.use(
    '/public',
    express.static(path.join(__dirname, 'public'), {
      lastModified: false,
      maxAge: '1y',
    })
  );
}

// For Static Files that are stored on the server and not used for client side views
if (process.env.NODE_ENV !== 'production') {
  app.use('/static', express.static(path.join(__dirname, 'static')));
} else {
  app.use(
    '/static',
    express.static(path.join(__dirname, 'static'), {
      lastModified: false,
      maxAge: '1y',
    })
  );
}

// View Routes
app.use('/', viewRouter);

// API Routes
app.use('/api', apiRouter);

// 404 Not Found For API and Views
app.use((req, res, next) => {
  next(new AppError(`The page ${req.originalUrl} does not exist!`, 404));
});

// Error Hanlder
app.use(errorHandler);

module.exports = app;
