const joi = require('joi')

const validator = (module.exports = {
  validateSubjectBody: (data) => {
    const validateCategory = joi.object({
      name: joi.string().max(25).required(),
      categoryId: joi.string().required()
    })

    return validateCategory.validateAsync(data)
  },
  validateOneSubject: (data) => {
    const validate = joi.object({
      id: joi.string().required()
    })

    return validate.validateAsync(data)
  },
  validateUpdate: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      name: joi.string().max(25),
      url: joi.string()
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
