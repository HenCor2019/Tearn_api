const express = require('express')
const {
  createCategory,
  allCategories,
  oneCategory,
  update,
  deleteOne,
  deleteAll
} = require('../../controllers/Category/Category.controller')
const router = express.Router()

router.post('/', createCategory)

router.get('/:id', oneCategory)
router.get('/', allCategories)

router.put('/', update)

router.delete('/:id', deleteOne)
router.delete('/', deleteAll)

module.exports = router
