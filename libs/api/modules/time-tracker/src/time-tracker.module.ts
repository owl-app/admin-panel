
import { Module } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CqrsModule } from '@nestjs/cqrs'

import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm-query.module'
import { TenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant-typeorm.module'
import { BaseRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/base.repository'
import { InjectableRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/injectable.repository'

import { TimeEntitySchema } from './database/entity-schema/time.entity-schema'

import { TimeCrudController } from './time/features/v1/crud/crud.http.controller'
import { TimeAssembler } from './time/features/v1/crud/time.assembler'
import { ListFilterBuilder } from './time/features/v1/crud/list-filter.builder'
import { WatchHandler } from './time/features/v1/stopwatch/watch.service'
import { StopWathController } from './time/features/v1/stopwatch/stopwatch.http.controller'
import { ContinueWatchHandler } from './time/features/v1/stopwatch/continue-watch.service'

@Module({
  imports: [
    CqrsModule,
    TenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: TimeEntitySchema,
          repository: InjectableRepository,
        }
      ]
    }),
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
    StopWathController,
  ],
  providers: [
    WatchHandler,
    ContinueWatchHandler
  ]
})
export class TimeTrackerModule {}