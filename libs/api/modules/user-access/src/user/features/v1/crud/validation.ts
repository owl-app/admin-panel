import Joi from "joi"

export const createUserValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  companyId: Joi.string().optional(),
  phoneNumber: Joi.string().optional()
});