const { Schema, model } = require('mongoose')

const CommentaryModel = Schema({
  author: { type: Schema.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  adressedId: { type: Schema.ObjectId, ref: 'User', requiered: true },
  puntuation: { type: Number, required: true }
})

module.exports = model('Commentary', CommentaryModel)
