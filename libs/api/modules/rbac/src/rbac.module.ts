import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import config from '@owl-app/lib-api-bulding-blocks/config'
import { DatabaseModule } from '@owl-app/lib-api-bulding-blocks/database/database.module'

import { RbacPermissionModule } from './permission/permission.module'
import { RbacRoleModule } from './role/role.module'

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // this not work in nx
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
      load: config,
    }),
    RbacPermissionModule,
    RbacRoleModule
  ]
})
export class RbacModule {}
