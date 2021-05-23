const { Schema, model } = require("mongoose");

var CommentaryModel = Schema({
    author: { type: Schema.ObjectId, ref: "User" },
    description: { type: String, required: true },
    adressedId: { type: Schema.ObjectId, ref: "User" },
    puntuation: { type: Number, required: true },
});

module.exports = model("Commentary", CommentaryModel);