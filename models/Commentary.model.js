const { Schema, model } = require("mongoose");

var CommentaryModel = Schema({
    author: { type: String, required: true },
    description: { type: String, required: true },
    adressedId: { type: String, requiered: true },
    puntuation: { type: Number, required: true },
});

module.exports = model("Commentary", CommentaryModel);