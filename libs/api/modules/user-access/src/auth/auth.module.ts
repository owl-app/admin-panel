import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { JwtStrategy } from '@owl-app/lib-api-bulding-blocks/passport/jwt.strategy'
import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'

import { IJwtConfig, JWT_CONFIG_NAME, JwtConfigProvider } from '@owl-app/lib-api-bulding-blocks/config/jwt'
import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface'
import { TenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant-typeorm.module'
import { getTenantRepositoryToken } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.utils'
import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'

import type { IUserRepository } from '../database/repository/user-repository.interface'
import { UserRepository } from '../database/repository/user.repository'
import { UserEntitySchema } from '../database/entity-schema/user.entity-schema'
import { UserEntity } from '../domain/entity/user.entity'

import { LoginController } from './features/login/login.http.controller'
import { GetMeController } from './features/get-me/get-me.http.controller'
import { LoginHandler } from './features/login/login.service'
import JwtTokenService from './jwt-token.service'

@Module({
  imports: [
    CqrsModule,
    WinstonLoggerModule,
    RbacTypeOrmModule.forFeature({}),
    TenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: UserEntitySchema,
          repository: UserRepository,
        }
      ]
    }),
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
      inject: [ConfigService, getTenantRepositoryToken(UserEntity), JwtService],
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