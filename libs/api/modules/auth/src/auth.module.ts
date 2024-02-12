import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'
import { SharedUserModule } from '@owl/server-common-user';

import { IJwtConfig } from './domain/config/jwt-config.interface';

import { IS_AUTHENTICATED_USECASE } from './application/is-authenticated'
import { LOGIN_USECASE } from './application/login';

import { jwtConfigProvider } from './infrastructure/providers/jwt-config.provider';
import { loginProvider } from './infrastructure/providers/login.provider';
import { LoginController } from './presentation/api/login/login.controller';
import { JwtTokenService } from './infrastructure/jwt/services/jwt.service';
import { LocalStrategy } from './infrastructure/jwt/strategies/local.strategy'
import { JwtStrategy } from './infrastructure/jwt/strategies/jwt.strategy'
import { BcryptService } from './infrastructure/services/bcrypt.service'
import { isAuthenticatedProvider } from './infrastructure/providers/is-authenticated.provider'

import { IsAuthenticatedController } from './presentation/api/is-authenticated/is-authenticated.controller'

@Module({
  imports: [
    SharedUserModule,
    WinstonLoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IJwtConfig>('jwt')

        return {
          secret: config?.secret,
          signOptions: { expiresIn: '24h' }
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [
    LoginController,
    IsAuthenticatedController
  ],
  providers: [
    jwtConfigProvider,
    loginProvider,
    isAuthenticatedProvider,

    JwtTokenService,
    LocalStrategy,
    JwtStrategy,
    BcryptService
  ],
  exports: [
    LOGIN_USECASE,
    IS_AUTHENTICATED_USECASE
  ]
})
export class AuthModule {}
