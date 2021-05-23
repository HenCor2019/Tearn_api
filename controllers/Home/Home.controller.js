const Category = require("../../models/Category.model");
const Subject = require("../../models/Subject.model");
const User = require("../../models/User.model");

const HomeController = {
  landingHome: async (req, res, next) => {
    try {
      if (!req.body?.id) {
        const categories = await Category.find();
        const mappedCategoriesId = categories.map(({ _id }) => _id);

        const preferredSubject = await Subject.find({
          categoryId: { $in: mappedCategoriesId },
        });

        const filteredSubjects = preferredSubject.map(
          ({ _id: id, name, courses, url }) => ({
            id,
            name,
            url,
            courseCount: courses.length,
          })
        );

        const preferredSubjectsId = preferredSubject.map(({ _id }) => _id);

        const tutors = await User.find({
          subjectsId: { $in: preferredSubjectsId },
        });

        return res.status(200).json({
          error: false,
          subjects: filteredSubjects,
          tutors,
        });
      }

      //TODO: with preferences array user await all relational subjects
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
};

module.exports = HomeController;
