import Joi from 'joi'
import { ConfigService, registerAs } from '@nestjs/config';
import JoiUtil, { JoiConfig } from '../utils/joi-config';

export const JWT_CONFIG_NAME = 'jwt';

export const JWT_CONFIG_PROVIDER = 'JwtConfig';

export interface IJwtConfig {
  secret: string;
  expiration_time: string;
  refresh_token_secret: string;
  refresh_token_expiration_time: string;
}

export const JwtConfigProvider = {
  inject: [ConfigService],
  provide: JWT_CONFIG_PROVIDER,
  useFactory: (
    config: ConfigService,
  ): IJwtConfig => config.get<IJwtConfig>(JWT_CONFIG_NAME)
}

export default registerAs(JWT_CONFIG_NAME, (): IJwtConfig => {
  const configs: JoiConfig<IJwtConfig> = {
    secret: {
      value: process.env.JWT_SECRET,
      joi: Joi.string()
        .default('thisisafakesecretchangeit')
        .required()
        .description('JWT secret key'),
    },
    expiration_time: {
      value: process.env.JWT_EXPIRATION_TIME,
      joi: Joi.string()
        .default('10m')
        .description('minutes after which access tokens expire'),
    },
    refresh_token_secret: {
      value: process.env.JWT_REFRESH_TOKEN_SECRET,
      joi: Joi.string()
        .default('thisisafakesecretchangeuy')
        .required()
        .description('JWT secret key'),
    },
    refresh_token_expiration_time: {
      value: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      joi: Joi.string()
      .default('30m')
        .description('minutes after which refresh tokens expire'),
    }
  };

  return JoiUtil.validate(configs);
});
