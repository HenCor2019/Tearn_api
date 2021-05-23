const mappepToRegexCategories = require("../../utils/mappepToRegexCategories");
const Category = require("../../models/Category.model");
const Subject = require("../../models/Subject.model");

const HomeController = {
  landingHome: async (req, res, next) => {
    try {
      if (!req.body?.id) {
        const categories = await Category.find();
        const mappedCategoriesId = categories.map(({ _id }) => _id);
        const regexCategories = mappepToRegexCategories(mappedCategoriesId);

        const preferredSubject = await Subject.find({
          categoryId: new RegExp(regexCategories),
        });

        const filteredSubjects = preferredSubject.map(
          ({ _id: id, name, courses, url }) => ({
            id,
            name,
            url,
            courseCount: courses.length,
          })
        );

        return res.status(200).json({
          error: false,
          subjects: filteredSubjects,
        });
      }

      //TODO: with preferences array user await all relational subjects
    } catch (error) {
      next(error);
    }
  },
};

module.exports = HomeController;
