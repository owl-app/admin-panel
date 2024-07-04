import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import {TypeOrmModule} from '@nestjs/typeorm'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from '@owl-app/lib-api-bulding-blocks/passport/jwt.strategy'
import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'

import { IJwtConfig, JWT_CONFIG_NAME, JwtConfigProvider } from '@owl-app/lib-api-bulding-blocks/config/jwt'
import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface'

import { IUserRepository } from '../database/repository/user-repository.interface'
import { UserRepository } from '../database/repository/user.repository'
import { UserEntity } from '../database/entity/user.entity'

import { LoginController } from './features/login/login.http.controller'
import { GetMeController } from './features/get-me/get-me.http.controller'
import { LoginHandler } from './features/login/login.service'
import JwtTokenService from './jwt-token.service'


@Module({
  imports: [
    CqrsModule,
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
    JwtConfigProvider,
    JwtStrategy,
    LoginHandler,
    {
      provide: IUserRepository,
      useClass: UserRepository
    },
    {
      inject: [ConfigService, IUserRepository, JwtService],
      provide: IJwtTokenService,
      useFactory: (
        config: ConfigService,
        userRepository: IUserRepository,
        jwtService: JwtService,
      ) => new JwtTokenService(config.get<IJwtConfig>(JWT_CONFIG_NAME), userRepository, jwtService),
    },
  ]
})
export class AuthModule {}