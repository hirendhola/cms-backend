const express = require('express');
const auth = require('../middleware/auth');
const { authLimiter, refreshTokenLimiter } = require('../middleware/rateLimiter');
const { signup, signin, logout, refreshToken, checkAuthStatus, verifyToken } = require('../controllers/adminAuth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', authLimiter, signin);
router.post('/refreshtoken', refreshTokenLimiter, refreshToken);
router.post('/logout', auth(['admin']), logout);
router.get('/check-auth-status', auth(['admin']), checkAuthStatus);
router.get('/verify-token', verifyToken);

module.exports = router;