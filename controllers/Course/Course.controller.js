const Subject = require("../../models/Subject.model");
const Course = require("../../models/Course.model");
const {
  validateCreation,
  validateParams,
  validateUpdate,
  validateDelete,
} = require("./Course.validator");
const parseError = require("../../utils/parseError");

const CourseController = {
  createCourse: async (req, res, next) => {
    try {
      await validateCreation(req.body);

      const { name, subjectId } = req.body;

      const course = await Course.findOne({ name });

      if (course)
        throw { name: "existError", message: "course name already exist" };

      const subject = await Subject.findById(subjectId);

      const newCourse = new Course({
        name,
        subjectId,
        url: process.env.BASE_URL,
        tutors: [],
      });

      newCourse.url += `course/${newCourse._id}`;
      subject.courses = [newCourse, ...subject.courses];

      await subject.save();
      await newCourse.save();

      return res.status(201).json({
        error: false,
        message: "Course created sucessfuly",
      });
    } catch (error) {
      next(parseError(error));
    }
  },
  allCourses: async (req, res, next) => {
    try {
      const courses = await Course.find();
      const mappedCourses = courses.map(
        ({ _id: id, name, url, subjectId, tutors }) => ({
          id,
          name,
          url,
          subjectId,
          tutors,
        })
      );

      return res
        .status(200)
        .json({
          error: false,
          results: mappedCourses,
        })
        .end();
    } catch (error) {
      next(error);
    }
  },

  oneCourse: async (req, res, next) => {
    try {
      await validateParams(req.params);
      const { id } = req.params;
      const { name, url, subjectId, tutors } = await Course.findById(id);

      return res
        .status(200)
        .json({
          error: false,
          name,
          url,
          subjectId,
          tutorsCount: tutors.length,
          tutors,
        })
        .end();
    } catch (error) {
      next(error);
    }
  },
  updateCourse: async (req, res, next) => {
    try {
      await validateUpdate(req.body);
      const { id } = req.body;

      const courses = await Course.find({
        $or: [{ _id: id }, { name: req.body?.name }],
      });

      if (courses.length === 0 || courses.length > 1)
        throw { name: "existError", message: "Cannot update the course" };

      const course = await Course.findById(id);

      const newCourse = {
        name: req.body.name || course.name,
        url: req.body.url || course.url,
        subjectId: req.body.subjectId || course.subjectId,
      };

      await Course.findOneAndUpdate({ _id: id }, newCourse);

      return res.status(200).json({
        error: false,
        message: "Course was update sucessfuly",
      });
    } catch (error) {
      next(parseError(error));
    }
  },
  deleteOneCourse: async (req, res, next) => {
    try {
      await validateDelete(req.params);

      const { id } = req.params;

      await Course.findOneAndDelete(id);

      return res.status(200).json({
        error: false,
        message: "Course was deleted sucessfuly",
      });
    } catch (error) {
      next(parseError(error));
    }
  },

  deleteAll: async (req, res, next) => {
    try {
      await Course.deleteMany();

      return res.status(200).json({
        error: false,
        message: "Courses was deleted",
      });
    } catch (error) {
      next(parseError(error));
    }
  },
};

module.exports = CourseController;
