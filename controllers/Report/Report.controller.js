const Report = require('../../models/Report.model')
const User = require('../../models/User.model')

const { validateCreationReport } = require('./Report.validator')
const ReportControler = {
  createReport: async (req, res, next) => {
    try {
      await validateCreationReport(req.body)
      const { userId, createdDateTime, description, tutorReportedId } = req.body

      const userAuthor = await User.findById(userId)
      const tutor = await User.findById(tutorReportedId)

      if (!userAuthor || !tutor || !tutor.isTutor) {
        throw {
          name: 'InvalidTutorError',
          message: 'Cannot find the user or tutor'
        }
      }

      const newReport = new Report({
        userId,
        createdDateTime,
        description,
        tutorReportedId
      })

      tutor.reports = tutor.reports.concat(newReport)

      await tutor.save()

      await newReport.save()
      return res.status(201).json({
        error: false,
        message: 'the report was created'
      })
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  getAllReports: async (req, res, next) => {
    try {
      const reports = await Report.find()
      return res.status(200).json({
        error: false,
        reports
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ReportControler
