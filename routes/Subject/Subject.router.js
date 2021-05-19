const express = require("express");
const {
  createSubject,
  allSubjects,
  oneSubject,
  update,
  deleteAll,
  deleteOne,
} = require("../../controllers/Subject/Subject.controller");
const router = express.Router();

router.post("/create", createSubject);

router.get("/:id", oneSubject);
router.get("/", allSubjects);

router.put("/update", update);

router.delete("/delete/:id", deleteOne);
router.delete("/delete", deleteAll);

module.exports = router;
