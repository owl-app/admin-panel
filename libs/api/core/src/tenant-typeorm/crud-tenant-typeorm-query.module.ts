import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { CompanyAware, Role, TenantAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { DEFAULT_DATA_SOURCE_NAME } from '../contants';
import { CrudTypeOrmQueryService } from '../crud/service/crud-typeorm-query.service';
import { FilterQuery } from '../registry/interfaces/filter-query';
import { EntitySetter } from '../registry/interfaces/entity-setter';
import {
  FILTER_REGISTRY_TENANT,
  SETTER_REGISTRY_TENANT,
} from '../registry/constants';

import { CompanySetter } from './setters/company.setter';
import { TenantRelationFilter } from './filters/tenant-relation.filter';
import { TenantRelationSetter } from './setters/tenant-relation.setter';
import {
  CrudTypeOrmQueryEntitiesOpts,
  CrudTypeOrmQueryModule,
} from '../crud/crud-typeorm-query.module';
import { RolesFilter } from './filters/roles.filter';

export interface CrudTenantTypeOrmQueryModuleOpts {
  entities: CrudTypeOrmQueryEntitiesOpts[];
}

@Module({})
export class CrudTenantTypeOrmQueryModule {
  static forFeature(
    opts: CrudTenantTypeOrmQueryModuleOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    return CrudTypeOrmQueryModule.forFeature(
      {
        ...opts,
        queryService: {
          classService: CrudTypeOrmQueryService,
          inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT],
        },
        importsQueryTypeOrm: [
          RegistryServiceModule.forFeature<FilterQuery<ObjectLiteral>>({
            name: FILTER_REGISTRY_TENANT,
            services: {
              tenant: TenantRelationFilter<TenantAware>,
              roles: RolesFilter<Role>,
            },
          }),
          RegistryServiceModule.forFeature<EntitySetter<ObjectLiteral>>({
            name: SETTER_REGISTRY_TENANT,
            services: {
              company: CompanySetter<CompanyAware>,
              tenant: TenantRelationSetter<TenantAware>,
            },
          }),
        ],
      },
      dataSource
    );
  }
}
