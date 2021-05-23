const { Schema, model } = require("mongoose");

var ReportModel = Schema({
    userId: { type: Schema.ObjectId, ref: "User" },
    createdDateTime: { type: Date, required: true },
    description: { type: String, required: true },
    tutorReportedId: { type: Schema.ObjectId, ref: "User" },
});

module.exports = model("Report", ReportModel);