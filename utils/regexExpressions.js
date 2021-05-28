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
      .split('')
      .map((letter) =>
        letter.replaceAll(regexReplace, LETTERS[letter.toLowerCase()])
      )

    return newPattern.join('')
  },
}

module.exports = regexExpression
