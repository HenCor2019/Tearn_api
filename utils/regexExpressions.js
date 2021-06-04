const { randomCategories, mapToRegex } = require('../tools/categories.tools')
const { LETTERS, regexReplace } = require('../tools/constants.tools.js')

const regexExpression = {
  mapCategories: (categoriesId) => {
    const filteredCategories = randomCategories(categoriesId)

    return mapToRegex(filteredCategories)
  },
  mapSearch: (pattern) => {
    const newPattern = pattern
      .trim()
      .toLowerCase()
      .split('')
      .map((letter) =>
        letter.match(regexReplace) ? LETTERS[letter] : letter
      )

    return newPattern.join('').toString()
  }
}

module.exports = regexExpression
