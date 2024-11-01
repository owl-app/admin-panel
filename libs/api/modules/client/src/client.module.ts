
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { RbacTypeOrmModule } from '@owl-app/lib-api-core/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-core/tenant-typeorm/crud-tenant-typeorm-query.module'
import { TenantTypeOrmModule } from '@owl-app/lib-api-core/tenant-typeorm/tenant-typeorm.module'
import { BaseRepository } from '@owl-app/lib-api-core/database/repository/base.repository'
import { ArchiveHandler } from '@owl-app/lib-api-core/command/archive.command'
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'
import { getRepositoryToken } from '@owl-app/lib-api-core/typeorm/common/typeorm.utils'

import { ClientEntitySchema } from './database/entity-schema/client.entity-schema'

import { ClientCrudController } from './client/features/v1/crud/crud.http.controller'
import { ClientAssembler } from './client/features/v1/crud/client.assembler'
import { ListFilterBuilder } from './client/features/v1/crud/list-filter.builder'
import { ClientEntity } from './domain/entity/client.entity'
import { ArchiveControllerController } from './client/features/v1/archive/archive.http.controller'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CqrsModule,
    TenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: ClientEntitySchema,
          repository: InjectableRepository,
        }
      ]
    }),
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
      queryServiceOpts: {
        useTransaction: true,
      }
    }),
  ],
  controllers: [
    ClientCrudController,
    ArchiveControllerController,
  ],
  providers: [
    {
      provide: ArchiveHandler,
      useFactory: (repository: InjectableRepository<ClientEntity>) => new ArchiveHandler(repository),
      inject: [getRepositoryToken(ClientEntitySchema)],
    }
  ]
})
export class ClientModule {}