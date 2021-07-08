const Course = require('../../models/Course.model')
const User = require('../../models/User.model')
const { mapSearch } = require('../../utils/regexExpressions')

const SearchController = {
  searchByRegex: async (req, res, next) => {
    try {
      /*
       * NOTE: validateSearch method don´t allow empty fields
       * await validateSearch(req.query);
       */
      const { pattern = '' } = req.query
      const newPattern = mapSearch(pattern)

      const regexExpression = new RegExp(`^${newPattern}`, 'i')

      const tutors = await User.find({
        $and: [{ username: regexExpression }, { isTutor: true }]
      }).populate('subjectsId', { name: 1 })

      const courses = await Course.find({ name: regexExpression })
      console.log({ courses })

      const mappedCourses = courses.map(({ _id: id, name, url, tutors }) => ({
        id,
        name,
        url,
        tutorsCount: tutors.length
      }))

      const mappedTutors = tutors.map(
        ({ _id: id, username, imgUrl, url, subjectsId, puntuation = 0 }) => ({
          id,
          username,
          imgUrl,
          url,
          subjects: subjectsId.map(({ name }) => name),
          puntuation
        })
      )

      return res.status(200).json({
        error: false,
        coursesCount: mappedCourses.length,
        tutorsCount: mappedTutors.length,
        courses: mappedCourses,
        tutors: mappedTutors
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = SearchController
