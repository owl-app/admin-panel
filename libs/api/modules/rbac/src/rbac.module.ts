import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import config from '@owl-app/lib-api-core/config'
import { DatabaseModule } from '@owl-app/lib-api-core/database/database.module'

import { RbacPermissionModule } from './permission/permission.module'
import { RbacRoleModule } from './role/role.module'
import { BaseAuthEntitySchema } from './database/entity-schema/base-auth.entity-schema'

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
