const express = require('express');
const userModel = require('../models/user-model');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerUser, loginUser, logout } = require('../controllers/authController.js')



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout)

module.exports = router;