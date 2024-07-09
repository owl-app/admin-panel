import Joi from "joi"

export const createCompanyValidation = Joi.object({
  // email: Joi.string().required().email(),
  name: Joi.string().required(),
  users: Joi.array()
    .items({
      email: Joi.string().required().email(),
      // name: Joi.string().required(),
      // password: Joi.string().required()
    }),
  // password: Joi.string().required()
});