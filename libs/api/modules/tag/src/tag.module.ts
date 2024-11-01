
import { Module } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { RbacTypeOrmModule } from '@owl-app/lib-api-core/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-core/tenant-typeorm/crud-tenant-typeorm-query.module'
import { BaseRepository } from '@owl-app/lib-api-core/database/repository/base.repository'

import { TagEntitySchema } from './database/entity-schema/tag.entity-schema'

import { TagCrudController } from './tag/features/v1/crud/crud.http.controller'
import { TagAssembler } from './tag/features/v1/crud/tag.assembler'
import { ListFilterBuilder } from './tag/features/v1/crud/list-filter.builder'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CrudTenantTypeOrmQueryModule.forFeature({
      entities: [
        {
          entity: TagEntitySchema,
          repository: BaseRepository,
          inject: [EventEmitter2],
          dataProvider: {
            filterBuilder: ListFilterBuilder,
          },
          assembler: TagAssembler
        }
      ],
      queryServiceOpts: {
        useSoftDelete: true,
        useTransaction: true,
      }
    }),
  ],
  controllers: [
    TagCrudController,
  ],
})
export class TagModule {}