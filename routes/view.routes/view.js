const express = require('express');
const indexRouter = require('./index');

const router = express.Router();

// Index Router
router.use('/', indexRouter);

module.exports = router;
