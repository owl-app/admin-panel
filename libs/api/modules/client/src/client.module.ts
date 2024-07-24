
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { TenantTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant-typeorm-query.module'

import { ClientEntitySchema } from './database/entity-schema/client.entity-schema'

import { ClientCrudController } from './client/features/v1/crud/crud.http.controller'
import { ClientAssembler } from './client/features/v1/crud/client.assembler'
import { ListFilterBuilder } from './client/features/v1/crud/list-filter.builder'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    TenantTypeOrmQueryModule.forFeature({
      entities: [
        {
          entity: ClientEntitySchema,
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