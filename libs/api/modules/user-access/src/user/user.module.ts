
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm.module'

import { UserEntitySchema } from '../database/entity-schema/user.entity-schema'
import { UserRepository } from '../database/repository/user.repository'

import { UserCrudController } from './features/v1/crud/crud.http.controller'
import { AssignAccessController } from './features/v1/assing-access/assign-access.http.controller'
import { UserAssembler } from './features/v1/crud/user.assembler'
import { UserService } from './features/v1/crud/user.service'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CrudTenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: UserEntitySchema,
          repository: UserRepository
        }
      ],
      assemblers: [UserAssembler]
    })
  ],
  controllers: [
    UserCrudController,
    AssignAccessController
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}