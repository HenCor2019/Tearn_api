const joi = require('joi')

const validator = {
  validateSearch: (data) => {
    const validate = joi.object({
      pattern: joi.string().required()
    })

    return validate.validateAsync(data)
  }
}

module.exports = validator
