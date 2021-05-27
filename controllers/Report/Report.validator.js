const joi = require('joi')

const validator = {
  validateCreationReport: (body) => {
    const validate = joi.object({
      userId: joi.string().required(),
      createdDateTime: joi.string().required(),
      description: joi.string().required(),
      tutorReportedId: joi.string().required()
    })

    return validate.validateAsync(body)
  }
}

module.exports = validator
