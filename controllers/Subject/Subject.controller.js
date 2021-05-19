const Category = require("../../models/Category.model");
const Subject = require("../../models/Subject.model");

const {
  validateSubjectBody,
  validateOneSubject,
  validateUpdate,
  validateDelete,
} = require("./Subject.validator");

const SubjectController = {
  createSubject: async (req, res, next) => {
    try {
      await validateSubjectBody(req.body);
      const { name, categoryId } = req.body;

      const subject = await Subject.findOne({ name });

      if (subject)
        throw { name: "existError", message: "Subject already exist" };

      const category = await Category.findById(categoryId);

      if (!category) throw "Something was wrong";

      const newSubject = new Subject({
        name,
        categoryId,
        url: process.env.BASE_URL,
        courses: [],
      });

      newSubject.url += `subject/${newSubject._id}`;

      category.subjects = category.subjects.concat(newSubject);

      await category.save();
      await newSubject.save();

      return res
        .status(201)
        .json({
          error: false,
          message: "Subject was created sucessfuly",
        })
        .end();
    } catch (error) {
      const name = error?.details
        ? error.details[0].type.split(".")[1]
        : error.name;
      const message = error?.details ? error.details[0].message : error.message;
      error = { name, message };
      next(error);
    }
  },

  allSubjects: async (req, res, next) => {
    try {
      const subjects = await Subject.find({});

      mappedSubjects = subjects.map(({ _id: id, name, url, categoryId }) => ({
        id,
        name,
        url,
        categoryId,
      }));

      return res.status(200).json({
        error: false,
        subjectCount: mappedSubjects.length,
        results: mappedSubjects,
      });
    } catch (error) {
      next(error);
    }
  },
  oneSubject: async (req, res, next) => {
    try {
      await validateOneSubject(req.params);
      const { id } = req.params;

      const subject = await Subject.findById(id);

      const { name, categoryId, courses } = subject;

      return res.status(200).json({
        error: false,
        id,
        name,
        categoryId,
        courseCount: courses.length,
        courses,
      });
    } catch (error) {
      const name = error?.details
        ? error.details[0].type.split(".")[1]
        : error.name;
      const message = error?.details ? error.details[0].message : error.message;
      error = { name, message };
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      await validateUpdate(req.body);

      const { id } = req.body;

      const subjects = await Subject.find({
        $or: [{ id }, { name: req.body?.name }],
      });
      console.log({ subjects });

      if (subjects.length || subjects.length >= 1)
        throw { name: "updateError", message: "Cannot update subject" };

      const subject = await Subject.findById(id);
      console.log({ subject });

      const updatedSubject = {
        name: req.body.name || subject.name,
        url: req.body.url || subject.url,
      };

      await Subject.findOneAndUpdate({ _id: subject._id }, updatedSubject);

      return res
        .status(200)
        .json({
          error: false,
          message: "Subject was updated",
        })
        .end();
    } catch (error) {
      const name = error?.details
        ? error.details[0].type.split(".")[1]
        : error.name;
      const message = error?.details ? error.details[0].message : error.message;
      error = { name, message };

      next(error);
    }
  },

  deleteOne: async (req, res, next) => {
    try {
      await validateDelete(req.params);
      const { id } = req.params;

      const subject = await Subject.findById(id);

      if (!subject)
        throw { name: "deleteError", message: "Cannot delete subject" };

      await Subject.findOneAndDelete(id);

      return res.status(200).json({
        error: false,
        message: "Subject was delete",
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await Subject.deleteMany({});
      return res
        .status(200)
        .json({ error: false, message: "Subjects was deleted" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = SubjectController;
