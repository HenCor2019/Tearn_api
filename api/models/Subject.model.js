const { Schema, model } = require('mongoose')

const SubjectSchema = Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  categoryId: { type: String, required: true },
  courses: [{ type: Schema.ObjectId, ref: 'Course' }]
})

module.exports = model('Subject', SubjectSchema)
