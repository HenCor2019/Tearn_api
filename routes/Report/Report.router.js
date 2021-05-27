const express = require('express')
const {
  createReport,
  getAllReports
} = require('../../controllers/Report/Report.controller')
const router = express.Router()

router.post('/create', createReport)
router.get('/', getAllReports)

module.exports = router
