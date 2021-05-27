const express = require('express')
const router = express.Router()
const { landingHome } = require('../../controllers/Home/Home.controller')

router.get('/', landingHome)
router.get('/:id', landingHome)

module.exports = router
