const  { createDepartment } = require('../controllers/department.controller')

const express = require('express');
const router = express.Router();

router.post('/createdepartment', createDepartment);

module.exports = router;
