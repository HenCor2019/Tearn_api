const joi = require('joi')

const UserValidator = {
  validateLoginFacebook: (data) => {
    const validate = joi.object({
      username: joi.string().required(),
      email: joi.string().email().required(),
      imgUrl: joi.string().required()
    })

    return validate.validateAsync(data)
  },

  validateUpdateToTutor: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      coursesId: joi.array().items(joi.string()).required(),
      subjectsId: joi.array().items(joi.string()).required(),
      favTutor: joi.string(),
      preferences: joi.array().items(joi.string()),
      fullName: joi.string().required(),
      dot: joi.string().required(),
      languages: joi.array().items(joi.string()),
      description: joi.string().required(),
      responseTime: joi.string().required(),
      puntuation: joi.number(),
      availability: joi.array().items(joi.string()),
      commentary: joi.string(),
      reports: joi.string(),
      active: joi.bool()
    })

    return validate.validateAsync(data)
  },

  validateUpdateNormalUser: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      username: joi.string(),
      imgUrl: joi.string(),
      preferences: joi.array().items(joi.string()),
      favTutor: joi.string()
    })
    return validate.validateAsync(data)
  },

  validateId: (data) => {
    const validate = joi.object({
      id: joi.string().required()
    })

    return validate.validateAsync(data)
  }
}

module.exports = UserValidator
