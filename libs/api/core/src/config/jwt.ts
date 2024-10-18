import Joi from 'joi';
import { ConfigService, registerAs } from '@nestjs/config';
import JoiUtil, { JoiConfig } from '../utils/joi-config';

export const JWT_CONFIG_NAME = 'jwt';

export const JWT_CONFIG_PROVIDER = 'JwtConfig';

export interface IJwtConfig {
  secret: string;
  expiration_time: string;
  cookie: {
    domain: string;
    http_only: boolean;
    secure: boolean
  }
  refresh_token_secret: string;
  refresh_token_expiration_time: string;
}

export const JwtConfigProvider = {
  inject: [ConfigService],
  provide: JWT_CONFIG_PROVIDER,
  useFactory: (config: ConfigService): IJwtConfig =>
    config.get<IJwtConfig>(JWT_CONFIG_NAME),
};

export default registerAs(JWT_CONFIG_NAME, (): IJwtConfig => {
  const configs: JoiConfig<IJwtConfig> = {
    secret: {
      value: process.env.JWT_SECRET,
      joi: Joi.string()
        .default('thisisafakesecretchangeit')
        .required()
        .description('JWT secret key'),
    },
    cookie: {
      value: {
        domain: process.env.JWT_COOKIE_TOKEN_DOMAIN || 'localhost',
        http_only: (process.env?.JWT_COOKIE_TOKEN_HTTP_ONLY === "true" || process.env?.JWT_COOKIE_TOKEN_HTTP_ONLY === "1") || true,
        secure: (process.env?.JWT_COOKIE_TOKEN_SECURE === "true" || process.env?.JWT_COOKIE_TOKEN_SECURE === "1") || false,
      },
      joi: Joi.object().keys({
        domain: Joi.string()
          .default('localhost')
          .required()
          .description('Cookie token domain'),
        http_only: Joi.boolean()
          .default(true)
          .required()
          .description('Cookie token http only'),
        secure: Joi.boolean()
          .default(false)
          .required()
          .description('Cookie token secure'),
      })
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
    },
  };

  return JoiUtil.validate(configs);
});
