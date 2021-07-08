const express = require('express')
const router = express.Router()

const {
  URL_CATEGORIES,
  URL_SUBJECTS,
  URL_COURSES,
  URL_HOME,
  URL_SEARCH
} = process.env

/* GET home page. */
router.get('/', function (req, res) {
  res.status(200).json({
    categories: URL_CATEGORIES,
    subjects: URL_SUBJECTS,
    courses: URL_COURSES,
    home: URL_HOME,
    search: URL_SEARCH
  })
})

module.exports = router
