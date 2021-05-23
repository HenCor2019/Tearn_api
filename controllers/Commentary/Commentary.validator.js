const { string } = require("joi");
const joi = require("joi");

const validator = {
    validateCreateComment: body => {
        //creating joi object
        const joiValidator = joi.object({
            description: joi.string().required(),
            puntuation: joi.number().required()
        })
        return joiValidator.validateAsync(body)
    },
    validateGetComment: body => {
        //creating joi object
        const joiValidator = joi.object({
            id: joi.string().required()
        })
        return joiValidator.validateAsync(body)
    }
}

module.exports = validator;