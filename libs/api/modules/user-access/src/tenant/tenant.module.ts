import { Module } from '@nestjs/common'

import { WinstonLoggerModule } from '@owl-app/winston-logger-nestjs'

import { TenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant-typeorm.module'
import { TenantRepository } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant.repository'

import { TenantEntitySchema } from '../database/entity-schema/tenant.entity-schema'

import { CreateTenantWhenUserIsRegisteredDomainEventHandler } from './event-handlers/create-tenant-when-user-is-registered.domain-event-handler'

@Module({
  imports: [
    WinstonLoggerModule,
    TenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: TenantEntitySchema,
          repository: TenantRepository,
        }
      ]
    }),
  ],
  controllers: [

  ],
  providers: [
    CreateTenantWhenUserIsRegisteredDomainEventHandler
  ]
})
export class TenantModule {}