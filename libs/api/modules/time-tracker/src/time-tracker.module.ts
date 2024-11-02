
import { Module } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CqrsModule } from '@nestjs/cqrs'

import { AppNestjsQueryTypeOrmModule } from '@owl-app/lib-api-core/query/module'
import { AppTypeOrmModule } from '@owl-app/lib-api-core/typeorm/app-typeorm.module'
import { BaseRepository } from '@owl-app/lib-api-core/database/repository/base.repository'
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'

import { TimeEntitySchema } from './database/entity-schema/time.entity-schema'

import { TimeCrudController } from './time/features/v1/crud/crud.http.controller'
import { TimeAssembler } from './time/features/v1/crud/time.assembler'
import { ListFilterBuilder } from './time/features/v1/crud/list-filter.builder'
import { WatchHandler } from './time/features/v1/stopwatch/watch.service'
import { StopWathController } from './time/features/v1/stopwatch/stopwatch.http.controller'
import { ContinueWatchHandler } from './time/features/v1/stopwatch/continue-watch.service'
import { InProgressController } from './time/features/v1/in-progress/in-progress.http.controller'
import { StopHandler } from './time/features/v1/stopwatch/stop.service'

@Module({
  imports: [
    CqrsModule,
    AppTypeOrmModule.forFeature({
      entities: [
        {
          entity: TimeEntitySchema,
          repository: InjectableRepository,
        }
      ]
    }),
    AppNestjsQueryTypeOrmModule.forFeature({
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
    StopWathController,
    InProgressController,
    TimeCrudController,
  ],
  providers: [
    WatchHandler,
    StopHandler,
    ContinueWatchHandler,
  ]
})
export class TimeTrackerModule {}