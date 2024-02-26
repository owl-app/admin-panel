import Joi from "joi"

export const createUserValidation = Joi.object({
  email: Joi.string().required().email(),
  name: Joi.string().required()
});