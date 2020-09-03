const express = require('express');
const v1Router = require('./v1.routes/v1');
const apiController = require('../../controllers/api.controllers/api.controller');

const router = express.Router();
// API Info
router.get('/', apiController.getInfo);

// v1 routes
router.use('/v1', v1Router);

module.exports = router;
