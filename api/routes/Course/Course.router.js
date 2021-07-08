const express = require('express')
const {
  createCourse,
  allCourses,
  oneCourse,
  updateCourse,
  deleteAll,
  deleteOneCourse
} = require('../../controllers/Course/Course.controller')
const router = express.Router()

router.post('/', createCourse)

router.get('/:id', oneCourse)
router.get('/', allCourses)

router.put('/', updateCourse)

router.delete('/:id', deleteOneCourse)
router.delete('/', deleteAll)

module.exports = router
