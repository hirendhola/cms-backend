const express = require('express');
const auth = require('../middleware/auth');
const { profile } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/me', profile);

module.exports = router;
