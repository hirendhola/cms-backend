const express = require('express');
const auth = require('../middleware/auth');
const { profile } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/me', auth(['admin']), profile);

module.exports = router;
