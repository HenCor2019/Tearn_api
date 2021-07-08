const Commentary = require('../../models/Commentary.model')
const User = require('../../models/User.model')
const { average } = require('../../tools/average.tools')
const {
  validateCreateComment,
  validateId,
  validateUpdateCommentary
} = require('./Commentary.validator')

const CommentaryControler = {
  createComentary: async (req, res, next) => {
    try {
      await validateCreateComment(req.body)
      const { description, puntuation, author, adressedId } = req.body

      if (author === adressedId) {
        throw {
          name: 'SameUserError',
          message: "You can't commented yourself"
        }
      }

      const userAuthor = await User.findById(author)
      const tutor = await User.findById(adressedId)

      if (!userAuthor || !tutor || !tutor.isTutor) {
        throw {
          name: 'InvalidTutorError',
          message: 'Cannot find the author or tutor'
        }
      }
      const commentary = await Commentary.findOne({
        $and: [{ author }, { adressedId }]
      })

      if (commentary) {
        throw {
          name: 'ExistError',
          message: 'Commentary already exist'
        }
      }

      const newCommentary = new Commentary({
        description,
        puntuation,
        author,
        adressedId
      })

      await newCommentary.save()

      tutor.commentaries = tutor.commentaries.concat(newCommentary)
      tutor.puntuation = await average(tutor.commentaries)

      await tutor.save()

      return res
        .status(201)
        .json({
          error: false,
          message: 'The commentary was created'
        })
        .end()
    } catch (error) {
      next(error)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const commentaries = await Commentary.find()
      return res.status(200).json({
        error: false,
        commentaries
      })
    } catch (error) {
      next(error)
    }
  },
  getCommentary: async (req, res, next) => {
    try {
      await validateId(req.params)
      const commentary = await Commentary.findById(req.params.id)
      return res.status(200).json({
        error: false,
        commentary
      })
    } catch (error) {
      next(error)
    }
  },
  getUserCommentary: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id: author } = req.params
      const authorCommentary = await Commentary.findOne({ author })
      if (!authorCommentary) {
        throw { name: 'ExistError', message: 'Cannot find commentary' }
      }

      return res.status(200).json({
        error: false,
        id: authorCommentary._id,
        puntuation: authorCommentary.puntuation,
        description: authorCommentary.description
      })
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  getTutorCommentaries: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id: adressedId } = req.params
      const commentaries = await Commentary.find({ adressedId }).populate(
        'author',
        {
          username: 1,
          imgUrl: 1,
          _id: 0
        }
      )
      return res.status(200).json({
        error: false,
        count: commentaries.length,
        results: commentaries.map(({ author, puntuation, description }) => ({
          author,
          description,
          puntuation
        }))
      })
    } catch (error) {
      next(error)
    }
  },
  updateCommentary: async (req, res, next) => {
    try {
      await validateUpdateCommentary(req.body)

      const { id: authorId } = req.body

      const commentary = await Commentary.findOne({ author: authorId })

      if (!commentary) {
        throw {
          name: 'UpdateError',
          message: 'Cannot update commentary'
        }
      }

      const updatedCommentary = {
        description: req.body.description || commentary.description,
        puntuation: req.body.puntuation ?? commentary.puntuation
      }

      await Commentary.findOneAndUpdate(
        { _id: commentary._id },
        updatedCommentary
      )

      const tutor = await User.findById(commentary.adressedId)
      tutor.puntuation = await average(tutor.commentaries)

      await tutor.save()

      return res
        .status(200)
        .json({
          error: false,
          message: 'Commentary was updated'
        })
        .end()
    } catch (error) {
      next(error)
    }
  },
  deleteCommentary: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id } = req.params

      const { adressedId: tutorId } = await Commentary.findById(id)
      const tutor = await User.findById(tutorId)
      const filterCommentaries = tutor.commentaries.filter(
        (comment) => comment != id
      )
      tutor.commentaries = filterCommentaries
      tutor.puntuation = await average(filterCommentaries)

      await tutor.save()
      await Commentary.findOneAndDelete({ _id: id })

      return res.status(200).json({
        error: false,
        message: 'Commentary was delete'
      })
    } catch (error) {
      console.log({ error })
      next(error)
    }
  }
}

module.exports = CommentaryControler
