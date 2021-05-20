const { Schema, model } = require("mongoose");

var CourseModel = Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  subjectId: { type: String, required: true },
  tutors: [{ type: Schema.ObjectId, ref: "User" }],
});

module.exports = model("Course", CourseModel);
