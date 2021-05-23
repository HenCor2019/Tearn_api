const Comentary = require("../../models/Commentary.model");
const parseError = require("../../utils/parseError");
const { validateCreateComment, validateGetComment } = require("./Commentary.validator");


const CommentaryControler = {
    createComentary: async(req, res, next) => {
        try {
            await validateCreateComment(req.body)
            const { description, puntuation } = req.body
            console.log({ puntuation })
            const newCommentary = await new Comentary({
                description,
                puntuation
            })
            await newCommentary.save()
            return res.status(201).json({
                error: false,
                message: "the commentary was created"

            })
        } catch (error) {
            next(parseError(error))
        }

    },
    getAll: async(req, res, next) => {
        try {
            const commentaries = await Comentary.find()
            return res.status(200).json({
                error: false,
                commentaries
            })
        } catch (error) {
            next(error)
        }
    },
    getCommentary: async(req, res, next) => {
        try {
            await validateGetComment(req.params)
            const commentary = await Comentary.findById(req.params.id)
                //const commentary = await Comentary.findOne({_id: req.params.id}) the same thing
            return res.status(200).json({
                error: false,
                commentary
            })
        } catch (error) {
            next(parseError(error))
        }
    }

}

module.exports = CommentaryControler