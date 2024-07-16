
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm.module'

import { ClientEntitySchema } from './database/entity-schema/client.entity-schema'

import { ClientCrudController } from './client/features/v1/crud/crud.http.controller'
import { ClientModelAssembler } from './client/features/v1/crud/client.assembler'
import { ClientService } from './client/features/v1/crud/client.service'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CrudTenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: ClientEntitySchema
        }
      ],
      assemblers: [ClientModelAssembler]
    })
  ],
  controllers: [
    ClientCrudController,
  ],
  providers: [
    ClientService
  ]
})
export class ClientModule {}