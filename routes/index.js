var express = require("express");
var router = express.Router();

const { URL_CATEGORIES, URL_SUBJECTS, URL_COURSES } = process.env;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({
    categories: URL_CATEGORIES,
    subjects: URL_SUBJECTS,
    courses: URL_COURSES,
  });
});

module.exports = router;
