const express = require('express')
const auth = require('../../middleware/auth');
const { createProgram, createCourse, addSubjects, profile } = require('../../controllers/hod/hod.controller')

const router = express.Router()

router.post('/create/program', auth(['hod']), createProgram)
router.post('/create/course', auth(['hod']), createCourse)
router.post('/create/course/:courseId/add-subjects', auth(['admin', 'hod']), addSubjects)
router.get('/me', auth(['hod']), profile)
module.exports = router 