const express = require('express')
const {
  createSubject,
  allSubjects,
  oneSubject,
  update,
  deleteAll,
  deleteOne
} = require('../../controllers/Subject/Subject.controller')
const router = express.Router()

router.post('/', createSubject)

router.get('/:id', oneSubject)
router.get('/', allSubjects)

router.put('/', update)

router.delete('/:id', deleteOne)
router.delete('/', deleteAll)

module.exports = router
