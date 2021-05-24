const { Schema, model } = require("mongoose");

var ReportModel = Schema({
    userId: { type: String, required: true },
    createdDateTime: { type: String, required: true },
    description: { type: String, required: true },
    tutorReportedId: { type: String, required: true },
});

module.exports = model("Report", ReportModel);