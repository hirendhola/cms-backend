const express = require('express');
const auth = require('../middleware/auth');
const { signup, login, logout, refreshToken, checkAuthStatus } = require('../controllers/adminAuth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', login);
router.post('/refreshtoken', auth(['admin']), refreshToken);
router.post('/logout', auth(['admin']), logout);
router.get('/check-auth-status', auth(['admin']), checkAuthStatus);

module.exports = router;
