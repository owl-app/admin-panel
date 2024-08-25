
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { DataSource } from 'typeorm'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/crud/crud-typeorm-query.module'
import { BaseRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/base.repository'

import { CrudController } from './features/v1/crud/crud.http.controller'
import { AssignController } from './features/v1/assign/assign.http.controller'
import { RevokeController } from './features/v1/revoke/revoke.http.controller'
import { RoleEntitySchema } from '../database/entity-schema/role.entity-schema'
import { ListFilterBuilder } from './features/v1/crud/list-filter.builder'
import { RoleSettingEntitySchema } from '../database/entity-schema/role-setting.entity-schema'
import { RoleService } from './features/v1/crud/role.service'
import { RoleAssembler } from './features/v1/crud/role.assembler'
import { BaseAuthEntitySchema } from '../database/entity-schema/base-auth.entity-schema'
import { AssignedPermissionsController } from './features/v1/assigned-permissions/assigned-permissions.http.controller'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature(),
    TypeOrmModule.forFeature([BaseAuthEntitySchema, RoleSettingEntitySchema]),
    CrudTypeOrmQueryModule.forFeature({
      importsQueryTypeOrm: [RbacTypeOrmModule.forFeature()],
      entities: [
        {
          entity: RoleEntitySchema,
          repository: BaseRepository,
          inject: [EventEmitter2],
          dataProvider: {
            filterBuilder: ListFilterBuilder,
          },
          assembler: RoleAssembler
        }
      ],
      queryService: {
        classService: RoleService,
        inject: [DataSource, 'RBAC_MANAGER']
      }
    })
  ],
  controllers: [
    CrudController,
    AssignedPermissionsController,
    AssignController,
    RevokeController,
  ],
})
export class RbacRoleModule {}