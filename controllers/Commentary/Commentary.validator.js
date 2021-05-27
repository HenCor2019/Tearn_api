const joi = require('joi')

const validator = {
  validateCreateComment: (body) => {
    // creating joi object
    const joiValidator = joi.object({
      description: joi.string().required(),
      puntuation: joi.number().required(),
      author: joi.string().required(),
      adressedId: joi.string().required()
    })
    return joiValidator.validateAsync(body)
  },
  validateId: (body) => {
    // creating joi object
    const joiValidator = joi.object({
      id: joi.string().required()
    })
    return joiValidator.validateAsync(body)
  },
  validateUpdateCommentary: (data) => {
    const joiValidator = joi.object({
      id: joi.string().required(),
      description: joi.string(),
      puntuation: joi.string()
    })

    return joiValidator.validateAsync(data)
  }
}

module.exports = validator
