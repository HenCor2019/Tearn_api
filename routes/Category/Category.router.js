const express = require("express");
const {
  createCategory,
  allCategories,
  oneCategory,
  update,
  deleteOne,
  deleteAll,
} = require("../../controllers/Category/Category.controller");
const router = express.Router();

router.post("/create", createCategory);

router.get("/:id", oneCategory);
router.get("/", allCategories);

router.put("/update", update);

router.delete("/delete/:id", deleteOne);
router.delete("/delete", deleteAll);

module.exports = router;
