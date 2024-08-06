const express = require('express');
const { signup, login, logout, refreshToken } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout); // Add this line

module.exports = router;
