const Category = require("../../models/Category.model");
const Subject = require("../../models/Subject.model");
const { validateSearch } = require("./Search.validator");
const parseError = require("../../utils/parseError");

const SearchController = {
  searchByRegex: async (req, res, next) => {
    try {

      /*
       * NOTE: validateSearch method don´t allow empty fields
       * await validateSearch(req.query);
       */

      const { pattern = "" } = req.query;

      const regexExpression = new RegExp(`^${pattern}`, "i");

      //TODO: get users
      // const users = await User.find({ username: regexExpression })
      const subjects = await Subject.find({ name: regexExpression });

      const mappedSubjects = subjects.map(({ _id: id, name, courses }) => ({
        id,
        name,
        courseCount: courses.length,
      }));

      return res.status(200).json({
        error: false,
        subjects: mappedSubjects,
      });
    } catch (error) {
      next(parseError(error));
    }
  },
};

module.exports = SearchController;
