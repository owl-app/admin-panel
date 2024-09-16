
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmQueryModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm-query.module'
import { BaseRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/base.repository'

import { CompanyEntitySchema } from './database/entity-schema/company.entity-schema'

import { CompanyCrudController } from './company/features/v1/crud/crud.http.controller'
import { CompanyAssembler } from './company/features/v1/crud/company.assembler'
import { ListFilterBuilder } from './company/features/v1/crud/list-filter.builder'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CrudTenantTypeOrmQueryModule.forFeature({
      entities: [
        {
          entity: CompanyEntitySchema,
          repository: BaseRepository,
          dataProvider: {
            filterBuilder: ListFilterBuilder,
          },
          assembler: CompanyAssembler
        }
      ],
    })
  ],
  controllers: [
    CompanyCrudController,
  ],
})
export class CompanyModule {}