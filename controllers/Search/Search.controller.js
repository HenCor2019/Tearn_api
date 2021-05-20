const Category = require("../../models/Category.model");
const Subject = require("../../models/Subject.model");
const { validateSearch } = require("./Search.validator");
const parseError = require("../../utils/parseError");

module.exports = async (req, res, next) => {
  try {
    await validateSearch(req.query);
    const { search = "" } = req.query;

    const regexExpression = new RegExp(`${search}`);

    const categories = await Category.find({ name: regexExpression });
    const subjects = await Subject.find({ name: regexExpression });

    console.log({ categories });

    return res.status(200).json({
      error: false,
      categories,
      subjects,
    });
  } catch (error) {
    next(parseError(error));
  }
};
