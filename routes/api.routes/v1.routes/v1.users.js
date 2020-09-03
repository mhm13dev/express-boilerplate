const express = require('express');
const v1UsersController = require('../../../controllers/api.controllers/v1/v1.users.controller');

const router = express.Router();
// Get All Users
router.get('/', v1UsersController.getAllUsers);

// Create New User
router.post('/', v1UsersController.createUser);

module.exports = router;
