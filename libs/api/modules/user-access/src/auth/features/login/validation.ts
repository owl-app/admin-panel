import Joi, { ExternalHelpers, ExternalValidationFunction } from 'joi'

import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface'

import { User } from '../../../domain/model/user'

export const validationExistUser =
  (
    jwtTokenService: IJwtTokenService<User>,
    email: string
  ): ExternalValidationFunction =>
  async (value: string, helper: ExternalHelpers) => {
    const user = await jwtTokenService.validateUserForLocalStragtegy(
      value,
      email
    );

    if (!user) {
      return helper.message({
        external: 'Invalid email or password',
      });
    }

    return value;
  };

export const loginValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
