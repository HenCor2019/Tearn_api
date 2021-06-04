const Subject = require('../../models/Subject.model')
const Course = require('../../models/Course.model')
const {
  validateCreation,
  validateParams,
  validateUpdate,
  validateDelete
} = require('./Course.validator')

const CourseController = {
  createCourse: async (req, res, next) => {
    try {
      await validateCreation(req.body)

      const { name, subjectId, imgUrl } = req.body

      const course = await Course.findOne({ name })

      if (course) {
        throw {
          name: 'ExistError',
          message: 'Course name already exist'
        }
      }

      const subject = await Subject.findById(subjectId)

      const newCourse = new Course({
        name,
        subjectId,
        url: process.env.BASE_URL,
        imgUrl,
        tutors: []
      })

      newCourse.url += `course/${newCourse._id}`

      if (subject) {
        subject.courses = [newCourse, ...subject.courses]
        await subject.save()
      }

      await newCourse.save()

      return res
        .status(201)
        .json({
          error: false,
          message: 'Course created sucessfuly'
        })
        .end()
    } catch (error) {
      next(error)
    }
  },
  allCourses: async (req, res, next) => {
    try {
      const courses = await Course.find().populate('tutors')
      const mappedCourses = courses.map(
        ({ _id: id, name, url, imgUrl, subjectId, tutors }) => ({
          id,
          name,
          url,
          imgUrl,
          subjectId,
          tutors
        })
      )

      return res
        .status(200)
        .json({
          error: false,
          results: mappedCourses
        })
        .end()
    } catch (error) {
      next(error)
    }
  },

  oneCourse: async (req, res, next) => {
    try {
      await validateParams(req.params)
      const { id } = req.params
      const course = await Course.findById(id).populate('tutors', {
        fullName: 1,
        imgUrl: 1,
        url: 1
      })

      if (!course) throw { name: 'notFoundError', message: 'Course not found' }

      const { name, url, subjectId, tutors } = course

      return res
        .status(200)
        .json({
          error: false,
          name,
          url,
          subjectId,
          tutorsCount: tutors.length,
          tutors
        })
        .end()
    } catch (error) {
      next(error)
    }
  },

  updateCourse: async (req, res, next) => {
    try {
      await validateUpdate(req.body)
      const { id } = req.body

      const courses = await Course.find({
        $or: [{ _id: id }, { name: req.body.name }]
      })

      if (courses.length === 0 || courses.length > 1)
        throw {
          name: 'ExistError',
          message: 'Cannot update the course'
        }

      const course = await Course.findById(id)

      const newCourse = {
        name: req.body.name || course.name,
        url: req.body.url || course.url,
        subjectId: req.body.subjectId || course.subjectId
      }

      await Course.findOneAndUpdate({ _id: id }, newCourse)

      return res
        .status(200)
        .json({
          error: false,
          message: 'Course was update sucessfuly'
        })
        .end()
    } catch (error) {
      next(error)
    }
  },
  deleteOneCourse: async (req, res, next) => {
    try {
      await validateDelete(req.params)

      const { id } = req.params

      await Course.findOneAndDelete({ _id: id })

      return res
        .status(200)
        .json({ error: false, message: 'Course was deleted sucessfuly' })
        .end()
    } catch (error) {
      next(error)
    }
  },

  deleteAll: async (req, res, next) => {
    try {
      await Course.deleteMany({})

      return res
        .status(200)
        .json({
          error: false,
          message: 'Courses was deleted'
        })
        .end()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CourseController
