const express = require('express')
const { signup, signin, logout, refreshToken } = require('../../controllers/hod/hodAuth.controller')
const auth = require('../../middleware/auth');
const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', auth(['hod']), logout)
router.post('/refreshtoken', refreshToken)

module.exports = router