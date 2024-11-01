
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { RbacTypeOrmModule } from '@owl-app/lib-api-core/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-core/tenant-typeorm/crud-tenant-typeorm-query.module'
import { TenantTypeOrmModule } from '@owl-app/lib-api-core/tenant-typeorm/tenant-typeorm.module'
import { ArchiveHandler } from '@owl-app/lib-api-core/command/archive.command'
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'
import { BaseRepository } from '@owl-app/lib-api-core/database/repository/base.repository'
import { getRepositoryToken } from '@owl-app/lib-api-core/typeorm/common/typeorm.utils'

import { TagEntitySchema } from './database/entity-schema/tag.entity-schema'

import { TagCrudController } from './tag/features/v1/crud/crud.http.controller'
import { TagAssembler } from './tag/features/v1/crud/tag.assembler'
import { ListFilterBuilder } from './tag/features/v1/crud/list-filter.builder'
import { ArchiveControllerController } from './tag/features/v1/archive/archive.http.controller'
import { TagEntity } from './domain/entity/tag.entity'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CqrsModule,
    TenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: TagEntitySchema,
          repository: InjectableRepository,
        }
      ]
    }),
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
    ArchiveControllerController,
  ],
  providers: [
    {
      provide: ArchiveHandler,
      useFactory: (repository: InjectableRepository<TagEntity>) => new ArchiveHandler(repository),
      inject: [getRepositoryToken(TagEntitySchema)],
    }
  ]
})
export class TagModule {}