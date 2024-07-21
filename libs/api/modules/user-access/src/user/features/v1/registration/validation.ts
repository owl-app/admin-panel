import Joi from 'joi'

export const registrationValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});
