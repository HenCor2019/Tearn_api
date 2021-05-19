const { Schema, model } = require("mongoose");

var CategorySchema = Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imgUrl: { type: String },
  url: { type: String, required: true },
  subjects: [{ type: Schema.ObjectId, ref: "Subject" }],
});

module.exports = model("Category", CategorySchema);
