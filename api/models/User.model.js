const { Schema, model } = require('mongoose')

const UserSchema = Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  imgUrl: { type: String, required: true },
  preferences: [{ type: Schema.ObjectId, ref: 'Category' }],
  favTutors: [{ type: Schema.ObjectId, ref: 'User' }],
  urlTutor: { type: String },
  isTutor: { type: Boolean, required: true },
  fullName: { type: String },
  subjectsId: [{ type: Schema.ObjectId, ref: 'Subject' }],
  coursesId: [{ type: Schema.ObjectId, ref: 'Course' }],
  dot: { type: String },
  url: { type: String, required: true },
  urlCommentaries: { type: String },
  languages: [{ type: String }],
  description: { type: String },
  responseTime: { type: String },
  puntuation: { type: Number },
  commentaries: [{ type: Schema.ObjectId, ref: 'Commentary' }],
  availability: [{ type: String }],
  reports: [{ type: Schema.ObjectId, ref: 'Report' }],
  active: Boolean
})

module.exports = model('User', UserSchema)
