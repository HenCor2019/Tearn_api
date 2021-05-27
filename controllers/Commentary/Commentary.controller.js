const Commentary = require('../../models/Commentary.model')
const User = require('../../models/User.model')
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
      const commentary = await Commentary.findOne({ author })

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

      userAuthor.commentaries = userAuthor.commentaries.concat(newCommentary)
      tutor.commentaries = tutor.commentaries.concat(newCommentary)

      await userAuthor.save()
      await tutor.save()

      await newCommentary.save()

      return res
        .status(201)
        .json({
          error: false,
          message: 'the commentary was created'
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
      next(parseError(error))
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

      const { id } = req.body

      const commentary = await Commentary.findById(id)

      if (!commentary) {
        throw {
          name: 'updateError',
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

      return res
        .status(200)
        .json({
          error: false,
          message: 'Commentary was updated'
        })
        .end()
    } catch (error) {
      console.log({ error })
      next(error)
    }
  },
  deleteCommentary: async (req, res, next) => {
    try {
      await validateId(req.params)
      const { id } = req.params

      await Commentary.findOneAndDelete(id)

      return res.status(200).json({
        error: false,
        message: 'Commentary was delete'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CommentaryControler
