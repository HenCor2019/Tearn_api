const express = require('express')
const {
  createComentary,
  getAll,
  getCommentary,
  updateCommentary,
  deleteCommentary,
  getTutorCommentaries
} = require('../../controllers/Commentary/Commentary.controller')
const router = express.Router()

/// api/v1/commentary
router.post('/create', createComentary)
router.get('/', getAll)
router.get('/:id', getCommentary)
router.get('/tutors/:id', getTutorCommentaries)
router.put('/update', updateCommentary)
router.delete('/:id', deleteCommentary)
module.exports = router
