import { Module } from '@nestjs/common'

import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'

import { TenantTypeOrmModule } from '@owl-app/lib-api-core/tenant-typeorm/tenant-typeorm.module'
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'

import { TenantEntitySchema } from '../database/entity-schema/tenant.entity-schema'

import { CreateTenantWhenUserIsRegisteredDomainEventHandler } from './event-handlers/create-tenant-when-user-is-registered.domain-event-handler'
import { CreateTenantWhenUserIsCreatedDomainEventHandler } from './event-handlers/create-tenant-when-user-is-created.domain-event-handler'

@Module({
  imports: [
    WinstonLoggerModule,
    TenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: TenantEntitySchema,
          repository: InjectableRepository,
        }
      ]
    }),
  ],
  controllers: [

  ],
  providers: [
    CreateTenantWhenUserIsRegisteredDomainEventHandler,
    CreateTenantWhenUserIsCreatedDomainEventHandler
  ]
})
export class TenantModule {}