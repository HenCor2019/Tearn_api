const { Schema, model } = require('mongoose')

const CategorySchema = Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  imgUrl: { type: String },
  url: { type: String, required: true },
  subjects: [{ type: Schema.ObjectId, ref: 'Subject' }]
})

module.exports = model('Category', CategorySchema)
