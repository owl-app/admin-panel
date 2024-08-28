
import { Module } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm-query.module'
import { BaseRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/base.repository'

import { TimeEntitySchema } from './database/entity-schema/time.entity-schema'

import { TimeCrudController } from './time/features/v1/crud/crud.http.controller'
import { TimeAssembler } from './time/features/v1/crud/time.assembler'
import { ListFilterBuilder } from './time/features/v1/crud/list-filter.builder'

@Module({
  imports: [
    CrudTenantTypeOrmQueryModule.forFeature({
      entities: [
        {
          entity: TimeEntitySchema,
          repository: BaseRepository,
          inject: [EventEmitter2],
          dataProvider: {
            filterBuilder: ListFilterBuilder,
          },
          assembler: TimeAssembler
        }
      ],
    }),
  ],
  controllers: [
    TimeCrudController,
  ],
})
export class TimeTrackerModule {}