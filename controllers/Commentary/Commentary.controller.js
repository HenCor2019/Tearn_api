const Comentary = require("../../models/Commentary.model");
const parseError = require("../../utils/parseError");
const { validateCreateComment, validateGetComment, validateDeleteCommentary } = require("./Commentary.validator");


const CommentaryControler = {
    createComentary: async(req, res, next) => {
        try {
            await validateCreateComment(req.body)
            const { description, puntuation, author, adressedId } = req.body
            console.log({ puntuation })
            const newCommentary = await new Comentary({
                description,
                puntuation,
                author,
                adressedId
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
    },
    updateCommentary: async(req, res, next) => {
        try {
            await validateUpdateComment(req.body);

            const { id } = req.body;

            const commentaries = await Comentary.find({
                $or: [{ id }, { name: req.body.name }],
            });

            if (commentaries.length || commentaries.length > 1)
                throw { name: "updateError", message: "Cannot update commentary" };

            const commentary = await Commentary.findById(id);

            const updatedCommentary = {
                description: req.body.name || commentary.name,
                puntuation: req.body.name || commentary.name,
            };

            await Subject.findOneAndUpdate({ _id: commentary._id }, updatedCommentary);

            return res
                .status(200)
                .json({
                    error: false,
                    message: "Commentary was updated",
                })
                .end();
        } catch (error) {
            next(error);
        }
    },
    deleteCommentary: async(req, res, next) => {
        try {
            await validateDeleteCommentary(req.params);
            const { id } = req.params;

            await Comentary.findOneAndDelete(id);

            return res.status(200).json({
                error: false,
                message: "Commentary was delete",
            });
        } catch (error) {
            next(error);
        }
    },

}

module.exports = CommentaryControler