const express = require("express");
const { createComentary, getAll, getCommentary } = require("../../controllers/Commentary/Commentary.controller");
const router = express.Router();

///api/v1/commentary
router.post("/create", createComentary);
router.get("/", getAll);
router.get("/:id", getCommentary);
module.exports = router;