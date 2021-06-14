const User = require('../../models/User.model')
const jwt = require('jsonwebtoken')
const Course = require('../../models/Course.model')
const Subject = require('../../models/Subject.model')

const {
  validateLoginFacebook,
  validateUpdateToTutor,
  validateUpdateNormalUser,
  validateId
} = require('./User.validator')
const {
  insertUniqueId,
  insertUniqueIds,
  addOrRemoveFavoriteTutors,
  insertOrRemove,
  areValidUpdate
} = require('../../utils/user.utils')

const UserController = {
  loginGoogle: async (req, res, next) => {
    try {
      await validateLoginFacebook(req.body)

      const { username, email, imgUrl } = req.body

      const user = await User.findOne({ $and: [{ username }, { email }] })

      if (!user) {
        const newUser = new User({
          username,
          email,
          imgUrl,
          isTutor: false,
          favTutors: [],
          preferences: []
        })
        newUser.url = `${process.env.BASE_URL}user/${newUser._id}`

        const { _id: newUserId } = await newUser.save()

        const token = jwt.sign(
          {
            id: newUserId,
            username,
            email,
            imgUrl,
            isTutor: false,
            favTutors: [],
            preferences: []
          },
          process.env.TOKEN_KEY
        )

        return res
          .status(201)
          .json({
            error: false,
            accessToken: token,
            id: newUserId,
            username,
            email,
            imgUrl
          })
          .end()
      }

      const {
        _id: userId,
        isTutor,
        fullName = 'none',
        preferences,
        favTutors
      } = user

      const token = jwt.sign(
        {
          id: userId,
          username,
          email,
          imgUrl,
          isTutor: user.isTutor
        },
        process.env.TOKEN_KEY
      )

      return res
        .status(200)
        .json({
          error: false,
          accessToken: token,
          id: userId,
          username,
          email,
          imgUrl,
          isTutor,
          fullName,
          preferences,
          favTutors
        })
        .end()
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  allUser: async (req, res, next) => {
    try {
      const users = await User.find()
        .populate('preferences', { name: 1 })
        .populate('favTutors', { username: 1 })

      const mappedUsers = users.map(
        ({
          _id: id,
          username,
          email,
          imgUrl,
          preferences,
          favTutors,
          description,
          url,
          isTutor
        }) => ({
          id,
          username,
          email,
          imgUrl,
          preferences,
          favTutors,
          description,
          url,
          isTutor
        })
      )

      return res.status(200).json({ error: false, results: mappedUsers }).end()
    } catch (error) {
      next(error)
    }
  },
  updateToTutor: async (req, res, next) => {
    try {
      await validateUpdateToTutor(req.body)

      const { id, coursesId, subjectsId } = req.body

      const user = await User.findById(id)

      if (!user) throw { name: 'NotFoundError', message: 'User not found' }

      const courses = await Course.find({ _id: { $in: coursesId } })
      const subjects = await Subject.find({ _id: { $in: subjectsId } })

      if (!subjects.length || !courses.length) {
        throw {
          name: 'InvalidId',
          message: 'Cannot find the subject or course'
        }
      }

      const preUpdateUser = {
        preferences: insertUniqueIds(user.preferences, req.body?.preferences),
        favTutors: addOrRemoveFavoriteTutors(user.favTutors, req.body.favTutor),
        isTutor: true,
        fullName: req.body.fullName || user.fullName,
        dot: req.body.dot || user.dot,
        urlTutor: `${process.env.BASE_URL}user/tutor/${user._id}`,
        urlCommentaries: `${process.env.BASE_URL}commentary/tutors/${user._id}`,
        languages: req.body.languages || user.languages,
        subjectsId: req.body.subjectsId || user.subjectsId,
        coursesId: req.body.coursesId || user.coursesId,
        description: req.body.description || user.description,
        responseTime: req.body.responseTime || user.responseTime,
        puntuation: req.body.puntuation || user.puntuation || 0,
        availability: req.body.availability || user.availability,
        commentaries: insertUniqueId(user.commentaries, req.body?.commentary),
        reports: insertUniqueId(user.reports, req.body.reports),
        active: req.body.active || true
      }

      if (!areValidUpdate(preUpdateUser))
        throw { name: 'InvalidDataError', message: 'Cannot be empty' }

      await User.findOneAndUpdate({ _id: id }, preUpdateUser)
      const newTutor = await User.findById(id)

      for (const courseId of courses) {
        const course = await Course.findById(courseId._id)
        if (
          insertUniqueId(course.tutors, newTutor._id).length !=
          course.tutors.length
        ) {
          course.tutors = course.tutors.concat(newTutor)
          await course.save()
        }
      }

      return res
        .status(200)
        .json({ error: false, message: 'User was updated sucessfuly' })
        .end()
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  updateNormalUser: async (req, res, next) => {
    try {
      await validateUpdateNormalUser(req.body)
      const { id } = req.body

      const tutor = await User.findById(req.body.favTutor)

      if (tutor && !tutor?.isTutor) {
        throw { name: 'InvalidTutorError', message: 'Cannot find the tutor' }
      }

      const user = await User.findById(id)

      if (!user) throw { name: 'NotFoundError', message: "User don't found" }

      const preUpdateUser = {
        username: req.body.username || user.username,
        imgUrl: req.body.imgUrl || user.imgUrl,
        preferences: insertUniqueIds(user?.preferences, req.body?.preferences),
        favTutors: addOrRemoveFavoriteTutors(user.favTutors, req.body?.favTutor)
      }

      await User.findOneAndUpdate({ _id: id }, preUpdateUser)

      return res.status(200).json({
        error: false,
        message: 'User was updated sucessfuly',
        isFavorite: preUpdateUser.favTutors.length > user.favTutors,
        favTutors: preUpdateUser.favTutors
      })
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },

  allTutor: async (req, res, next) => {
    try {
      const tutors = await User.find({ isTutor: true })
        .populate('subjectsId', {
          name: 1
        })
        .populate('coursesId', {
          name: 1
        })
        .populate('commentaries', {
          description: 1
        })

      const mappedTutors = tutors.map(
        ({
          _id: id,
          fullName,
          url,
          imgUrl,
          description,
          responseTime,
          coursesId,
          subjectsId,
          commentaries,
          active
        }) => ({
          id,
          fullName,
          imgUrl,
          description,
          url,
          responseTime,
          coursesId: coursesId.map((course) => ({
            id: course._id,
            name: course.name
          })),
          commentaries: commentaries.map((comment) => ({
            id: comment._id,
            description: comment.description
          })),
          subjectsId: subjectsId.map((sub) => ({
            id: sub._id,
            name: sub.name
          })),
          active
        })
      )

      return res.status(200).json({
        error: false,
        results: mappedTutors
      })
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  oneTutor: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id } = req.params
      const tutor = await User.findById(id).populate({
        path: 'commentaries',
        select: 'description puntuation author',
        populate: {
          path: 'author',
          select: 'username imgUrl',
          model: 'User'
        }
      })

      if (!tutor || !tutor.isTutor) {
        throw { name: 'InvalidTutorError', message: 'Cannot find the tutor' }
      }

      const {
        _id,
        fullName,
        imgUrl,
        urlTutor,
        urlCommentaries,
        description,
        puntuation,
        languages,
        commentaries,
        availability,
        subjectsId,
        coursesId,
        responseTime,
        dot,
        active
      } = tutor

      return res
        .status(200)
        .json({
          error: false,
          id: _id,
          fullName,
          imgUrl,
          urlTutor,
          urlCommentaries,
          description,
          puntuation,
          languages,
          commentaries: commentaries.map(
            ({ _id: id, description, puntuation, author }) => ({
              id,
              description,
              puntuation,
              author: {
                id: author._id,
                username: author.username,
                imgUrl: author.imgUrl
              }
            })
          ),
          availability,
          subjectsId,
          coursesId,
          responseTime,
          dot,
          active
        })
        .end()
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  oneUser: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id } = req.params
      const user = await User.findById(id)
      if (!user) {
        throw { name: 'NotFoundError', message: "Can't find the user" }
      }

      return res.status(200).json({
        error: false,
        id: user._id,
        username: user.username,
        imgUrl: user.imgUrl,
        email: user.email,
        isTutor: user.isTutor,
        urlTutor: user.urlTutor,
        url: user.url,
        favTutorsCount: user.favTutors.length,
        favTutors: user.favTutors
      })
    } catch (error) {
      next(error)
    }
  },
  tutorsUser: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id: _id } = req.params

      const tutors = await User.find({ _id })
        .populate({
          path: 'favTutors',
          select: 'username subjectsId url puntuation imgUrl',
          populate: { path: 'subjectsId', select: 'name', model: 'Subject' }
        })
        .populate('subjectsId', { name: 1 })

      const favTutors = tutors.map(({ favTutors }) =>
        favTutors.map(
          ({ _id: id, username, puntuation, subjectsId, imgUrl }) => ({
            id,
            username,
            puntuation,
            imgUrl,
            subjects: subjectsId.map((s) => s.name)
          })
        )
      )

      return res.status(200).json({
        error: false,
        tutorsCount: favTutors.length,
        favTutors: favTutors.reduce((acc, current) => acc.concat(current), [])
      })
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await validateId(req.params)

      const { id } = req.params

      const user = await User.findById(id)
      if (!user) {
        throw { name: 'InvalidTutorError', message: 'Cannot find the tutor' }
      }

      await User.findOneAndDelete({ _id: id })

      return res
        .status(200)
        .json({ error: false, message: 'User was deleted' })
        .end()
    } catch (error) {
      next(error)
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await User.deleteMany({})
      return res
        .status(200)
        .json({ error: false, message: 'Users was deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController
