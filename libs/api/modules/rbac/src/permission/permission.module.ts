
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'

import { PermissionCrudController } from './features/v1/crud/crud.http.controller'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature()
  ],
  controllers: [
    PermissionCrudController
  ]
})
export class RbacPermissionModule {}