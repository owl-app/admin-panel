
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'

import { CrudController } from './features/v1/crud/crud.http.controller'
import { AssignController } from './features/v1/assign/assign.http.controller'
import { RevokeController } from './features/v1/revoke/revoke.http.controller'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature()
  ],
  controllers: [
    CrudController,
    AssignController,
    RevokeController
  ]
})
export class RbacRoleModule {}