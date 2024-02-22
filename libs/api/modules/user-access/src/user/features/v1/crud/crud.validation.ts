import Joi from "joi"

export const createUserValidations = Joi.object({
  email: Joi.string().required().email(),
  name: Joi.string().required()
});