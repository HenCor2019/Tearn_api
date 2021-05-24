const { string } = require("joi");
const joi = require("joi");

const validator = {
    validateCreateComment: body => {
        //creating joi object
        const joiValidator = joi.object({
            description: joi.string().required(),
            puntuation: joi.number().required(),
            author: joi.string().required(),
            adressedId: joi.string().required()
        })
        return joiValidator.validateAsync(body)
    },
    validateGetComment: body => {
        //creating joi object
        const joiValidator = joi.object({
            id: joi.string().required()
        })
        return joiValidator.validateAsync(body)
    },
    validateUpdateCommentary: (data) => {
        const joiValidator = joi.object({
            description: joi.string().required(),
            puntuation: joi.string().required(),
        });

        return joiValidator.validateAsync(data);
    },
    validateDeleteCommentary: (data) => {
        const validate = joi.object({
            id: joi.string().required(),
        });

        return validate.validateAsync(data);
    },
}

module.exports = validator;