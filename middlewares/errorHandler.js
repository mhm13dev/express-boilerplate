/* eslint-disable no-param-reassign */
const fileAssets = require('../GetFiles.json');
const AppError = require('../utils/AppError');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.render('pages/error', {
      assets: fileAssets.files.error.assets,
      err,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error
    // 1) Log error
    console.error('ERROR 💥: ', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // Rendered Views
  if (err.isOperational) {
    return res.status(err.statusCode).render('pages/error', {
      assets: fileAssets.files.error.assets,
      err,
    });
  }
  // Programming or other unknown error
  // 1) Log error
  console.error('ERROR 💥: ', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('pages/error', {
    assets: fileAssets.files.error.assets,
    err: {
      status: 'error',
      message: 'Something went very wrong!',
      statusCode: 500,
    },
  });
};
//  Cast errors signify that the input was in the wrong format.
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
// handle duplicate field errors
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use anothe value!`;
  return new AppError(message, 400);
};

// handle validation
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.APPSETTING_NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.APPSETTING_NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }
    if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(err);
    }
    sendErrorProd(err, req, res);
  }
};
