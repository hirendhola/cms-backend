const express = require('express');
const auth = require('../middleware/auth');
const { signup, login, logout, refreshToken } = require('../controllers/adminAuth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', login);
router.post('/refreshtoken', refreshToken);
router.post('/logout', logout);

module.exports = router;
