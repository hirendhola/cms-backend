const express = require('express');
const auth = require('../middleware/auth')
const { signup, login, logout, getInfo, refreshToken } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/getinfo/', auth, getInfo)


module.exports = router;
