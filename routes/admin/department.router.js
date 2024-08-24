const { createDepartment } = require('../../controllers/admin/department.controller')

const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

router.post('/createdepartment', auth(['admin']), createDepartment);

module.exports = router;
