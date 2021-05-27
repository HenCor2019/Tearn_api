const User = require('../../models/User.model')
const jwt = require('jsonwebtoken')
const Course = require('../../models/Course.model')
const Subject = require('../../models/Subject.model')

const {
  validateLoginFacebook,
  validateUpdateToTutor,
  validateUpdateNormalUser,
  validateId,
} = require('./User.validator')
const {
  insertUniqueId,
  insertUniqueIds,
  addOrRemoveFavoriteTutors,
} = require('../../utils/user.utils')

const UserController = {
  loginFacebook: async (req, res, next) => {
    try {
      await validateLoginFacebook(req.body)

      const { username, email, imgUrl } = req.body

      const user = await User.find({ $or: [{ username }, { email }] })

      if (user.length > 1) next()

      if (user.length == 0) {
        const newUser = new User({
          username,
          email,
          imgUrl,
          isTutor: false,
          favTutors: [],
          preferences: [],
        })
        newUser.urlTutors = `${process.env.BASE_URL}user/tutors/${newUser._id}`

        const {
          _id: id,
          username: newUsername,
          email: newEmail,
          imgUrl: newImgUrl,
        } = await newUser.save()

        const token = jwt.sign(
          { id, newUsername, newEmail, newImgUrl },
          process.env.TOKEN_KEY,
          { expiresIn: '14d' }
        )

        return res.status(201).json({ error: false, accessToken: token }).end()
      }

      const {
        _id: id,
        username: registerUsername,
        email: regiserEmail,
        imgUrl: registerImgUrl,
      } = user

      const token = jwt.sign(
        { id, registerUsername, regiserEmail, registerImgUrl },
        process.env.TOKEN_KEY,
        {
          expiresIn: '14d',
        }
      )

      return res.status(200).json({ error: false, accessToken: token }).end()
    } catch (error) {
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
          isTutor,
        }) => ({
          id,
          username,
          email,
          imgUrl,
          preferences,
          favTutors,
          description,
          isTutor,
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

      if (!user) throw { name: 'notFoundError', message: 'User not found' }

      const courses = await Course.find({ _id: { $in: coursesId } })
      const subjects = await Subject.find({ _id: { $in: subjectsId } })

      if (!subjects.length || !courses.length) {
        throw {
          name: 'InvalidId',
          message: 'Cannot find the subject or course',
        }
      }

      const preUpdateUser = {
        preferences: insertUniqueIds(user.preferences, req.body?.preferences),
        favTutors: addOrRemoveFavoriteTutors(user.favTutors, req.body.favTutor),
        isTutor: true,
        fullName: req.body.fullName || user.fullName,
        dot: req.body.dot || user.dot,
        url: `${process.env.BASE_URL}user/tutor/${user._id}`,
        urlCommentaries: `${process.env.BASE_URL}user/tutors/${user._id}`,
        languages: insertUniqueIds(user.languages, req.body?.languages),
        subjectsId: insertUniqueIds(user.subjectsId, req.body?.subjectsId),
        coursesId: insertUniqueIds(user.coursesId, req.body?.coursesId),
        description: req.body.description || user.description,
        responseTime: req.body.responseTime || user.responseTime,
        puntuation: req.body.puntuation || user.puntuation || 0,
        commentaries: insertUniqueId(user.commentaries, req.body?.commentary),
        reports: insertUniqueId(user.reports, req.body.reports),
      }

      await User.findOneAndUpdate({ _id: id }, preUpdateUser)
      const newTutor = await User.findById(id)

      for (const courseId of courses) {
        const course = await Course.findById(courseId._id)
        course.tutors = course.tutors.concat(newTutor)
        await course.save()
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
        favTutors: addOrRemoveFavoriteTutors(
          user.favTutors,
          req.body?.favTutor
        ),
      }

      await User.findOneAndUpdate({ _id: id }, preUpdateUser)

      return res.status(200).json({
        error: false,
        message: 'User was updated sucessfuly',
      })
    } catch (error) {
      next(error)
    }
  },

  allTutor: async (req, res, next) => {
    try {
      const tutors = await User.find({ isTutor: true })
        .populate('subjectsId', {
          name: 1,
        })
        .populate('coursesId', {
          name: 1,
        })
        .populate('commentaries', {
          description: 1,
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
        }) => ({
          id,
          fullName,
          imgUrl,
          description,
          url,
          responseTime,
          coursesId,
          commentaries,
          subjectsId,
        })
      )

      return res.status(200).json({
        error: false,
        results: mappedTutors,
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
          model: 'User',
        },
      })

      if (!tutor || !tutor.isTutor) {
        throw { name: 'InvalidTutorError', message: 'Cannot find the tutor' }
      }

      const {
        fullName,
        imgUrl,
        url,
        urlCommentaries,
        description,
        puntuation,
        languages,
        commentaries,
        responseTime,
      } = tutor

      return res
        .status(200)
        .json({
          error: false,
          fullName,
          imgUrl,
          url,
          urlCommentaries,
          description,
          puntuation,
          languages,
          commentaries,
          responseTime,
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
      const user = await User.findById(id).populate('favTutors', {
        url: 1,
      })

      if (user.isTutor) {
        throw { name: 'NotFoundError', message: "Can't find the user" }
      }

      return res.status(200).json({
        error: false,
        id: user._id,
        username: user.username,
        imgUrl: user.imgUrl,
        email: user.email,
        urlTutors: user.urlTutors,
        favTutorsCount: user.favTutors.length,
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
          select: 'username subjectsId url puntuation',
          populate: { path: 'subjectsId', select: 'name', model: 'Subject' },
        })
        .populate('subjectsId', { name: 1 })

      const favTutors = tutors.map(({ favTutors }) =>
        favTutors.map(({ username, subjectsId, url, puntuation }) => ({
          username,
          subjects: subjectsId.map((sub) => sub.name),
          url,
          puntuation,
        }))
      )

      return res.status(200).json({
        error: false,
        tutorsCount: tutors.length,
        favTutors,
      })
    } catch (error) {
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
      await User.deleteMany()
      return res
        .status(200)
        .json({ error: false, message: 'Users was deleted' })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = UserController
