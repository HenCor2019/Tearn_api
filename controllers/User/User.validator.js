const joi = require("joi");

const UserValidator = {
  validateLoginFacebook: (data) => {
    const validate = joi.object({
      username: joi.string().required(),
      email: joi.string().email().required(),
      imgUrl: joi.string().required(),
    });

    return validate.validateAsync(data);
  },

  validateUpdateToTutor: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      courseId: joi.string(),
      favTutors: joi.string(),
      preference: joi.string(),
      subjectId: joi.string(),
      fullName: joi.string().required(),
      dot: joi.string().required(),
      languages: joi.array().items(joi.string()),
      description: joi.string().required(),
      responseTime: joi.string().required(),
      puntuation: joi.number(),
      commentary: joi.string(),
      reports: joi.string(),
    });

    return validate.validateAsync(data);
  },

  validateUpdateNormalUser: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
      username: joi.string(),
      imgUrl: joi.string(),
      preference: joi.string(),
      favTutor: joi.string(),
    });
    return validate.validateAsync(data);
  },

  validateId: (data) => {
    const validate = joi.object({
      id: joi.string().required(),
    });

    return validate.validateAsync(data);
  },
};

module.exports = UserValidator;
