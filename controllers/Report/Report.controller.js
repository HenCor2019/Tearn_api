const Report = require("../../models/Report.model");
const parseError = require("../../utils/parseError");
const ReportControler = {

    createReport: async(req, res, next) => {
        try {
            await validateCreationReport(req.body)
            const { userId, createdDateTime, description, tutorReportedId } = req.body
            const newReport = await new Report({
                userId,
                createdDateTime,
                description,
                tutorReportedId
            })
            await newReport.save()
            return res.status(201).json({
                error: false,
                message: "the report was created"

            })
        } catch (error) {
            next(parseError(error))
        }

    },
    getAllReports: async(req, res, next) => {
        try {
            const reports = await Report.find()
            return res.status(200).json({
                error: false,
                reports
            })
        } catch (error) {
            next(error)
        }
    },

}

module.exports = ReportControler