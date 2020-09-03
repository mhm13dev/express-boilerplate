const express = require('express');
const v1Users = require('./v1.users');

const v1Controller = require('../../../controllers/api.controllers/v1/v1.controller');

const router = express.Router();
// API v1 Info
router.get('/', v1Controller.getInfo);

// Get All Users
router.use('/users', v1Users);

module.exports = router;
