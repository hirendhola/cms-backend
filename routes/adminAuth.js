const express = require('express');
const auth = require('../middleware/auth');
const { signup, login, logout, refreshToken } = require('../controllers/adminAuthController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refreshtoken', refreshToken);
router.post('/logout', logout);

module.exports = router;
