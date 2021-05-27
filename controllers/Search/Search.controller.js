const Subject = require('../../models/Subject.model')
const User = require('../../models/User.model')

const SearchController = {
  searchByRegex: async (req, res, next) => {
    try {
      /*
       * NOTE: validateSearch method don´t allow empty fields
       * await validateSearch(req.query);
       */

      const { pattern = '' } = req.query

      const regexExpression = new RegExp(`^${pattern}`, 'i')

      // TODO: get users
      const tutors = await User.find({
        $and: [{ username: regexExpression }, { isTutor: true }]
      }).populate('subjectsId', { name: 1 })
      const subjects = await Subject.find({ name: regexExpression })

      const mappedSubjects = subjects.map(
        ({ _id: id, name, url, courses }) => ({
          id,
          name,
          url,
          courseCount: courses.length
        })
      )

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
        subjects: mappedSubjects,
        tutors: mappedTutors
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = SearchController
