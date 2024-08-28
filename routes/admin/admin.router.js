const express = require('express');
const auth = require('../../middleware/auth');
const { profile } = require('../../controllers/admin/admin.controller');
const { generateCode } = require('../../controllers/admin/accessCode.controller');

const router = express.Router();

router.get('/me', auth(['admin']), profile);
router.get('/generate-access-token/:department', generateCode)

module.exports = router;
