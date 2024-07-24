import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { TenantTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant-typeorm-query.module'

import { UserEntitySchema } from '../database/entity-schema/user.entity-schema'
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
    TenantTypeOrmQueryModule.forFeature({
      entities: [
        {
          entity: UserEntitySchema,
          repository: UserRepository,
          inject: [EventEmitter2],
          dataProvider: {
            filterBuilder: ListFilterBuilder,
          },
          assembler: UserAssembler
        }
      ],
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