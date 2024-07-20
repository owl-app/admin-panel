import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import config from '@owl-app/lib-api-bulding-blocks/config'
import { DatabaseModule } from '@owl-app/lib-api-bulding-blocks/database/database.module'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { TenantModule } from './tenant/tenant.module'

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // this not work in nx
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
      load: config,
    }),
    AuthModule,
    TenantModule,
    UserModule
  ]
})
export class UserAccessModule {}
