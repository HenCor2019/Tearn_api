const Category = require('../models/Category.model')

const randomPreferences = async () => {
  const categories = await Category.find().limit(3)
  return categories.map(({ _id }) => _id)
}

module.exports = randomPreferences
