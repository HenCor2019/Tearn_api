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

      const subjects = await Subject.find({ name });

      if (!subjects) throw "Subject already exist";

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
    } catch (err) {
      const message = err?.details ? err.details[0].message : err;

      return res.status(400).json({ error: true, message });
    }
  },

  allSubjects: async (req, res) => {
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
    } catch (err) {
      return res
        .status(400)
        .json({ error: true, message: "Cannot get subjects" });
    }
  },
  oneSubject: async (req, res, next) => {
    try {
      await validateOneSubject(req.params);
      const { id } = req.params;

      const subject = await Subject.findById(id);

      if (!subject) next();

      const { name, categoryId, courses } = subject;

      return res.status(200).json({
        error: false,
        id,
        name,
        categoryId,
        courseCount: courses.length,
        courses,
      });
    } catch (err) {
      const message = err?.details ? err.details[0].message : err.name;

      return res.status(500).json({
        error: true,
        message,
      });
    }
  },

  update: async (req, res) => {
    try {
      await validateUpdate(req.body);

      const { id } = req.body;

      const subject = await Subject.find({
        $or: [{ id }, { name: req.body?.name }],
      });

      if (!subject || subject.length != 1) throw "cannot update subject";

      const updatedSubject = {
        name: req.body.name || subject.name,
        url: req.body.url || subject.url,
      };

      await Subject.findOneAndUpdate(id, updatedSubject);

      return res.status(200).json({
        error: false,
        message: "Subject was updated",
      });
    } catch (err) {
      const message = err?.details ? err.details[0].message : err;

      return res.status(500).json({
        error: true,
        message,
      });
    }
  },

  deleteOne: async (req, res) => {
    try {
      await validateDelete(req.params);
      const { id } = req.params;

      const subject = await Subject.findById(id);

      if (!subject) throw "Subject does exist";

      await Subject.findOneAndDelete(id);

      return res.status(200).json({
        error: false,
        message: "Subject was delete",
      });
    } catch (err) {
      const message = err?.details ? err.details[0].message : err;

      return res.status(500).json({
        error: true,
        message,
      });
    }
  },
  deleteAll: async (req, res) => {
    try {
      await Subject.deleteMany({});
      return res
        .status(200)
        .json({ error: false, message: "Subjects was deleted" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Something was wrong" });
    }
  },
};

module.exports = SubjectController;
