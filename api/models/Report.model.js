const { Schema, model } = require('mongoose')

const ReportModel = Schema({
  userId: { type: Schema.ObjectId, ref: 'User', required: true },
  createdDateTime: { type: String, required: true },
  description: { type: String, required: true },
  tutorReportedId: { type: Schema.ObjectId, ref: 'User', required: true }
})

module.exports = model('Report', ReportModel)
