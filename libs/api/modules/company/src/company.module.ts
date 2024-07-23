
import { Module } from '@nestjs/common'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { CrudTenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/crud-tenant-typeorm.module'
import { TenantRepository } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant.repository'

import { CompanyEntitySchema } from './database/entity-schema/company.entity-schema'

import { CompanyCrudController } from './company/features/v1/crud/crud.http.controller'
import { CompanyAssembler } from './company/features/v1/crud/company.assembler'
import { ListFilterBuilder } from './company/features/v1/crud/list-filter.builder'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    CrudTenantTypeOrmModule.forFeature({
      entities: [
        {
          entity: CompanyEntitySchema,
          repository: TenantRepository,
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