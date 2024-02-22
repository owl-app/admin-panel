import { Module } from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'

import { IJwtConfig, JWT_CONFIG_NAME } from '@owl-app/lib-api-bulding-blocks/config/jwt'
import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface'
import { LocalStrategy } from '@owl-app/lib-api-bulding-blocks/passport/local.strategy'
import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/context/app-request-context.service'

import { IUserRepository } from '../database/repository/user-repository.interface'
import { UserRepository } from '../database/repository/user.repository'
import { UserEntity } from '../database/entity/user.entity'

import JwtTokenService from './jwt-token.service'

import { LoginController } from './features/login/login.controller'
import { GetMeController } from './features/get-me/get-me.controller'

@Module({
  imports: [
    WinstonLoggerModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IJwtConfig>(JWT_CONFIG_NAME)

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
    GetMeController
  ],
  providers: [
    LocalStrategy,
    AppRequestContextService,
    {
      inject: [ConfigService, IUserRepository, JwtService],
      provide: IJwtTokenService,
      useFactory: (
        config: ConfigService,
        userRepository: IUserRepository,
        jwtService: JwtService,
      ) => new JwtTokenService(config.get<IJwtConfig>(JWT_CONFIG_NAME), userRepository, jwtService),
    },
    {
      provide: IUserRepository,
      useClass: UserRepository
    }
  ]
})
export class AuthModule {}