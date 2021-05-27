const randomPosition = (len) => Math.ceil(Math.random() * len - 1)

const randomsCategories = (categoriesId) => {
  if (categoriesId.length <= 3) return categoriesId

  const categoriesLen = categoriesId.length

  const randomsId = [
    categoriesId[randomPosition(categoriesLen)],
    categoriesId[randomPosition(categoriesLen)],
    categoriesId[randomPosition(categoriesLen)]
  ]

  if (new Set(randomsId).size != 3) return randomsCategories(categoriesId)
  else return randomsId
}

module.exports = randomsCategories
