import { ConfigService } from "@nestjs/config";

import { IJwtConfig, JWT_CONFIG_NAME } from "../../domain/config/jwt-config.interface";

export const JWT_CONFIG = 'JwtConfig';

export const jwtConfigProvider = {
  inject: [ConfigService],
  provide: JWT_CONFIG,
  useFactory: (
    config: ConfigService,
  ): IJwtConfig|undefined => config.get<IJwtConfig>(JWT_CONFIG_NAME)
}