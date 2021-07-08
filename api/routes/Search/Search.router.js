const express = require('express')
const { searchByRegex } = require('../../controllers/Search/Search.controller')
const router = express.Router()

router.get('/', searchByRegex)

module.exports = router
