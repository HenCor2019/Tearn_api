const joi = require('joi')

const validator = {
  validateCreateComment: (body) => {
    const joiValidator = joi.object({
      description: joi.string().required(),
      puntuation: joi.number().required().min(1).max(5),
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
      puntuation: joi.number()
    })

    return joiValidator.validateAsync(data)
  }
}

module.exports = validator
