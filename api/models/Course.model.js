const { Schema, model } = require('mongoose')

const CourseModel = Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  imgUrl: { type: String },
  subjectId: { type: String, required: true },
  tutors: [{ type: Schema.ObjectId, ref: 'User' }]
})

module.exports = model('Course', CourseModel)
