import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { JwtStrategy } from '@owl-app/lib-api-bulding-blocks/passport/jwt.strategy'

import config, { JwtConfigProvider  } from '@owl-app/lib-api-bulding-blocks/config'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // this not work in nx
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
      load: config,
    }),
    AuthModule,
    UserModule
  ],
  providers: [
    JwtConfigProvider,
    JwtStrategy
  ]
})
export class UserAccessModule {}
