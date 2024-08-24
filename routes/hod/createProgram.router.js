const express = require('express')
const auth = require('../../middleware/auth');
const { createProgram } = require('../../controllers/hod/hod.controller')

const router = express.Router()

router.post('/create/program', auth(['admin', 'hod']), createProgram)

module.exports = router 