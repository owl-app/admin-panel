
import { Module } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm-query.module'
import { BaseRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/base.repository'

import { ClientEntitySchema } from './database/entity-schema/client.entity-schema'

import { ClientCrudController } from './client/features/v1/crud/crud.http.controller'
import { ClientAssembler } from './client/features/v1/crud/client.assembler'
import { ListFilterBuilder } from './client/features/v1/crud/list-filter.builder'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CrudTenantTypeOrmQueryModule.forFeature({
      entities: [
        {
          entity: ClientEntitySchema,
          repository: BaseRepository,
          inject: [EventEmitter2],
          dataProvider: {
            filterBuilder: ListFilterBuilder,
          },
          assembler: ClientAssembler
        }
      ],
    }),
  ],
  controllers: [
    ClientCrudController,
  ],
})
export class ClientModule {}