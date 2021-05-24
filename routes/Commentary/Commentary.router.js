const express = require("express");
const { createComentary, getAll, getCommentary, updateCommentary, deleteCommentary } = require("../../controllers/Commentary/Commentary.controller");
const router = express.Router();

///api/v1/commentary
router.post("/create", createComentary);
router.get("/", getAll);
router.get("/:id", getCommentary);
router.put("/update", updateCommentary);
router.delete("/delete/:id", deleteCommentary);
module.exports = router;