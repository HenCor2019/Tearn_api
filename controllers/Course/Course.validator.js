const joi = require('joi')

const validator = {
  validateCreation: (data) => {
    const validate = joi.object({
      name: joi.string().required(),
      subjectId: joi.string().required(),
      imgUrl: joi.string().required()
    })

    return validate.validateAsync(data)
  },
  validateParams: (data) => {
    const validate = joi.object({
      id: joi.string().required()
    })
    return validate.validateAsync(data)
  },
  validateUpdate: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      name: joi.string(),
      url: joi.string(),
      subjectId: joi.string()
    })
    return validate.validateAsync(data)
  },
  validateDelete: (data) => {
    const validate = joi.object({
      id: joi.string().required()
    })

    return validate.validateAsync(data)
  }
}

module.exports = validator
