const Commentary = require('../models/Commentary.model')

const getPuntuations = async (commentariesId) => {
  const commentaries = await Commentary.find({ _id: { $in: commentariesId } })
  return commentaries.map(({ puntuation }) => puntuation)
}

const average = async (commentariesId) => {
  if (commentariesId.length === 0) return 0
  const puntuations = await getPuntuations(commentariesId)

  const totalSum = puntuations.reduce((acc, current) => acc + current, 0)

  return Math.trunc(totalSum / commentariesId.length)
}

module.exports = { average }
