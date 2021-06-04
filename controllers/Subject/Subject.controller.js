const Category = require('../../models/Category.model')
const Subject = require('../../models/Subject.model')

const {
  validateSubjectBody,
  validateOneSubject,
  validateUpdate,
  validateDelete
} = require('./Subject.validator')

const SubjectController = {
  createSubject: async (req, res, next) => {
    try {
      await validateSubjectBody(req.body)
      const { name, categoryId } = req.body

      const subject = await Subject.findOne({ name })

      if (subject) {
        throw { name: 'ExistError', message: 'Subject already exist' }
      }

      const category = await Category.findById(categoryId)

      const newSubject = new Subject({
        name,
        categoryId,
        url: process.env.BASE_URL,
        courses: []
      })

      newSubject.url += `subject/${newSubject._id}`

      if (category) {
        category.subjects = category.subjects.concat(newSubject)

        await category.save()
      }
      await newSubject.save()

      return res
        .status(201)
        .json({ error: false, message: 'Subject was created sucessfuly' })
        .end()
    } catch (error) {
      next(error)
    }
  },

  allSubjects: async (req, res, next) => {
    try {
      const subjects = await Subject.find().populate({
        path: 'courses',
        select: 'name subjectId url'
      })

      const mappedSubjects = subjects.map(
        ({ _id: id, name, url, categoryId, courses }) => ({
          id,
          name,
          url,
          categoryId,
          courses
        })
      )

      return res
        .status(200)
        .json({
          error: false,
          subjectCount: mappedSubjects.length,
          results: mappedSubjects
        })
        .end()
    } catch (error) {
      next(error)
    }
  },
  oneSubject: async (req, res, next) => {
    try {
      await validateOneSubject(req.params)
      const { id } = req.params

      const subject = await Subject.findById(id).populate('courses')

      if (!subject) {
        throw { name: 'NotFoundError', message: 'Subject not found' }
      }

      const { name, categoryId, courses, url } = subject

      return res
        .status(200)
        .json({
          error: false,
          id,
          url,
          name,
          categoryId,
          courseCount: courses.length,
          courses
        })
        .end()
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      await validateUpdate(req.body)

      const { id } = req.body

      const subjects = await Subject.find({
        $or: [{ _id: id }, { name: req.body?.name }]
      })

      if (subjects.length === 0 || subjects.length > 1) {
        throw { name: 'UpdateError', message: 'Cannot update subject' }
      }

      const subject = await Subject.findById(id)

      const updatedSubject = {
        name: req.body.name || subject.name,
        url: req.body.url || subject.url
      }

      await Subject.findOneAndUpdate({ _id: subject._id }, updatedSubject)

      return res
        .status(200)
        .json({ error: false, message: 'Subject was updated' })
        .end()
    } catch (error) {
      next(error)
    }
  },

  deleteOne: async (req, res, next) => {
    try {
      await validateDelete(req.params)
      const { id } = req.params

      await Subject.findOneAndDelete({ _id: id })

      return res
        .status(200)
        .json({ error: false, message: 'Subject was delete' })
        .end()
    } catch (error) {
      next(error)
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await Subject.deleteMany({})
      return res
        .status(200)
        .json({ error: false, message: 'Subjects was deleted' })
        .end()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = SubjectController
