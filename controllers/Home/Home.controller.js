const Subject = require('../../models/Subject.model')
const Course = require('../../models/Course.model')
const User = require('../../models/User.model')
const randomPreferences = require('../../utils/randomPreferences.utils')

const HomeController = {
  landingHome: async (req, res, next) => {
    try {
      let preferences = []

      if (req.params?.id) {
        const user = await User.findById(req.params?.id)

        preferences =
          user?.preferences?.length === 0
            ? await randomPreferences()
            : user?.preferences ?? (await randomPreferences())
      } else preferences = await randomPreferences()

      const preferredSubject = await Subject.find({
        categoryId: { $in: preferences }
      }).limit(7)

      const filteredSubjects = preferredSubject.map(
        ({ _id: id, name, courses, url }) => ({
          id,
          name,
          url,
          courseCount: courses.length
        })
      )

      const preferredSubjectsId = preferredSubject.map(({ _id }) => _id)

      const tutors = await User.find({
        subjectsId: { $in: preferredSubjectsId }
      })
        .populate('subjectsId', { name: 1 })
        .limit(7)

      const courses = await Course.find({
        subjectId: { $in: preferredSubjectsId }
      }).limit(7)

      const mappedTutors = tutors.map(
        ({ _id: id, fullName, imgUrl, subjectsId, puntuation, url }) => ({
          id,
          fullName,
          imgUrl,
          puntuation,
          url,
          subjects: subjectsId.map(({ name }) => name)
        })
      )
      const mappedCourses = courses.map(({ name, _id: id, tutors }) => ({
        id,
        name,
        tutorCount: tutors.length
      }))

      return res.status(200).json({
        error: false,
        tutorCount: mappedTutors.length,
        subjectCount: filteredSubjects.length,
        courseCount: mappedCourses.length,
        subjects: filteredSubjects,
        tutors: mappedTutors,
        courses: mappedCourses
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = HomeController
