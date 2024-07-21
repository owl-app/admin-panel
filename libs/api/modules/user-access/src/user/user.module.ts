import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm.module'

import { UserEntitySchema } from '../database/entity-schema/user.entity-schema'
import { TenantEntitySchema } from '../database/entity-schema/tenant.entity-schema'
import { UserRepository } from '../database/repository/user.repository'

import { UserCrudController } from './features/v1/crud/crud.http.controller'
import { AssignAccessController } from './features/v1/assing-access/assign-access.http.controller'
import { UserAssembler } from './features/v1/crud/user.assembler'
import { ListFilterBuilder } from './features/v1/crud/list-filter.builder'
import { RegistrationController } from './features/v1/registration/registration.http.controller'
import { RegistrationHandler } from './features/v1/registration/registration.service'

@Module({
  imports: [
    CqrsModule,
    RbacTypeOrmModule.forFeature({}),
    TypeOrmModule.forFeature([TenantEntitySchema]),
    CrudTenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: UserEntitySchema,
          repository: UserRepository,
          dataProviderFilterBuilder: ListFilterBuilder
        }
      ],
      assemblers: [UserAssembler]
    })
  ],
  controllers: [
    UserCrudController,
    AssignAccessController,
    RegistrationController
  ],
  providers: [
    RegistrationHandler,
  ]
})
export class UserModule {}