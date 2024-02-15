import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'
import { NestjsQueryCoreModule } from '@owl-app/crud-core'
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'
import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/infrastructure/context';

import { IUserRepository } from './domain/repository/user-repository.interface'
import { IJwtConfig } from './domain/config/jwt-config.interface'

import { jwtConfigProvider } from './infrastructure/providers/jwt-config.provider';
import { loginProvider } from './infrastructure/providers/login.provider'
import { LocalStrategy } from './infrastructure/jwt/strategies/local.strategy'
import { JwtStrategy } from './infrastructure/jwt/strategies/jwt.strategy'
import { BcryptService } from './infrastructure/services/bcrypt.service'
import { isAuthenticatedProvider } from './infrastructure/providers/is-authenticated.provider'
import { UserEntity } from './infrastructure/persistence/entity/user'
import { UserService } from './infrastructure/services/crud.service'
import { UserAssembler } from './infrastructure/assembler/user.assembler'
import { UserRepository } from './infrastructure/persistence/repository/user.repository'
import { getMeProvider } from './infrastructure/providers/get-me.provider'
import { jwtServiceProvider } from './infrastructure/providers/jwt-service.provider'

import { UserCrudController } from './presentation/api/crud/crud.controller'
import { LoginController } from './presentation/api/login/login.controller'
import { IsAuthenticatedController } from './presentation/api/is-authenticated/is-authenticated.controller'
import { GetMeController } from './presentation/api/get-me/get-me.controller'

@Module({
  imports: [
    WinstonLoggerModule,
    NestjsQueryCoreModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
      assemblers: [UserAssembler]
    }),
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
    IsAuthenticatedController,
    UserCrudController,
    GetMeController
  ],
  providers: [
    // auth
    jwtConfigProvider,
    loginProvider,
    isAuthenticatedProvider,
    jwtServiceProvider,
    LocalStrategy,
    JwtStrategy,
    BcryptService,
    // user
    getMeProvider,
    UserService,
    UserRepository,
    AppRequestContextService,
    {
      provide: IUserRepository,
      useClass: UserRepository
    }
  ]
})
export class UserAccessModule {}
