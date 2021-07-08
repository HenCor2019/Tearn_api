const joi = require('joi')

const validator = (module.exports = {
  validateCreation: (data) => {
    const validateCategory = joi.object({
      name: joi.string().max(40).required(),
      description: joi.string().max(100).required(),
      imgUrl: joi.string(),
      subjects: joi.string()
    })

    return validateCategory.validateAsync(data)
  },
  validateOneCategory: (data) => {
    const validate = joi.object({
      id: joi.string().required()
    })

    return validate.validateAsync(data)
  },
  validateUpdate: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      name: joi.string().max(40),
      description: joi.string().max(100),
      imgUrl: joi.string()
    })

    return validate.validateAsync(data)
  },

  validateDelete: (data) => {
    const validate = joi.object({
      id: joi.string().required()
    })

    return validate.validateAsync(data)
  }
})

module.exports = validator
